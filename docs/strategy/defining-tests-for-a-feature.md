# Defining tests for a feature

From the user story to the test cases: the process I follow when a feature enters the cycle.

## Before starting: prerequisites

- The feature meets the **Definition of Ready** — in particular, it has clear, testable **acceptance criteria (AC)**.
- All test cases live in a **test case manager** (TMS: Qase, TestRail…) that can be linked to the ticketing system.

## During refinement

Two obligations, and almost nobody does the second one:

1. Define the acceptance criteria.
2. **Search for existing test cases that apply to this feature** — and if there are any, link them to the ticket right there, during refinement. A feature almost always modifies existing functionality: if you don't link the affected cases, they'll go stale and you'll duplicate them with new ones.

## The three families of tests to define

### 1. Acceptance criteria tests

They verify that the feature does what it promises: expected actions, desired results, respected constraints, integration with the rest of the system, and design/behavior standards.

The important nuance: **not every AC test goes into regression** — only the ones worth running with every future change to the application. Operational rules:

- If the test should be part of regression → define it **in the TMS**, not in the ticket's "testing steps" (where it dies when the ticket closes).
- If the feature changes the behavior of existing cases → **update them** in the TMS.
- Before signing off on the feature: run the new tests **and** the linked ones.

### 2. Happy path tests

The main, ideal flow — and above all, that the new feature **doesn't break the existing happy paths**. They get automated as early as possible and usually form the **sanity** suite, which runs on the PR and repeatedly in each environment's pipelines.

### 3. Edge case tests

Boundary values, unusual data, infrequent flows, exceptional conditions. They expose the weak spots that are invisible in normal usage. They also get automated early and usually form the **regression** suite. A practical pipeline detail: on the PR only the backend regression runs (fast); the full one runs after the merge.

## From family to layer

Once the cases are defined, each one is assigned to the **lowest layer where it can be verified with confidence** ([pyramid](/fundamentals/the-testing-pyramid)):

- Is it pure logic? → unit (the developer probably already covers it).
- Is it API behavior or persistence? → integration/API.
- Is it something the user sees, or a flow that crosses the system? → E2E, in moderation ([what deserves an E2E](/strategy/what-e2e-tests-should-cover)).

The concrete layers, with examples: [backend](/strategy/backend-testing-layers) and [frontend](/strategy/frontend-testing-layers).

## Final checklist

- [ ] Testable ACs defined during refinement
- [ ] Affected existing cases: searched for and linked to the ticket
- [ ] AC tests defined; the ones going to regression, created in the TMS
- [ ] Happy paths covered (and automated → sanity)
- [ ] Edge cases covered (and automated → regression)
- [ ] Each case assigned to its layer
- [ ] New + linked tests executed before closing
