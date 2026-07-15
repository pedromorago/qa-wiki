# The testing pyramid

The testing pyramid is a model for deciding **how to distribute automation effort** across the different test levels. The idea: lots of cheap, fast tests at the base, few expensive, slow tests at the top.

```
        ▲
       ╱ ╲        E2E / UI  (few, slow, fragile, very realistic)
      ╱───╲
     ╱     ╲      Integration / API  (cost-confidence balance)
    ╱───────╲
   ╱         ╲    Unit  (many, fast, stable, very localized)
  ╱───────────╲
```

## Why it has this shape

| Level | Speed | Maintenance cost | Precision when failing | Realism |
|---|---|---|---|---|
| Unit | ⚡ milliseconds | Low | Very high (points to the exact function) | Low |
| Integration/API | 🚶 seconds | Medium | High | Medium |
| E2E/UI | 🐢 minutes | High | Low (did the test fail, or the environment?) | High |

A failing E2E test tells you "something is wrong in the purchase flow". A failing unit test tells you "the `calcularDescuento` function returns the wrong VAT". The lower down you catch the problem, the cheaper it is to diagnose.

## The antipattern: the ice cream cone 🍦

The inverted pyramid: piles of manual or automated E2E tests, almost no unit tests. It's the typical pattern of teams where QA automates "from the outside" without collaborating with development. Consequences:

- Suites that take hours and fail intermittently (*flaky tests*).
- Nobody trusts the results → tests get re-run until they pass → the suite loses all its value.
- Feedback arrives late, once the code is already integrated.

## How I apply it as a QA

- **Not everything I test through the UI should be automated in the UI.** If the logic can be verified via the API, the test goes to the API layer.
- Before writing an E2E, ask yourself: what does this test give me that a lower-layer test doesn't already? If the answer is "nothing", it's redundant.
- E2E tests are reserved for the **critical business flows** (happy paths): sign-up, login, purchase, payment.
- Manual exploratory testing doesn't appear in the pyramid, but it complements every level: automated tests verify the known; exploration discovers the unknown.

::: tip Quick rule of thumb
Automate at the **lowest possible level** where the behavior can be verified with confidence.
:::
