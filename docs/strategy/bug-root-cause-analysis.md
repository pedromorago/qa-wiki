# Bug root cause analysis

Closing a bug fixes it once. Classifying **where it came from** tells you how to prevent the next twenty. Aggregated root cause analysis is one of the QA practices with the highest return and the lowest cost.

## The mechanics

Add a mandatory **"Root Cause"** field to every bug-type issue in the ticket manager, with a closed taxonomy:

| Category | Definition |
|---|---|
| **Environment** | Environment limitation: network, resources, configuration… |
| **External / 3rd party** | An asset not developed by us: a library, an external service. |
| **Improper / lack of definition** | Incorrect or insufficient definition or documentation. The bug was born in refinement. |
| **Lack of testing** | Incorrect or insufficient testing — at *any* layer: manual, unit, integration, regression. |
| **TBD** | Doesn't fit any category. Reviewed afterwards. |

Two design decisions I find particularly sharp:

- **The principle behind "lack of testing"**: *if the code fails, the tests should have caught it*. It's not about blaming QA — it's about recognizing that every escaped bug points to a concrete gap in some layer of the safety net.
- **The TBD category** makes the taxonomy **evolutionary**: instead of forcing wrong classifications, you leave a controlled escape hatch, and the accumulated TBDs get reviewed to create new categories backed by real data.

## Enforcement: through workflow, not goodwill

An optional field stays empty. What works:

1. **Mandatory on creation** of the bug-type issue.
2. **Validator on the transition**: the workflow prevents moving the bug to "Delivered" with the field empty.

(We first tried a reactive automation that sent the ticket back to its previous state with a comment — it works, but workflow validation is cleaner. Better to prevent than to correct.)

## What to do with the data

Aggregated by quarter, by team or by product area, the data answers the question no individual bug can: **what do we get wrong the most?**

- Does *lack of definition* dominate? → invest in refinement: [acceptance criteria and DoR](/strategy/acceptance-criteria-and-dor), three amigos.
- Does *lack of testing* dominate? → look at which layer failed most and reinforce it ([pyramid](/fundamentals/the-testing-pyramid), [cross-domain E2E](/strategy/what-e2e-tests-should-cover)).
- Do *environment/3rd party* dominate? → environment stability, contract testing with third parties.

And the loop closes with the **team's quality metrics**, reviewed periodically (in the retro or the sprint review, not on a dashboard nobody opens): bugs opened vs closed, reported vs hotfixes, distribution by severity and by root cause. Not as surveillance — as an answer to "where do we focus the effort?".

::: tip The binary triage that keeps the signal clean
The same discipline applies to pipeline failures: is the application failing? → bug. Is the test failing? → fix the test (or delete it if it's irrecoverably flaky). A third state — "re-run it and see if it passes" — does not exist: it's the death of trust in the regression suite.
:::
