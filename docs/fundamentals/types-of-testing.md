# Types of testing

Classifying test types helps you speak a common language with the team and spot gaps in the test strategy.

## Functional vs non-functional

- **Functional testing**: verifies *what* the system does. Does signing up for a fiber product generate the service order? Is the applied tariff the one from the catalog?
- **Non-functional testing**: verifies *how* it does it. Performance, load, security, usability, accessibility, compatibility.

## Black box, white box, gray box

| Approach | Knowledge of the code | Example |
|---|---|---|
| **Black box** | None; only inputs and outputs | Testing a form through the UI |
| **White box** | Full; the internal structure is tested | Unit tests, branch coverage |
| **Gray box** | Partial | Testing the UI while knowing the API behind it |

## Test levels

1. **Unit** — one function or class in isolation. (Usually) written by developers.
2. **Integration** — the interaction between components: service + database, module A + module B.
3. **System / E2E** — the full flow from the user's perspective.
4. **Acceptance** — validating that the product solves the business need. User acceptance testing (UAT) is one form of acceptance testing, not a synonym for it.

That's the everyday simplification. ISTQB (CTFL v4.0) defines five test levels: **component**, **component integration**, **system**, **system integration** and **acceptance** — it splits integration in two depending on whether you're joining pieces of the same system or your system with others.

## Types you absolutely need to know

- **Smoke testing**: a quick check that the main functionality works before investing in deeper testing. If the smoke tests fail, there's no point testing any further.
- **Sanity testing**: a term used inconsistently. ISTQB treats it as a synonym of smoke; some teams use it for a narrow check of the core functionality. Whatever your team means by it, agree on it and write it down — [here's how one team used both terms](/strategy/agile-testing-strategy).
- **Regression**: re-running existing tests to confirm a change hasn't broken what already worked. It's the number one candidate for automation.
- **Exploratory**: testing without a fixed script, designing and executing at the same time, guided by experience and intuition. It's not "testing at random": it's organized into sessions with objectives (*charters*).
- **Re-testing (confirmation)**: testing a specific bug again after its fix.

::: warning Regression ≠ Re-testing
Re-testing confirms that **the fixed bug** no longer occurs. Regression confirms the fix **hasn't broken something else**. They complement each other; they're not interchangeable.
:::

## Most common non-functional types

- **Performance** (umbrella): load, stress, spike, soak — see [Performance testing fundamentals](/performance/performance-fundamentals).
  - **Load**: behavior with the expected volume of users.
  - **Stress**: behavior beyond the expected limit — does it degrade gracefully or blow up?
- **Security**: vulnerabilities (injection, XSS, session management…).
- **Usability and accessibility**: making sure anyone can use the product (WCAG).
- **Compatibility**: browsers, devices, operating systems, resolutions.

::: tip Key idea
The names matter less than the agreement behind them. If half the team hears "sanity" and thinks smoke, and the other half thinks regression, the classification has failed at its first job: giving the team a common language.
:::
