# Frontend testing layers, with examples

The frontend counterpart of the [backend layers](/strategy/backend-testing-layers). Running example: **the user creation form** on the admin page of a SaaS.

## Unit: component logic, no browser

No real DOM or browser; simulated events and **all API calls mocked** — never real data. `*.test.tsx` files next to the code (typical React/TS stack).

For the creation form:

- It renders correctly in readOnly mode.
- The password field validations are displayed (passwords don't match, weak password…).
- Labels show the correct text.

The four usual focus areas:

1. **Initialization and rendering** of the component (the main focus).
2. **Loading state** — that there's appropriate feedback while data arrives.
3. **Texts, buttons and elements** — including verifying that a click **triggers the correct API call** (mocked, but the invocation is verified).
4. **Filtering** — with mock values, in components that have filters.

A deliberate assumption: the API will deliver the correct data. The contract with the API is validated at other layers — frontend unit tests validate representation and behavior.

Accepted limitations: they don't evaluate how styles affect the layout, and the events aren't real browser events. Tools: Jest/Vitest + React Testing Library.

## Component: the component in isolation, in a real browser

The middle ground that gets forgotten the most: the component **alone**, but in an actual browser — logic and appearance at the same time, with real interactions.

- The "Create" button is only visible when all required fields are valid.
- Fill in the form and click "Create".

Tools: Playwright Component Testing, Cypress Component Testing, Storybook.

## E2E: the user's flow, with the full application

The application fully deployed (DB included), real data via API. The example flow:

1. Log in and navigate to the users page.
2. Click "Create".
3. Fill in the form with valid data.
4. Check that the dropdowns show the **correct roles** (real data from the backend).
5. Submit and confirm: notification banner + the user appears in the list.

Two golden rules for this layer:

- Every flow starts with login and navigation; if the test needs pre-existing data, **it's created via API beforehand** — never relying on whatever happens to be in the environment.
- The focus is the integration of pages and data throughout the flow, **not the technical implementation** or component isolation (that's what the other layers are for).

## Who writes what

A split that works very well in practice: **frontend developers write the unit tests** (they know the component's internal logic) and **QA writes the E2E tests** (they know the user flows and the risk). Component tests are split depending on the team.

## Operational summary

| Layer | What it validates | Typical tools | When it runs |
|---|---|---|---|
| Unit | Logic without DOM/browser, mocked APIs | Jest, Vitest, Testing Library | Every commit |
| Component | Behavior + appearance in a real browser | Playwright CT, Cypress CT, Storybook | Every pull request |
| E2E | User flows with real backend and DB | Playwright, Cypress | Main/staging, pre-release |

Unit gives immediate feedback on isolated units; E2E gives confidence in the whole system with real data, at the cost of slowness and complexity. They don't compete: they complement each other — and when a layer costs more than it delivers (it happened to us with some especially complex frontend unit tests), it's legitimate to **retire it and cover that risk from another layer**, leaving it documented.
