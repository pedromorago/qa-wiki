# Cypress: patterns that work

With [the first steps](/automation/cypress-first-steps) you write a test; with these patterns you maintain a suite. They're what separates a stable suite from one that "fails sometimes".

## Custom commands: log in once

Repeated flows become your own commands in `support/commands.ts`. The universal case is login, and with `cy.session` the session is **cached across tests**: the real login happens once, not in every test.

```js
Cypress.Commands.add('login', (user = 'sales-agent') => {
  cy.session(user, () => {
    cy.visit('/login');
    cy.get('[data-cy=email]').type(Cypress.env(`${user}_email`));
    cy.get('[data-cy=password]').type(Cypress.env(`${user}_password`), { log: false });
    cy.get('[data-cy=submit]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

```js
beforeEach(() => cy.login());
```

This alone can shave whole minutes off a slow suite.

## cy.intercept: the network superpower

`cy.intercept` observes or replaces the requests the application makes. Its three uses:

**1. Waiting for the network instead of for time** (goodbye `cy.wait(3000)`):

```js
cy.intercept('GET', '/api/catalog/products').as('getCatalog');
cy.visit('/catalog');
cy.wait('@getCatalog');                 // waits for exactly that response
cy.contains('Fiber 1 Gbps');
```

**2. Stubbing responses** with a fixture (the frontend gets tested without depending on the backend):

```js
cy.intercept('GET', '/api/service-orders*', { fixture: 'orders-in-provisioning.json' });
```

**3. Forcing the hard cases** that are costly to provoke in a real environment:

```js
cy.intercept('POST', '/api/service-orders', { statusCode: 500 }).as('orderFails');
cy.get('[data-cy=confirm-order]').click();
cy.contains('The order could not be created');   // does the UI handle the error well?
```

The balancing rule: stubbing the network tests the frontend **in isolation**; critical flows (actually ordering a service) also need tests against the real backend. Both kinds, deliberately — it's the [pyramid](/fundamentals/the-testing-pyramid) applied inside E2E.

## Organization that scales

- **One spec per business flow** (`ordering.cy.ts`, `catalog.cy.ts`), not per page.
- **State via API, verification via UI**: the starting customer and order are created through the API (faster and more stable), and the UI is used for what's actually under test.
- **Page objects?** In Cypress the classic POM weighs less than in Selenium: `data-cy` + custom commands cover most reuse. For complex screens (a tariff configurator), [a page object](/automation/page-object-model) is still reasonable.
- **Retries in CI**: `retries: { runMode: 2 }` in the config gives margin against environment instability — but a test that needs retries is always asking for an investigation, not a third attempt.

## In the pipeline

```bash
npx cypress run --browser chrome --spec "cypress/e2e/ordering/**"
```

- Videos and failure screenshots land in `cypress/videos` and `cypress/screenshots`: publish them as artifacts **always**, [including on red](/cicd/jenkins-and-gitlab-ci).
- The long suite gets split across containers by specs: the criteria live in [parallelization and sharding](/cicd/parallelization-and-sharding).

## Common mistakes

- **Stubbing everything.** A suite that only talks to mocks passes even when the backend is broken; keep a real E2E subset for critical business flows.
- **Not using `cy.session`** and paying a full login per test.
- **Weak assertions** (`should('exist')` where content needed checking): the test passes, so does the bug.
- **One giant spec**: impossible to parallelize and to read.

::: tip Key idea
The three multipliers of a healthy Cypress suite: cached session with `cy.session`, controlled network with `cy.intercept`, and state prepared via API. Everything else is writing good test cases.
:::

## References

- [Cypress — Best practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress — cy.intercept](https://docs.cypress.io/api/commands/intercept)
- [Cypress — cy.session](https://docs.cypress.io/api/commands/session)
