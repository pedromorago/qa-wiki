# What E2E tests should cover (and what they shouldn't)

E2E tests are the most expensive to write, run and maintain. These are the guidelines I use to decide what deserves one.

## What they're for

- Validating **critical business flows** end to end: from the UI to the backend and back.
- Ensuring that integrations and user-facing features **work together**.
- They are explicitly **not** for covering every detail or internal logic — that belongs to unit and integration.

## What to test

- The **happy paths of the key flows**: login, customer sign-up, ordering — a registered customer contracts 1 Gbps fiber and the service order reaches the `active` state…
- **1–2 meaningful variations per flow** (valid vs invalid login). Not twenty.
- **Visible errors that block the user** (failed coverage validation, rejected payment of the first bill).
- **Core business rules of the flow** (an order with no products selected can't be submitted).
- **Critical integrations** frontend ↔ API ↔ services.

## What NOT to test

- Every possible input combination.
- Detailed field validations (unit/integration layer).
- Internal service logic.
- Scenarios with no impact on the user experience.

::: tip The 8–12 rule
**8–12 well-chosen E2E tests are worth more than 100 fragile, redundant ones.** Every E2E must be able to answer the question: "which part of the business does it confirm isn't broken?". A typical minimal set: login OK and KO, contract a product, update or cancel the service order, the critical action (first bill payment) with an error, and logout.
:::

## The invisible gap: atomic tests vs cross-domain flows

A lesson that cost me real bugs: you can have a big, green E2E suite and still let major failures slip through, if all your tests are **atomic** — each one validates one entity's CRUD in isolation, and none of them walks a **complete workflow that crosses functional domains**.

Examples of the pattern (abstracted from real cases):

- A test creates a product in the catalog and reads it back… but never checks that the product **can later be contracted in a service order**.
- A convergence discount defined in the catalog wasn't being applied in the order summary. Each module's tests: green.
- Restoring a previous version of a threat model failed only when the diagram contained components created in a *different* flow (an import). No atomic test could ever see it.

**Atomic tests stay green while the seams break.** The answer:

- At least **one cross-domain E2E per entity** in the product: create the entity and *use it* where the business uses it.
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
