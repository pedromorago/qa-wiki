# Cypress: first steps

Cypress runs the tests **inside the browser**, next to the application ([its architecture explains its strengths and limits](/automation/e2e-tools-landscape)): immediate visual feedback, excellent debugging and an API that reads itself. It's one of the most widespread E2E tools, and the one I've worked with the longest.

## Install and start

```bash
npm install -D cypress
npx cypress open   # the interactive runner: pick a browser and watch tests run
npx cypress run    # headless mode: the pipeline one
```

The structure it generates:

```
cypress/
├── e2e/              # the tests: *.cy.ts
├── fixtures/         # test data in JSON
└── support/
    ├── commands.ts   # custom commands
    └── e2e.ts        # global hooks
cypress.config.ts     # configuration (baseUrl, timeouts, retries…)
```

The first thing you always configure: the `baseUrl` in `cypress.config.ts`, so tests do `cy.visit('/catalog')` instead of absolute URLs.

## The first test

```js
describe('Product catalog', () => {
  it('shows the 1 Gbps fiber detail', () => {
    cy.visit('/catalog');
    cy.contains('Fiber 1 Gbps').click();
    cy.url().should('include', '/products/fiber-1gbps');
    cy.get('[data-cy=monthly-price]').should('be.visible');
  });
});
```

Two things already visible here: commands **chain**, and assertions go through `should`.

## The essential commands

| Command | What it does |
|---|---|
| `cy.visit('/path')` | Navigate (relative to baseUrl) |
| `cy.get('[data-cy=…]')` | Select elements |
| `cy.contains('text')` | Select by visible text |
| `.click()` / `.type('…')` / `.select('…')` | Interact |
| `.should('be.visible')` / `.should('contain', '…')` | Assert (with automatic retry) |
| `cy.intercept(…)` | Spy on or stub network requests |

## The idea you must internalize: retry-ability

Cypress **automatically retries** `cy.get` and `should` until they pass or the timeout expires (4 s by default). That's why you almost never need manual waits: `cy.get('[data-cy=order-status]').should('contain', 'Active')` will wait for the status to arrive on its own.

The flip side: commands are **not normal promises**. You don't `await cy.get(...)` or store its result in a variable; you chain, or use `.then()`. It's the number one source of confusion when starting out.

## Selectors with judgment

The recommended selector is a dedicated attribute (`data-cy`), which doesn't change when styles or copy change:

```html
<button data-cy="confirm-order">Confirm order</button>
```

```js
cy.get('[data-cy=confirm-order]').click();
```

CSS-class or structural selectors (`div > ul li:nth-child(3)`) are what turn a suite into a house of cards.

## Common mistakes

- **Fixed `cy.wait(3000)`.** If you must wait, wait for something concrete: an assertion or a network alias (covered in [patterns](/automation/cypress-patterns)).
- **Treating commands like normal sequential code**: mixing variables and `cy.*` without `.then()` produces tests that "pass" while testing nothing.
- **Tests that depend on each other** (test B uses what test A created): every test prepares its own state.
- **Ignoring the interactive mode.** `cypress open` with time-travel over each command is the best E2E debugging tool there is; use it before fighting logs.

::: tip Key idea
Cypress's learning curve is short because the API reads itself, but the mental model (chaining + automatic retry) is different from a normal script. Internalize that first and the tool plays on your side.
:::

## References

- [Cypress documentation](https://docs.cypress.io/)
- [Cypress — Introduction to Cypress (the mental model)](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress)
