# Test management in Jira with Xray

[Xray](https://www.getxray.app/) turns Jira into a test management tool: tests, plans and executions become Jira issues, linked to the stories they verify. The tool is easy to click through and surprisingly easy to use *wrong*. Traceability only works if everyone follows the same model. These are the rules I learned on a project with several teams sharing one Jira, where a badly hooked-up plan could hide a whole team's testing.

## The model: recipe, container, pass

| Issue | What it is | Answers |
|---|---|---|
| **Test** | The **recipe**: steps, data, expected result. Reusable. | *How* is this behavior checked? |
| **Test Plan (TP)** | The **container** of a campaign: which tests must run for a sprint or a release. | What's the quality status of this sprint/release? |
| **Test Execution (TE)** | One **pass** of some tests on a given environment and build. It holds the verdicts and the evidence. | What happened when we ran them *here*? |
| **Sub Test Execution** | A Test Execution created as a sub-task of a story. | What happened when we ran this story's tests? |

Three consequences took me a while to internalize:

- **The environment lives in the execution, not in the test.** The same test can be PASSED in the sprint execution on the test environment and still TO DO in the release regression. Those are two different validations of the same recipe, and that's exactly what you want.
- **Only what hangs from the Test Plan counts.** The plan's *Overall Execution Status* is fed by the tests *inside the plan* and the executions created from it. An execution that hangs from the story but not from the plan is invisible to the campaign.
- **A Jira issue link is not plan membership.** A `tests` / `is tested by` link between a test and a story drives the story's **coverage** (UNCOVERED → NOTRUN → OK / NOK). Belonging to a Test Plan is internal to Xray and is done with **Add Tests**. Adding a link by hand doesn't change the plan's total. If plans are generated automatically at the start of the sprint, *before* the tests exist, adding the tests to the plan is a manual step. Nobody had written it down, and that's how a team ended up with an empty plan.

## The creation order that keeps traceability

1. **Create the test from the story** (Add Tests / create test from the requirement), so it's linked from birth.
2. **Write or import the steps.** Each step has three parts: **Action**, **Data**, **Expected Result**. Steps can be imported from a CSV with exactly those three column names, one test per file.
3. **Add it to the Test Plan** with Add Tests.
4. **Create the execution from the Test Plan**, never from the story and never with the "run" button of the test itself. Running from the test creates a loose *ad hoc* execution with no plan, no story and no environment, which you then have to repair by hand.

**Retesting** after a fix: create a **new execution from the plan** selecting only the failed tests. Never reopen or overwrite the old one. The two iterations, fail and then pass, are evidence, not noise.

## Writing a test that ages well

### The description

Copying the story into the test description is debt: it goes stale when the story changes, and "As a… I want…" describes user value, not what the test verifies. The template I settled on:

- **Objective**: what the test verifies and where you look.
- **Coverage**: the acceptance criterion it covers, restated in one or two lines in your own words.
- **Preconditions**: the system state and data needed.
- **Scope**: what's out, and what must *not* be mistaken for a failure (a deliberately forced error, a mock that doesn't prove the integration). This field prevents false positives.
- **References**: with links; the story goes here as "the story under test".
- **Postconditions**, only if the run leaves traces or needs cleanup (it consumes a non-reusable ID, it must free a resource).

### The steps

- **Data holds data**, not screenshots. Screenshots go as attachments.
- **Actual Result is written as text**: it can be reviewed without opening images, and it's what you quote in a bug.
- **Conventions, not personal values.** A step saying "externalId prefixed with *my initials*" breaks the moment someone else runs it. Use a variable (a per-person `userTag` variable in the API collection) or a convention. Fixing it later is expensive: steps live in the add-on and re-importing a CSV *appends* steps rather than replacing them.
- **One test for all environments.** If an environment behaves differently, add an explicit step for it (marked not applicable elsewhere) or parameterize the Data column. Three copies of a test for three environments means three times the maintenance.

### Naming

Pick a convention and make it searchable. Ours looked like this:

```
Test:       [BACK]-T-PRJ-1234-[FIBER-ADD] Modify the bandwidth of an order with the CPE terminated
Execution:  TE-Sprint42-FIBER-ADD-bandwidth
Plan:       TP - Functional Testing - Sprint 42 - Team 1
Release execution: TE-<environment>-<release>
```

Labels matter too: if the release board filters by a release label, a bug or a test without it simply doesn't exist for that board. Tagging tests with the release label also lets you build the release plan with a filter.

## Verdicts: say what was verified, not how hard you tried

Environments with mocks force you to decide what a verdict means. The scale I use:

| Situation | Verdict |
|---|---|
| The object of the test is verified; only a **side check** can't be done here | Side step skipped with a note, test **PASSED** |
| The flow runs end to end, but the **central object isn't verifiable** here (a mock returns canned data) | **PASSED at flow level**, with the Actual Result separating verified from unverifiable and pointing to the execution where it *is* covered |
| Not even the flow can run | **Not executed**, left TO DO with a comment at test level |
| A real product failure | **FAILED**, with the defect linked. No mitigating circumstances because of the environment. |

Two principles behind it:

- **A PASSED never claims something that couldn't be checked.** The global status tells you what's verified, not how much effort went in.
- **The verdict doesn't encode blame.** A pre-existing failure is still FAILED. Who caused it goes in the bug type (a defect introduced by the story vs. a pre-existing bug), the release notes and the test's issue status, not in a softened verdict.

And don't mix up the **run verdict** (PASSED/FAILED in the execution) with the **issue status** of the Test in Jira (To Do, Ready, Done…).

## Workflow: story, tests and bugs moving together

- A test is born **To Do** (just a name), goes **In Progress** while its steps are designed, and is **Ready** once the design is done. When the story reaches QA, story, tests and execution move to the testing state together, so the board shows what's being tested and with which tests.
- **A bug found in the story under test** (a "dev bug"), **non-blocking**: it goes to the developer, testing continues. Leave a **QA status comment** on the story, edited in place rather than appended: date and environment, what was reviewed, happy path with a link, each bug with a link and "not blocking", what's pending and on whom. Sub-tasks alone don't tell the PO whether the story is stuck.
- **Blocking**: bug to In Progress with high priority (the signal to stop what you're doing), story back to development, tests to Blocked, the execution closed as failed, and the retest in a **new** execution. The bug is attached to the **step that failed**, and if the retest fails the same defect goes back, rather than a new one.
- **A bug unrelated to the story** is reported as an independent bug and doesn't block the story unless it's critical.
- **A story doesn't move to Review** (in this team's workflow, the PO's acceptance step) with tests not run or a dev bug open, unless the PO explicitly accepts the risk. Then the untested scenarios and the reason are written down in the execution, the plan and the documentation. That's the difference between accepting a risk and hiding it.

::: info An open debate: should a test ever be "Done"?
Many teams close each test when its execution finishes. But a test is a **reusable asset** and each result lives in its execution, so closing the issue every time it runs contradicts the model. My proposal: the final state of a live test is Ready; Done is reserved for tests retired from the repository. The condition for a story to go to Review then becomes "all tests executed in its execution, no dev bug open".
:::

## Plans that scale across sprints and releases

- **One plan per team and sprint** for sprint work; the plan of the previous sprint is closed before the new one starts, carrying over what wasn't delivered.
- **One plan per release and environment** for regression, with one execution per team inside it.
- A useful addition: a **permanent regression plan per use case**, from which each release plan is copied. It keeps the regression set explicit instead of being rebuilt from memory every release.

::: tip Key idea
The Test is the recipe, the Execution is the pass, the Plan is the container, and **only what's inside the plan counts**. Every rule above exists to keep those three things connected.
:::

## References

- [Xray documentation](https://docs.getxray.app/)
- [Agile testing strategy](/strategy/agile-testing-strategy): where these artifacts fit in the team's cycle.
- [Test environments strategy](/strategy/test-environments-strategy): what each environment's executions can prove.
