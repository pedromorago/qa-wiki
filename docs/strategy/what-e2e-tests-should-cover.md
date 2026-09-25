# What E2E tests should cover (and what they shouldn't)

E2E tests are the most expensive to write, run and maintain. These are the guidelines I use to decide what deserves one.

## What they're for

- Validating **critical business flows** end to end: from the UI to the backend and back.
- Ensuring that integrations and user-facing features **work together**.
- They are explicitly **not** for covering every detail or internal logic — that belongs to unit and integration.

## What to test

- The **happy paths of the key flows**: login, customer sign-up, ordering — a registered customer contracts 1 Gbps fiber and the service order reaches the `active` state…
- **1–2 meaningful variations per flow** (valid vs invalid login). Not twenty.
- **Visible errors that block the user** (a failed network-coverage check for the address, a rejected payment of the first bill).
- **Core business rules of the flow** (an order with no products selected can't be submitted).
- **Critical integrations** frontend ↔ API ↔ services.

## What NOT to test

- Every possible input combination.
- Detailed field validations (unit/integration layer).
- Internal service logic.
- Scenarios with no impact on the user experience.

::: tip The 8–12 rule
**For each critical flow or product area, 8–12 well-chosen E2E tests are worth more than 100 fragile, redundant ones.** Every E2E must be able to answer the question: "which part of the business does it confirm isn't broken?". A typical minimal set: successful and failed login, contract a product, update or cancel the service order, the critical action (first bill payment) with an error, and logout.
:::

## An E2E validates a business capability, not a user story

A QA lead I worked with repeated it until it stuck: **an E2E doesn't validate a user story; it validates a critical business capability.** At release time the question isn't "which stories do we have to retest?" but "**do our critical flows still work?**", and the E2E suite is what answers it. Two consequences:

- **An E2E isn't an acceptance criterion.** A story that adds a field to the customer entity gets a classic functional test tied to its criterion, not an E2E.
- **The exhaustive tests of each story don't serve as regression**, and the E2E catalog mustn't grow sprint after sprint until nobody can run it.

What a telecom E2E looks like, with the integrations verified underneath: create the customer → contract the product → generate the order → provision it and **check it exists in the inventory** with its ID → activate it and **check the activation platform completed** → validate the final state. And the unhappy path: an order with a phone number that already exists in the inventory must end **rejected**, not completed.

### Which stories deserve a new E2E

A story creates a new E2E only if it:

- introduces a **new critical flow**, or changes an existing one substantially;
- adds a **critical integration**;
- affects the **catalog, the inventory or the activation** platform;
- would **stop a business operation** if it failed.

A field validation, a filter, a visual change or a minor rule doesn't: at most it updates an existing E2E. The goal is explicit: the E2E catalog shouldn't grow until it can't be executed.

### A criticality matrix to decide

To take the gut feeling out of it, each flow gets a score on a handful of criteria: **business criticality, frequency of use, dependencies, economic impact, historical risk** and **ease of execution**. The sum decides:

| Score | Decision |
|---|---|
| High band (12–15 in ours) | **Mandatory E2E**, run in every regression |
| Middle band | Candidate, to be evaluated with the PO |
| Low band | Stays as a functional or integration test hanging from its story |

*Ease of execution* wasn't in the original design. The POs asked for it: an E2E can depend on the client (a manual step, a scarce ID), and however critical it is, it isn't always viable to run. A matrix that ignores that produces a suite nobody can execute. The bands are a starting point to calibrate with the team, not a universal constant.

### Keeping the suite from aging

- **Identify E2Es from business journeys with the POs**, in refinement, not from user stories after the fact.
- **Cross-tag stories and E2Es**: the story carries the tag of the E2E it can affect, and the E2E carries the tags of the stories that touched it. Over time that's the record of what changed each flow, and it's what stops the suite from quietly going stale. Extra labels help: *is E2E*, *E2E candidate*, *happy / unhappy path*.
- **Review the suite in every refinement** (not every sprint): does this story change one of our critical flows?
- **Prioritize automation with the PO** by criticality, complexity and repetition, and define the E2E before automating it.

## The invisible gap: atomic tests vs cross-domain flows

A lesson that cost me real bugs: you can have a big, green E2E suite and still let major failures slip through, if all your tests are **atomic** — each one validates one entity's CRUD in isolation, and none of them walks a **complete workflow that crosses functional domains**.

Examples of the pattern (abstracted from real cases):

- A test creates a product in the catalog and reads it back… but never checks that the product **can later be contracted in a service order**.
- A convergence discount defined in the catalog wasn't being applied in the order summary. Each module's tests: green.
- Restoring a previous version of a threat model failed only when the diagram contained components created in a *different* flow (an import). No atomic test could ever see it.

**Atomic tests stay green while the seams break.** The answer:

- At least **one cross-domain E2E per core entity** in the product: create the entity and *use it* where the business uses it.
- Run them with a realistic **least-privilege user**, not the admin.
- **Happy path**: prepare data via API, and perform actions and validations as a real user through the UI.
- **Sad paths**: optimize for maintenance — API to prepare data **and** to execute actions; the UI only for the final validations.

The general rule that sums all of this up:

> **API to reach the state; UI for what the user sees.**

## Writing best practices

- Names in business language: *"A registered customer can contract 1 Gbps fiber and the order reaches the active state"*.
- **Independent, parallelizable** tests (their own data, [created via API](/api-testing/test-data-and-authentication)).
- Controlled data: use search to isolate your record — never assume it's on the first page of the table.
- Don't duplicate coverage that unit/integration already provide: every E2E has to justify its cost.
