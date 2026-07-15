# What is QA?

**Quality Assurance (QA)** is the set of activities aimed at ensuring that a software product meets the expected level of quality, both functionally (it does what it should) and non-functionally (performance, usability, security…).

A common mistake is thinking QA = "running tests". In reality QA is broader: it includes preventing defects, improving processes, and providing visibility into the actual state of the product.

## QA vs QC vs Testing

Three terms that get mixed up constantly:

| Concept | Focus | Question it answers |
|---|---|---|
| **QA** (Quality Assurance) | Process, prevention | Are we building the product the right way? |
| **QC** (Quality Control) | Product, detection | Does the built product meet the requirements? |
| **Testing** | Execution, verification | Does this specific behavior work as expected? |

Testing is an activity *within* QC, and QC is a part *of* QA. A good QA doesn't just find bugs: they question ambiguous requirements before those turn into bugs.

## The 7 principles of testing (ISTQB)

1. **Testing shows the presence of defects, not their absence.** I can prove there are bugs, never that there are none.
2. **Exhaustive testing is impossible.** You can't test everything; you have to prioritize by risk.
3. **Testing early saves time and money** (*shift-left*). A defect found at the requirements stage costs far less than one found in production.
4. **Defects cluster together.** A buggy module usually has more bugs hiding in it (Pareto principle: ~80% of defects in ~20% of modules).
5. **The pesticide paradox.** Always repeating the same tests stops finding new bugs; you have to review and refresh your test cases.
6. **Testing is context-dependent.** You don't test a banking app the same way you test a video game.
7. **Absence of errors is a fallacy.** Bug-free software that doesn't solve the user's need is still a bad product.

## The QA role on an agile team

- Take part in refinements to spot ambiguities **before** anything gets built.
- Define clear, testable acceptance criteria together with product and development.
- Design and run tests (manual and automated) during the sprint, not at the end.
- Provide visibility: metrics, regression status, known risks.
- Be the voice of the user within the team.

::: tip Key idea
Quality is not the QA's sole responsibility: it belongs to the whole team. The QA **enables** it, **measures** it, and **defends** it.
:::
