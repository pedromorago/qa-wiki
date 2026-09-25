# QA glossary

Terms I use day to day, explained briefly. In alphabetical order. For exam-grade definitions, the source of truth is the [official ISTQB glossary](https://glossary.istqb.org/).

**Acceptance criteria** — Concrete, verifiable conditions a user story must meet to be considered done. If they aren't testable, they aren't acceptance criteria.

**BPMN (Business Process Model and Notation)** — The standard notation for modeling workflows as diagrams that a BPM engine can execute: processes, subprocesses, human tasks, timers. Common in telecom provisioning. See [testing workflows on a BPM engine](/telecom/testing-bpm-workflows).

**Bug (defect)** — An imperfection in a work product (code, requirement, design) that doesn't meet its requirements. When executed, it can cause a *failure*: the observable deviation from expected behavior. The usual chain: human *error* → *defect* → *failure*.

**CFS / RFS** — In telecom service modeling: the **customer-facing service** is what the customer contracts; the **resource-facing service** is how the network realizes it. The hierarchy always goes CFS → RFS → resource. See [the catalog](/telecom/catalog-cfs-rfs).

**Confirmation testing (re-testing)** — Running again the tests that failed, once the defect is fixed, to confirm the fix. Not to be confused with *regression testing*, which checks that the change didn't break anything else.

**Contract testing** — Verifying that the "contract" (request/response format) between an API consumer and provider is honored, without needing to spin up both systems together. Key in microservices and in integrations with third parties.

**Coverage** — A measure of how much of the system the tests exercise (lines, branches, requirements). High coverage ≠ good tests: you can execute all the code without verifying anything.

**DoD (Definition of Done)** — A team-agreed checklist defining when a piece of work is truly finished (code + tests + review + documentation…).

**DoR (Definition of Ready)** — A checklist defining when a story is ready to be **started**: clear requirements, testable acceptance criteria, resolved dependencies. The mirror of the DoD, at the start of the cycle.

**E2E (end-to-end)** — A test that walks through a complete business flow from the user's perspective, crossing every layer and the integrations underneath. It validates a business capability, not a single story.

**Environment** — Each instance where the application lives: local, development, test, staging (pre-production), production. In integration projects, each one can have different integrations real or mocked. See [test environments strategy](/strategy/test-environments-strategy).

**Fallout** — In telecom OSS, a provisioning error handled as part of the order's lifecycle: the order goes to *held*, and an operator can retry, continue, cancel or restart. See [fallout management](/telecom/fallout-management).

**Flaky test** — A test that sometimes passes and sometimes fails without any code change. Typical causes: poorly managed waits, dependence on shared data, execution order, unstable environment.

**Given-When-Then** — A structure for expressing test cases and acceptance criteria: *Given* (initial state), *When* (action), *Then* (expected result). It makes cases readable and unambiguous.

**Happy path** — The main flow where everything goes right: valid data, correct user, no errors. The opposite is *edge cases* and *negative testing*.

**Hotfix** — An urgent fix deployed to production outside the normal release cycle.

**IDOR (Insecure Direct Object Reference)** — An authorization vulnerability: accessing another user's resources by changing an ID in the request.

**Inventory** — In telecom, the record of which services and resources exist and how they connect. When the order and the inventory disagree, the inventory is the truth.

**Mock** — A stand-in for a real dependency that is **programmed with expectations** and can verify how it was called (which requests, how many times, with what data).

**POM (Page Object Model)** — A design pattern for UI automation: each page/component is modeled as a class encapsulating its locators and actions. Tests talk to the page in business language (`loginPage.login(user)`), not in selectors.

**Quality gate** — An automatic quality threshold (coverage, bugs, code smells, duplication) that code must pass in CI to be mergeable.

**RACI** — A responsibility matrix: who is **R**esponsible (does the work), **A**ccountable (answers for it), **C**onsulted and **I**nformed. In agile testing: anyone can be responsible for a validation; QA is accountable.

**Regression** — A defect in something that used to work, introduced by a later change. *Regression testing*: re-running tests to catch them.

**Release** — A version of the software that gets published. *Release notes*: what it includes.

**Root cause** — The real origin of a defect, beyond the symptom. Classifying root causes (lack of definition, lack of testing, environment, third party…) reveals patterns that steer the testing strategy. See [bug root cause analysis](/strategy/bug-root-cause-analysis).

**Sanity test** — Used inconsistently: ISTQB treats it as a synonym of smoke test; many teams use it for a narrow check of the core functionality after a change. Agree on the meaning within your team.

**Service order** — In telecom, the request to create, modify or end services (TMF641). It has items, a state machine and milestones. See [service orders](/telecom/service-orders-tmf641).

**Sharding** — Splitting the test suite across several CI machines running in parallel. Total time is set by the slowest shard, which is why balancing the split by duration matters.

**Shift-left** — Moving quality activities as early as possible in the cycle: reviewing requirements, testing designs, automating from the first commit.

**Smoke test** — A minimal, fast check that the main functionality works (and that the deployment is alive) before investing in deeper testing.

**Spike** — A time-boxed investigation to reduce uncertainty. It's estimated by how much time the team is willing to invest, not how long it will take, and it closes with a decision.

**Story points** — A relative estimate of effort, calibrated per team. Not comparable between teams, and it should include the testing effort.

**Stub** — A stand-in for a real dependency that **returns canned answers** and verifies nothing. A static stub can make a test pass that would fail against the real system.

**Test case** — A set of preconditions, steps, data and expected result that verifies a specific behavior.

**Test execution** — One run of a set of tests on a given environment and build, holding the verdicts and the evidence. The environment belongs to the execution, not to the test. See [test management with Xray](/strategy/test-management-with-xray).

**Test plan** — Classically, a document defining the scope, approach, resources and schedule of testing. In test management tools, the container that groups the tests of a campaign (a sprint, a release).

**Three amigos** — A short conversation between business (PO), development and testing to refine a story before it's built, so all three perspectives shape the acceptance criteria.

**Traceability** — The relationship between requirements ↔ test cases ↔ bugs. It lets you answer "which requirements are covered?" and "which tests should I re-run if this requirement changes?".

**UAT (User Acceptance Testing)** — Acceptance testing performed by the customer or end users to validate that the product solves their need. One form of acceptance testing among others (operational, contractual, alpha/beta).
