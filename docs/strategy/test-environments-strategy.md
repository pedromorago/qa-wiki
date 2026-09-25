# Test environments strategy: what each environment can prove

In a product with no external dependencies, environments are more or less copies of each other. In a project that integrates a vendor's product with a client's systems and a handful of third parties, they aren't. Each environment has **different integrations (real or mocked), a different version and a different owner**. Knowing what each one can and can't prove is half of the test strategy, and ignoring it is how the same tests end up running three times while the risky part runs zero.

This page is the environment side of [environment validations in CI/CD](/cicd/environment-validations), seen from an integration project in telecom.

## A typical chain

| Environment | What's in it | What it's for |
|---|---|---|
| **DEV** | The team's latest code, every integration mocked | Developers' own checks; each new development needs its mock at the same time or it can't be tested at all |
| **TEST** | Sprint work, **real integrations**, with mocks that can be switched on per component | Validating stories and integrations during the sprint |
| **Product evaluation** | The vendor's **next product release** on top of a copy of pre-production; not integrated, everything mocked | Catching product bugs *before* they reach TEST: a product fix can take a week, and a week of broken TEST blocks every team |
| **Pre-production** | Fully integrated, with an SLA; the client runs its own tests there | The last integrated rehearsal. Breaking it is almost as urgent as breaking production. |
| **Production** | The real thing | The client executes; the project's QA accompanies, answers and assesses impact |

Two things surprised me about this chain. First, **it isn't a straight line**: DEV and TEST run ahead with sprint work, while the evaluation environment and pre-production move a step behind, aligned with each other. Second, the evaluation environment **can hold a newer product release than DEV and TEST**. When that release is deployed further, the team's work has to adapt to it, not the other way round.

## Pay each risk in one place, not in all of them

Testing everything, integrated, in every environment sounds safe and is unaffordable: each release brings more functionality, and release testing becomes the project's main brake. The strategy we settled on for vendor product releases:

- **Product evaluation**: fully mocked, tested by QA. It filters product regressions.
- **DEV**: QA doesn't test there. Whoever installs runs a minimal smoke test to confirm the environment is alive.
- **TEST**: **partially mocked**, depending on what the release touches. The integration the release really changes stays real; the rest is mocked so nobody waits on a third party to advance each order.
- **Pre-production**: full integrated tests. The risk of mocking in TEST is paid, at worst, in pre-production, never in production.

A variant worth knowing: TEST **without** mocks when new development lands (to validate the integrations), and **with** mocks afterwards (to check that the vendor's novelties don't break the system). Either way, the principle is the same: **the same integrated test shouldn't run in two environments** unless something between them changed.

### Don't retest everything on every promotion

- When a release lands in an environment, run the **E2E suite plus a selection** of tests for the new features of the sprints it includes.
- Promoting to the next environment doesn't mean repeating everything. It was tested; trust the deployment and its smoke test, or you enter a loop of testing the same thing forever.
- **Nothing enters a release regression without having passed its own story test first.**
- If the vendor runs its own automated regression on every release, **don't repeat it**. The project's contribution is the *indirect regression* of its own use cases, plus a selection of the vendor's new features and fixes that touch those flows. (The vendor tests in its environments, not on your client's installation, which is why the indirect regression still matters.)
- **An upcoming release doesn't justify cutting the regression in TEST.** Whatever stays broken there blocks development for weeks.

### Postponing upgrades gets expensive

Every product upgrade that gets postponed makes the next one bigger: teams that skip versions end up jumping four at once, with a regression to match. As a colleague put it, *the client doesn't not care, they just don't know they care yet*. Plan the upgrade path from the start.

## What can be automated where

Pre-production is integrated, which makes it the worst place for automation: anything that depends on requesting a scarce ID from a third party or on a person advancing a step in an external system **can't run unattended**. Automation lives in the mocked environments and in the mocked part of TEST.

The corollary for manual campaigns: **learn to recognize an integrated test** from its definition (it waits for client callbacks, human forms at a carrier, a real network element…). In a mocked environment, don't run its empty shell against mocks and call it passed: leave it not executed with a note, and **raise it as an observation of the release**. Skipping silently isn't enough. See the [verdict scale](/strategy/test-management-with-xray#verdicts-say-what-was-verified-not-how-hard-you-tried).

## Hygiene in shared environments

A shared environment rots unless everyone is disciplined. My checklist:

- **Check the environment before investigating a failure.** Unannounced maintenance, a certificate problem or a service scaled to zero for someone else's test explain a lot of "bugs". See [investigating hard failures](/strategy/investigating-hard-failures).
- **Know which release is deployed where.** Compare the story's fix version with the release in the environment before deciding whether a test is even executable.
- **Announce in the team channel before changing anything** that can break a shared environment: scaling a service down, switching a mock, redeploying a component.
- **Tag your own data.** Put your initials or a personal tag in the external IDs of the orders you create, so you can find them and nobody confuses them with theirs.
- **Static test data burns.** A qualification ID that was already consumed can't be reused; a third-party test database that gets wiped daily means scenarios using it must be set up and run the same day. Plan executions so you don't exhaust scarce data, and prefer **generated data**.
- **Cleanup is part of testing.** We once had a delete regression blocked for days because the only deletable service in an environment had about fifteen orders stuck in non-final states: unfinished forms, broken cancellations, tests by people who had left. The system correctly refused to terminate a service "in use". The rule for automation that came out of it: **every test creates its own data and leaves its orders in a final state**, pass or fail.
- **Historical completed orders are the best test data bank** when you need realistic preconditions.
- **Verify preconditions right before running.** Data noted in a ticket may have been consumed by someone else since (a developer's own modify while generating evidence), and running on it gives a false PASSED.
- **Moving a task to test can freeze a developer's configuration environment.** Group quick checks in an agreed slot instead of blocking them all day.
- **Touching the database directly** is tolerated, with reservations, in DEV only.

## Logs and smoke tests

- **Know where each environment logs**: per pod in the deployment tool for one environment, in the observability platform for another. Know the **time zone** (usually UTC) and the **retention**: if logs live 15 days, capture the evidence of a bug before they disappear.
- **Filter by pod, not by service name.** The service name matches every environment at once.
- **Run the smoke test before a change**, not just after, so you have a baseline. Without it, you can't tell whether an endpoint failing after the change was broken by it or was already broken, and under a time-boxed go/no-go that doubt can trigger an unnecessary rollback.
- **Smoke test for a change in the cluster's entry point** (ingress, gateway): one read-only `GET` per exposed host plus the frontends, launched **from outside** the cluster. A request from your laptop already counts as outside-in traffic. Prioritize the APIs consumed by external systems, and include internal tools behind the same entry point, because they change too. In production keep it read-only and packaged as a one-click collection.

::: tip Key idea
For every environment, write down three things: what's real, what's mocked, and who tests what there. Most wasted testing effort, and most escaped integration bugs, come from not knowing those answers.
:::

## Related

- [Mocks in integration testing](/strategy/mocks-in-integration-testing): how to use them without being fooled by them.
- [Test management with Xray](/strategy/test-management-with-xray): one test for every environment, with the environment in the execution.
- [Microservices testing](/strategy/microservices-testing): the isolated vs integrated view of the same problem.
