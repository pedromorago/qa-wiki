# Testing workflows on a BPM engine

Provisioning flows in an OSS are rarely hand-written code paths. They're usually modeled in **BPMN** and executed by a **BPM engine**: processes that call subprocesses, connectors that call external systems, human tasks with forms that a technician fills in, and timers. The engine is powerful, and it has sharp edges that make tests pass when they shouldn't or fail for reasons unrelated to the order. What follows is engine-agnostic: I learned it on one product, but the traps come from how BPM engines work.

## The building blocks, from a tester's point of view

| Piece | What to keep in mind |
|---|---|
| **Process / subprocess (call activity)** | Each has its own **version** and its own **case ID**. A subprocess case points to its parent (the *root*) but isn't the same case. |
| **Connector** | A call to an external system with *output operations* that write the results into process variables. If it's skipped, those variables are never written. |
| **Human task + form** | Assigned to a user or a group, filled in through the user-facing application (not the admin console), with its own save/submit semantics. |
| **Timer** | Starts tasks by time, not by the completion of the previous step. |

## Versions: the first suspect

- **A version mismatch between a process and the subprocess it calls produces errors that look like order problems** ("the connector instance of type call activity doesn't exist", "process definition is not enabled"). They're deployment problems. Check which version is enabled (the admin console shows it) before debugging the order.
- **Version drift between environments** is a usual suspect when something works in one environment and not in another.
- **After deploying a new process version, old cases can break**: forms that don't load, or cases that "don't exist". That's corruption from the upgrade, not the bug you were investigating.
- **Engines constrain how processes are replaced.** Duplicate names may not be allowed, deleting a process with open cases may require upgrading it first, and a subprocess may not be deletable without its parent. Plan variants and cleanup with that in mind.
- **Don't modify the vendor's core processes from a project.** Many use cases share them and each product release overwrites them, so your change silently disappears. If a use case needs different behavior, add a task of its own in that use case and leave the core intact. And when a core process *does* get touched, review it with a magnifying glass.

## Skipping a task is not free

Engines let an administrator **skip** (omit) a failed task to move a case forward. It's tempting in test environments, and it has two costs:

1. **The connector's output operations don't run**, so the values that task should have written stay empty, and something downstream fails later for no visible reason.
2. **Skipped instances can be left orphaned**, consuming memory and never finishing.

The rule I follow: skipping is acceptable **only for side effects of the environment** that aren't the object of the test (sending an email in an environment with no mail server), and it's documented. **Never skip the task the test verifies.** Skipping the "create work order" step doesn't unblock the test, it empties it: there's no work order ID, the callbacks can't be correlated, and any later "completed" is fabricated. *A held order that tells the truth is better evidence than a completed one you manufactured.*

Two related behaviors:

- **A failed automatic step doesn't block the human tasks of the case, but the case never completes.** The form works, the order hangs.
- **Every failure of a task that calls a subprocess can create a new subprocess instance.** Retries accumulate instances; count them.

## Human tasks and task inboxes

- **Include subprocess tasks when you test an inbox.** A root-process task has its own case as root; a subprocess task has its own case ID *and* a root pointing to the parent. An application that used the subprocess ID as the root couldn't find some tasks at all. Test assign, unassign and search with tasks living in subprocesses, not just in the root process.
- **Undated tasks sort first**, and in a dirty environment those are usually the orphans whose process no longer exists. Decide where nulls should go and test it.
- **Orphaned human tasks may only be removable through the database** (the API refuses because they have no process). That's a delicate operation for whoever owns the engine's infrastructure, not a test step.
- **Test permissions with real users.** Checking that a form is assigned to the right group using the system administrator proves nothing: the administrator belongs to every group. And a task assigned to another user can be forbidden (`403`) even for members of the same group until it's released and reassigned.
- **Single sign-on can get in the way.** With the front end's SSO session open, the engine's UI may refuse to load; an incognito window tells you whether it's a session conflict or a real outage.

## Forms

- **Save and submit mean different things**, and not always the same thing on every form. On one form, "save" stored partial data without advancing and a separate button submitted; on another, "save" *completed* the task and re-instantiated it (a reschedule), keeping some inputs and deliberately emptying others. Test both buttons on every form.
- **A form with no mandatory fields can be submitted empty.** Is that intended?
- **Lists of values that can grow** (providers, regions, equipment models) shouldn't be hardcoded in the form.
- **When several forms feed the same output record** (one per carrier, say), fill each one with **distinguishable values** (same fields, suffixes `-001`, `-002`…). Otherwise you can't verify which value came from which form.
- **Forms can be instantiated by timers** (for example, expected completion date minus a number of days), not when the previous step completes. Time-based behavior needs its own tests.

## Engine queries and performance

- **An unbounded search** (no search key at all) against the engine ended in a timeout. Test the empty search.
- **Long lists may not load** with many records. The workaround of lowering the page size in the request is a hint for a bug report, not a fix.

::: tip Key idea
In a BPM-driven flow, most false passes come from skipping and most false failures from version drift. Check versions first, never skip the step under test, and test human tasks with real users and with tasks that live in subprocesses.
:::

## Related

- [Fallout management](/telecom/fallout-management): what happens when a task in these processes fails.
- [Service orders (TMF641)](/telecom/service-orders-tmf641): the order these workflows execute.
