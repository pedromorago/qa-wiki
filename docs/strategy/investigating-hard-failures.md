# Investigating hard failures: intermittent bugs and production incidents

Some failures don't fit the "reproduce → report → fix" loop: they happen one time in five, only in production, or only to one order among hundreds. A bug reported as "sometimes it breaks" sinks to the bottom of the backlog. What a QA brings here is **method**: turning a hunch into evidence a developer can act on.

These are the habits I rely on, most of them learned triaging long, asynchronous provisioning flows in telecom, where one order crosses half a dozen systems and any of them can be the culprit.

## 1. Rule out the environment before blaming the code

Half of the "bugs" I've chased in shared environments were the environment itself. Before investigating:

- **Is the environment healthy?** Maintenance windows aren't always announced, and one broken piece (an expired certificate, a database down) can take everything else with it. A cheap read-only call (a `GET` to a stable resource) is a good smoke test before starting.
- **Which version is actually deployed?** Compare the ticket's *fix version* with the release installed in the environment. For a fix on a dev environment, check that the deployed image comes from the fix branch and not from the integration branch.
- **Do the versions match across components?** A process and the subprocess it calls, or a service and the workflow engine behind it, running different versions is a classic source of errors that look like data problems.
- **Am I looking at the right attempt?** With retries, reused identifiers or several people launching the same flow, it's easy to read the response of a *different* execution. Confirm the ID before writing a single line of the report.

## 2. Intermittent bugs: a control run beats repeating the failing case

Re-running the failing case ten times tells you it fails sometimes, and you already knew that. What moves the investigation forward is a **control execution in the same time window**, with each run designed to answer one question:

1. **Alone** → confirms or rules out concurrency.
2. **In parallel**, replicating the original conditions → reproduces the failure.
3. **Numbered and timestamped**: give each execution a distinguishable ID and note the exact time you sent it.

If one run gets stuck and its twin finishes fine in the same pod a minute later, you have a clean comparison: same environment, version, build and event sequence, **two different outcomes**. A small table of runs plus the log showing the control order completing while the other one stalls is something development can act on.

Two disciplines go with it:

- **Don't touch the stuck item.** Leave it as live evidence: someone may need to inspect its state in the database.
- **Separate what's proven from what's suspected.** If a signal (say, a suspicious race in the logs) also appears in the run that worked, it's a correlation, not the cause. Report it as such: selling an unproven cause costs the whole ticket its credibility.

## 3. Compare with a good twin, then with a third case

Comparing a failed case with a successful one is the fastest diagnosis there is, but only if the comparison is fair.

- **Same use case, same environment, same version, same day.** Then the only variable left is the input. A successful case from another use case or two months earlier helps you get your bearings, not reach a conclusion: any difference could come from the product version.
- **A difference is not a cause until a third case breaks the correlation.** In one production incident, the broken order carried two fields the good one didn't have, and they looked guilty. A third order with those same fields *and* complete data proved them innocent. With two cases you can't tell correlation from causation.
- **Read what came in before asking for the payload.** In a service-ordering system, the customer-facing element of the order shows the data that arrived. Comparing it between the failed and the good order tells you whether a piece of data was missing from the origin or got lost along the way, without waiting for someone to dig out the original request.

## 4. Read error messages literally

- **"Cannot get property `x` on null object"** means the **parent object** is missing, not the field. Look for a whole object that never arrived, not a badly filled value. The stack trace usually gives the function and line of the script, which points to the exact spot without access to the code.
- **Wrapped errors are symptoms.** A low-level error from an HTTP client library (for example a `NoSuchMethodError` thrown while *handling* a response) usually hides the real problem: the HTTP call that returned an error. Find that call.
- **Two errors in the same second can be two different errors.** Open both. When failures come in pairs, they often belong to two sibling elements that share a process, and each one tells half the story.
- **Know where nulls sort.** It depends on the stack (in ascending order, MySQL and SQL Server put them first, PostgreSQL and Oracle last). When a task inbox gained sorting by date, the undated tasks came out on top, and those were exactly the orphaned ones. A correct sort can look broken in an environment full of garbage, so check where nulls go on purpose.
- **Formats lie.** A lost leading zero breaks a comparison between two systems even though the value is "the same". A date compared by its text representation rather than by its instant breaks across time zones. Logs are often in UTC while the UI is in local time.

## 5. Patterns worth recognizing

| Symptom | Suspect |
|---|---|
| Intermittent failure that "fixes itself" when you resend | State saved **before** the operation that can fail; the retry sees "already done" and skips. Test the retry *after* a failure explicitly. |
| A bug fixed months ago is back | The fix was overwritten by a later change (a merge, a dependency upgrade). Check what's deployed and the recent changes before asking for new development. A fix without a regression test can disappear. |
| Reproduces in only one environment | Possibly the **input data**, not the system. |
| A mocked endpoint returns exactly the same bytes before and after an operation | A static stub: the check is partial in that environment. See [mocks](/strategy/mocks-in-integration-testing). |
| A timeout "fixed" | Not closed on the first green run: it stays under observation for at least a sprint. |

## 6. When you can't reproduce it

- **A bug you can't reproduce stays open** and gets carried over. Closing it destroys the only record that it happened.
- **Reproduce live, together**: developer watching the logs, services freshly restarted, and you announcing each launch before you send it.
- **Split the work when the environment can't produce the failure**: QA covers the happy path in the environment, the developer simulates the failure modes.
- **A test can go green without testing anything.** If the conditions that triggered the bug weren't reproduced, a pass proves nothing. Say explicitly which conditions you reproduced.
- **Force the failure on purpose** when you need it: a known-bad input, a reused identifier, a stub that always fails. A deliberate error works like a breakpoint and lets you inspect the item in the state you care about.

## 7. Production: evidence before touching anything

- **Screenshot before, screenshot after, share both.** Manual fixes on production items (skips, patches) done without a record leave everyone guessing later, including about what needs automating. If a scenario simply isn't implemented, say so instead of patching around it.
- **A misconfigured parameter in every environment isn't fixed by hand in one of them.** It goes through the normal cycle, environment by environment and with tests, even if it's trivial: a manual hotfix buys speed and pays for it with environments that no longer match.
- **A fix applied directly in an environment also goes into a pull request** to the deployable artifact. Otherwise the next deployment silently reverts it.
- **In support, QA's job isn't to solve the ticket**: it's to assess the impact, add context, and judge whether the escalation is right.
- **Recurring incidents need a ticket.** Invisible work doesn't exist, and a **known-errors base** (symptom, cause, fix) speeds up the next triage. For repetitive incidents: fix one, extract the procedure, hand it over.

::: tip Key idea
Every run you launch should answer one question, and every claim in the report should be labeled as either proven or suspected. That's the difference between "it fails sometimes" and a bug that gets fixed this sprint.
:::

## Related

- [Bug reporting](/fundamentals/bug-reporting): how to write up what you found.
- [Bug root cause analysis](/strategy/bug-root-cause-analysis): classifying where bugs come from, in aggregate.
- [Test environments strategy](/strategy/test-environments-strategy): what each environment can and can't prove.
