# QA Glossary

Terms I use day to day, explained briefly. In alphabetical order.

**Acceptance criteria** — Concrete, verifiable conditions a user story must meet to be considered done. If they aren't testable, they aren't acceptance criteria.

**Bug (defect)** — Discrepancy between actual and expected behavior. The usual chain: human *error* → *defect* in the code → observable *failure* at runtime.

**Contract testing** — Verifying that the "contract" (request/response format) between an API consumer and provider is honored, without needing to spin up both systems together. Key in microservices.

**Coverage** — A measure of how much of the system the tests exercise (lines, branches, requirements). High coverage ≠ good tests: you can execute all the code without verifying anything.

**DoD (Definition of Done)** — A team-agreed checklist defining when a piece of work is truly finished (code + tests + review + documentation…).

**DoR (Definition of Ready)** — A checklist defining when a story is ready to be **started**: clear requirements, testable acceptance criteria, resolved dependencies. The mirror of the DoD, at the start of the cycle.

**E2E (End to End)** — A test that walks through a complete system flow from the user's perspective, crossing every layer.

**Environment** — Each instance where the application lives: local, development, staging (pre-production), production.

**Flaky test** — A test that sometimes passes and sometimes fails without any code change. Typical causes: poorly managed waits, dependence on shared data, execution order, unstable environment.

**Given-When-Then** — A structure for expressing test cases and acceptance criteria: *Given* (initial state), *When* (action), *Then* (expected result). It makes cases readable and unambiguous.

**Happy path** — The main flow where everything goes right: valid data, correct user, no errors. The opposite is *edge cases* and *negative testing*.

**Hotfix** — An urgent fix deployed to production outside the normal release cycle.

**IDOR (Insecure Direct Object Reference)** — An authorization vulnerability: accessing another user's resources by changing an ID in the request.

**Mock / Stub** — Controlled stand-ins for real dependencies (services, APIs) to isolate what's being tested.

**POM (Page Object Model)** — A design pattern for UI automation: each page/component is modeled as a class encapsulating its locators and actions. Tests talk to the page in business language (`loginPage.login(user)`), not in selectors.

**Quality gate** — An automatic quality threshold (coverage, bugs, code smells, duplication) that code must pass in CI to be mergeable.

**Regression** — A defect in something that used to work, introduced by a later change. *Regression testing*: re-running tests to catch them.

**Release** — A version of the software that gets published. *Release notes*: what it includes.

**Root cause** — The real origin of a defect, beyond the symptom. Classifying the root causes of bugs (ambiguous requirement, unhandled case, regression, data…) reveals patterns that steer the testing strategy.

**Sharding** — Splitting the test suite across several CI machines running in parallel. Total time is set by the slowest shard, which is why balancing the split by duration matters.

**Shift-left** — Moving quality activities as early as possible in the cycle: reviewing requirements, testing designs, automating from the first commit.

**Smoke test** — A minimal, fast check that the essentials work, before investing in deeper testing.

**Test case** — A set of preconditions, steps, data and expected result that verifies a specific behavior.

**Test plan** — A document defining the scope, approach, resources and schedule of testing activities.

**Traceability** — The relationship between requirements ↔ test cases ↔ bugs. It lets you answer "which requirements are covered?" and "which tests should I re-run if this requirement changes?".

**UAT (User Acceptance Testing)** — Acceptance testing performed by the customer or end users to validate that the product solves their need.
