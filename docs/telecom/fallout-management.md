# Fallout management: when provisioning fails

In a telecom OSS, a provisioning error isn't an exception buried in a log. It's a **fallout**: a typed event in the order's lifecycle, with a code, a type, the system that failed and its message. The order usually goes to **held**, and an operator decides what to do next. Handling fallouts is part of the operator's daily work (and the failure may not even be the OSS's fault: dirty data downstream is common), so for QA it's a feature to test like any other, and one of the best places to find bugs.

## The four actions, and the trap in one of them

| Action | What it does |
|---|---|
| **Retry** | Re-runs the failed task from the point where it broke |
| **Continue** | Ignores the error and moves on to the next task |
| **Cancel** | Cancels that task. It counts as a failure: if other items already completed, the order ends `partial` |
| **Restart** | Cleans up and relaunches **only the process that failed** from its start, including removing the tasks and forms it had created. Other processes of the order that already completed are untouched. |

There are no actions on items that already completed; there are on pending ones.

**The trap of continue.** Workflow tasks pass values to each other along the chain. If the task that broke was supposed to *produce* a value (a SIM number, a network key), the next task receives `null` and raises a new fallout, a data error this time. You've traded one fallout for another. Use continue only when the broken task's output feeds nothing downstream. When continue chains fallouts or retry makes no progress, **restart** (with a comment explaining why). And if a restart reproduces exactly the same failure, that's evidence of a configuration problem in the environment, not a transient glitch.

Two more rules from experience: if a cancellation is being assessed, all four actions are disabled until someone decides (see [assessing cancellation](/telecom/service-orders-tmf641#cancellations)); and when the cancellation's own process fails, any continue or skip applies to the **cancellation task**, never to the original order.

## Diagnosing a fallout in three steps

1. **Read the error literally** and keep the property that fails.
2. **Find which CFS or RFS owns that property** (the solution's documentation should tell you).
3. **Compare with an order of the same use case that went well**: which characteristics does one have that the other lacks?

The third step is the one that gets skipped when the person looking isn't QA: the error gets diagnosed in the abstract instead of against a reference that works. The general method (same use case, same environment, same day; a third case before claiming a cause) is in [investigating hard failures](/strategy/investigating-hard-failures).

Clues that shortened real triages:

- **`Cannot get property 'x' on null object`** means the parent object is missing. In one production case, it wasn't a size field that was absent but the whole IP network object that should contain it.
- **Two fallouts in the same second can be two different errors.** One failed reading a value on one line of the script, the other a different field in another function. Pairs often belong to two RFS that share a process. Open both.
- **A low-level error in a connector is a symptom.** A `NoSuchMethodError` thrown while the HTTP client *handles a response* means the call returned an error (a 4xx or 5xx) the connector didn't know how to handle. Find that call. You can often prove it without a developer: compare the workflow variables (a key that was computed correctly vs. the stored reference that never got updated), then confirm with a `GET` to the inventory.
- **A transient error is retried and documented before it's called a bug.** A rate-limited inventory mock (`429`) produced fallouts that a retry resolved.
- **Some fallouts are orphans**: still pending and actionable, but retry does nothing because the item completed anyway.
- **A characteristic with no type can't be edited in the UI**, so retrying the fallout will never fix it.
- **An inventory outage leaves in-flight orders recoverable only if the fallout actually fires.** Test what happens when a dependency is down, not just when it answers badly.

## A test family worth designing: inconsistent systems

A real case: the inventory said a SIM was free, but in the activation platform it was in use by someone else, because it had been released badly in an old cancellation. The order passed the first steps and failed at the end. Design cases where **a piece of data is consistent in one system and inconsistent in another**, and validate that the fallout captures it with the right detail and allows a retry once the data is corrected.

## Testing the categorization rules

Fallouts are usually categorized by a **rules engine** that matches the error log against rules, each with a priority. With Drools-style rules (`salience`), all rules from all files are evaluated against the same log and, among those that match, the highest priority wins.

- **Two rules that match the same text with the same priority give an unpredictable code**: the firing order isn't guaranteed, and the operator can see a code that doesn't correspond to the failure.
- **Static review method**: build a table (code, file, the strings in the `when` clause, priority), sort it by priority, and look for pairs where one rule's strings appear in the log that triggers the other. A **generic rule with higher priority than a specific one** is another red flag. Then confirm dynamically by forcing the failure.
- **A comment saying "delete" doesn't disable a rule.** A story claimed a rule had been removed because a generic one now covered it; in the deployed file the rule was still there, active, preceded only by a comment. Check the deployed file in both directions: codes the story documents that don't exist, and active rules the story says were removed. *The story describes the intention; the deployed file describes the behavior.*
- **Coverage**: to close a rules story, one forced fallout per rules file touched is enough, not one per code.
- **Don't assert on message text** in automated checks if the error texts are being rewritten for readability; assert on codes.

## Forcing fallouts on purpose

Waiting for a failure to happen naturally doesn't scale. Force them:

- **Reuse an identifier that was already used** to force a creation failure downstream.
- **A permanently forced fallout** (a stub that always fails) lets you reuse the same order across every retry you need to test.
- **Review developer-forced failures asynchronously.** The fallout stays on the order with its code and message until someone acts. Ask the developer for the link to each order and the failure forced on it; ask them **not** to retry, continue or restart "to clean up" (that destroys the evidence) and not to redeploy the rules until you've reviewed them.

## Keep a known-errors base

A living catalog of known errors (symptom, diagnosis, action; for example "external reference already used → resend with a new one") is one of the most profitable investments a QA team can make. Check it before investigating from scratch.

And when a known error needs recurring manual intervention, it deserves **a tool, not database access**. Fixing it by hand in the database risks inconsistent IDs; a dedicated support endpoint is safer, and it's new surface for QA to test.

::: tip Key idea
A fallout is a feature, not a log line: it has states, actions and rules, and each can be wrong. Test the actions (especially continue), test the categorization rules statically and dynamically, and always diagnose against an order that worked.
:::

## Related

- [Service orders (TMF641)](/telecom/service-orders-tmf641): the lifecycle fallouts live in.
- [Testing workflows on a BPM engine](/telecom/testing-bpm-workflows): the processes that raise them.
