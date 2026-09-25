# Advanced Test Analyst: practice questions

Eighteen **original** questions in the style of the [CTAL-TA v4.0](/istqb/advanced-test-analyst) exam, written by me around the telecom domain I work in. They're **not** official ISTQB questions and don't replace the official sample exam; they're a way to practice the techniques on concrete cases. Each question shows its K-level and points, weighted the way the official sample exam does it (K2 = 1, K3 = 2, K4 = 3).

Total: 33 points. Try them timed (about 45 minutes), and keep score: 65% is 22 points.

## Chapter 1 · The Test Analyst in the test process

### 1. Test case quality <Badge type="info" text="K2 · 1 pt" />

A regression test contains this step: *"Create the order with the standard payload. Expected result: the order is processed correctly."* Which quality criterion for test cases does the expected result most clearly violate?

- a) Traceability
- b) Precision
- c) Necessity
- d) Feasibility

::: details Answer
**b) Precision.** "Processed correctly" doesn't let two testers reach the same verdict. A precise expected result names the observable outcome: the order reaches `completed`, and the service in the inventory has the requested bandwidth. Traceability (a) is about links to the test basis; necessity (c) about whether the test is needed at all; feasibility (d) about whether it can be executed.
:::

### 2. The oracle problem <Badge type="info" text="K2 · 1 pt" />

A function calculates the size of the IP network to allocate for an order, from the number of usable addresses requested and whether the service is redundant. No document lists the expected size for every combination. Which approach best addresses this oracle problem?

- a) Compare each output with the expected value in the specification.
- b) Define relations that must hold between executions, such as "requesting more usable addresses never produces a smaller network" and "adding redundancy never reduces the size".
- c) Take the outputs of the current version as the expected results for future runs, without reviewing them.
- d) Run each combination twice and check that both outputs are identical.

::: details Answer
**b)** These are **metamorphic relations**: they check properties across executions when the exact expected output is unknown. (a) is impossible by definition here. (c) only detects *changes* in future versions; it never tells you whether today's output is right. (d) only checks determinism.
:::

### 3. Keyword-driven testing <Badge type="tip" text="K3 · 2 pts" />

A team writes keyword-driven tests for the ordering flow. Keywords in the domain layer should express business actions and checks; the test-interface layer implements them against the API. Which test is written at the right level and separates actions from verifications correctly?

- a) `SendPost /serviceOrder add.json` → `AssertStatus 201` → `SendGet /service/{id}` → `AssertJsonPath state=active`
- b) `CreateFiberOrder 1000Mbps` → `CompleteProvisioning` → `VerifyServiceActive` → `VerifyInventoryBandwidth 1000Mbps`
- c) `CreateFiberOrder 1000Mbps` → `ClickSubmitButton` → `VerifyServiceActive`
- d) `VerifyFiberOrder 1000Mbps` → `VerifyServiceActive`

::: details Answer
**b)** Business-level action keywords followed by verification keywords; the HTTP details live in the test-interface layer below. (a) is written entirely at interface level. (c) mixes levels (`ClickSubmitButton` is an interface detail). (d) hides the action inside a verification keyword, so actions and checks aren't separated.
:::

## Chapter 2 · Risk-based testing

### 4. Scoping the regression <Badge type="warning" text="K4 · 3 pts" />

A vendor release changes a shared provisioning process used by six of the project's twenty use cases. The team has time to run about 40% of the regression suite. Each regression test is traced to the use cases it covers, and the history shows that 70% of the regression defects found in past releases were in cancellation flows. Which selection is the most appropriate?

- a) Run every test of the use case that has the most tests, since it's the most exercised one.
- b) Select the tests traced to the six affected use cases, prioritize their cancellation flows based on the defect history, and fill the remaining time with the highest-risk tests of the other use cases.
- c) Run a random 40% of the suite, so that no area is systematically left out.
- d) Run only the tests that failed in the previous release.

::: details Answer
**b)** It combines **traceability-based impact analysis** (what the change touches), **history-based selection** (where defects tend to appear) and **risk-based selection** for the remaining budget. (a) ignores the change entirely. (c) wastes most of the budget on unaffected areas. (d) only looks backwards and misses the new change.
:::

## Chapter 3 · Test analysis and test design

### 5. Domain testing: closed boundary <Badge type="tip" text="K3 · 2 pts" />

An order is valid when the requested bandwidth *b* (whole Mbps) satisfies `100 ≤ b ≤ 1000`. For the **upper** boundary, which are the ON point and the OFF point?

- a) ON = 1000, OFF = 1001
- b) ON = 1001, OFF = 1000
- c) ON = 999, OFF = 1000
- d) ON = 1000, OFF = 999

::: details Answer
**a)** The ON point lies on the boundary: 1000. Because the boundary is **closed** (`≤`), it belongs to the domain, so the OFF point is the closest value on the other side, **outside** the domain: 1001.
:::

### 6. Domain testing: open boundary <Badge type="tip" text="K3 · 2 pts" />

A `modify` is accepted only if the new bandwidth *n* (whole Mbps) satisfies `n < 1000`. Which are the ON and OFF points of this boundary?

- a) ON = 999, OFF = 1000
- b) ON = 1000, OFF = 999
- c) ON = 1000, OFF = 1001
- d) ON = 999, OFF = 998

::: details Answer
**b)** The ON point is still the value on the boundary, 1000, but with an **open** boundary (`<`) it falls **outside** the domain. So the OFF point is the closest value on the other side, which is **inside**: 999. Compare with question 5: the ON point is always on the boundary, and the OFF point is always on the opposite side of the ON point.
:::

### 7. Base-choice coverage <Badge type="tip" text="K3 · 2 pts" />

Three parameters of an order: redundancy {**no**, yes}, IP version {**IPv4**, IPv6, dual stack} and CPE {**managed**, customer-owned, none}. The base values are in bold. How many test cases does **base-choice coverage** require?

- a) 4
- b) 6
- c) 9
- d) 18

::: details Answer
**b) 6.** One base test with all base values, plus one test for each non-base value, varying one parameter at a time: 1 + (2 − 1) + (3 − 1) + (3 − 1) = 6.
:::

### 8. Pairwise coverage <Badge type="tip" text="K3 · 2 pts" />

With the same three parameters as question 7 (2, 3 and 3 values), what is the **minimum** number of test cases that achieves pairwise coverage?

- a) 6
- b) 8
- c) 9
- d) 18

::: details Answer
**c) 9.** IP version × CPE alone produces 3 × 3 = 9 pairs, and each test can cover only one of them, so at least 9 tests are needed. Nine are also enough: the two redundancy values can be distributed across those nine tests so that every redundancy value appears with every IP version and every CPE. (18 is all combinations.)
:::

### 9. State transitions: 1-switch coverage <Badge type="tip" text="K3 · 2 pts" />

A simplified service order has these valid transitions:

| From | Event | To |
|---|---|---|
| acknowledged | start | inProgress |
| acknowledged | validation fails | rejected |
| inProgress | error | held |
| held | retry | inProgress |
| inProgress | finish | completed |

How many transition sequences must be exercised to achieve **1-switch** coverage?

- a) 4
- b) 5
- c) 6
- d) 8

::: details Answer
**b) 5.** 1-switch coverage requires every valid sequence of two consecutive transitions: start→error, start→finish, error→retry, retry→error and retry→finish. Transitions into `rejected` and `completed` can't be followed by anything. (0-switch coverage would need the 5 single transitions, reachable with just 2 test cases from `acknowledged`: one to `rejected`, and acknowledged → inProgress → held → inProgress → completed.)
:::

### 10. Decision tables: the checksum <Badge type="tip" text="K3 · 2 pts" />

A minimized decision table for a discount has three binary conditions: C1 *customer has active fiber*, C2 *adds a second mobile line*, C3 *is a business customer*.

| | R1 | R2 | R3 |
|---|---|---|---|
| C1 | N | Y | Y |
| C2 | – | Y | N |
| C3 | – | – | Y |
| Discount | 0% | 20% | 15% |

What does the checksum reveal?

- a) The table is complete: it covers the 8 combinations.
- b) One combination is missing: active fiber, no second line, not a business customer.
- c) R1 and R2 overlap, so the table is inconsistent.
- d) Two combinations are missing: every combination without a second line.

::: details Answer
**b)** With binary conditions, a rule with *k* dashes stands for 2<sup>k</sup> combinations: R1 = 4, R2 = 2, R3 = 1, total 7. A complete table needs 2<sup>3</sup> = 8, so one combination is missing, and it's C1 = Y, C2 = N, C3 = N. R1 and R2 can't overlap (they differ in C1), and the case "no second line" is partly covered by R1 and R3.
:::

### 11. Metamorphic relations <Badge type="tip" text="K3 · 2 pts" />

Which of the following is a valid **metamorphic relation** for testing a service-inventory search that accepts filters?

- a) Searching for `status=active` returns exactly the services listed in the test data sheet.
- b) Adding a second filter to a search never returns more results than the same search with only the first filter.
- c) Every search responds in under two seconds.
- d) Every search returns HTTP 200.

::: details Answer
**b)** A metamorphic relation links the inputs and outputs of **several executions** (a search and a more restricted version of it) without needing to know the exact expected result. (a) is a conventional oracle based on known data; (c) is a performance requirement; (d) is a check on a single execution.
:::

### 12. Test charters <Badge type="tip" text="K3 · 2 pts" />

Which is the best charter for an exploratory session on fallout handling?

- a) Test the fallout manager.
- b) Explore the fallout actions, using forced failures on `add` orders, to discover whether *continue* can leave items with missing values.
- c) Execute test cases FO-01 to FO-20 and record the results.
- d) Verify that *retry* works.

::: details Answer
**b)** A good charter says what to explore (the target), with what (resources, techniques) and what information to look for. (a) is too vague to guide a session; (c) describes scripted testing; (d) is a single check, not an exploration mission.
:::

### 13. Checklists: read-do or do-confirm? <Badge type="tip" text="K3 · 2 pts" />

A new team member has to validate a catalog deployment between two environments for the first time, using the team's checklist. How should they use it?

- a) Do-confirm: do the validation from memory, then go through the checklist to confirm nothing was missed.
- b) Read-do: read each item and perform it before moving on to the next.
- c) Neither: checklists are only for reviews, not for validation tasks.
- d) Do-confirm, because it's faster.

::: details Answer
**b) Read-do**, because the task is unfamiliar to them: they follow the checklist step by step. Do-confirm (a, d) suits experienced people who know the task and use the checklist as a final safety net. Checklists apply to many tasks, not only reviews (c).
:::

## Chapter 4 · Testing quality characteristics

### 14. Functional suitability <Badge type="info" text="K2 · 1 pt" />

For redundant services, the system allocates an IP network smaller than required. Which sub-characteristic of functional suitability does this defect affect?

- a) Functional completeness
- b) Functional correctness
- c) Functional appropriateness
- d) Interoperability

::: details Answer
**b) Functional correctness**: the function exists, but its result is wrong. Completeness (a) would be a missing function; appropriateness (c) a function that exists and works but doesn't help the user accomplish the task well. Interoperability (d) belongs to compatibility, not functional suitability.
:::

### 15. Compatibility <Badge type="info" text="K2 · 1 pt" />

The team tests that service orders sent by the customer's business systems are accepted, and that the status events of those orders arrive correctly in the customer's event hub. Which quality characteristic is being tested?

- a) Compatibility: co-existence
- b) Compatibility: interoperability
- c) Flexibility: adaptability
- d) Flexibility: installability

::: details Answer
**b) Interoperability**: two systems exchanging information and using what they exchanged. It's the part of compatibility that falls to the Test Analyst. Co-existence (a), sharing an environment without harming each other, is covered by the Technical Test Analyst.
:::

## Chapter 5 · Software defect prevention

### 16. Defect removal efficiency <Badge type="info" text="K2 · 1 pt" />

During a release, testing found 45 defects. In the following month, 5 more defects were found in production. What is the defect removal efficiency of testing for this release?

- a) 10%
- b) 11%
- c) 90%
- d) 111%

::: details Answer
**c) 90%.** DRE = defects removed before release / total defects = 45 / (45 + 5) = 0.90. (a) is the share of defects that escaped (5 / 50), (b) compares escaped with found (5 / 45), and (d) divides the wrong way round (50 / 45).
:::

### 17. Choosing a review technique <Badge type="tip" text="K3 · 2 pts" />

For the specification of a complex story, the team wants each reviewer to adopt a different stakeholder viewpoint (network operator, developer, tester) and to produce a draft of what they would derive from the document: the tester drafts test conditions, the developer a design outline. Which review technique fits best?

- a) Ad hoc reviewing
- b) Checklist-based reviewing
- c) Perspective-based reading
- d) Scenario-based reviewing

::: details Answer
**c) Perspective-based reading**: reviewers take different stakeholder viewpoints and try to use the work product to create what they'd derive from it, which exposes gaps and ambiguities. Ad hoc (a) gives no guidance; checklist-based (b) follows a list of known issues; scenario-based (d) walks through usage scenarios of the product.
:::

### 18. Analyzing test results <Badge type="warning" text="K4 · 3 pts" />

One week before a release, the regression shows: an overall pass rate of 88%; defects found per week over the last three weeks of 4, 6 and 9; 70% of the open defects in cancellation use cases; and only 45% of the cancellation tests executed, compared with 95% for the rest. Which conclusion is best supported by the data?

- a) The release is ready: the pass rate is above the 85% target.
- b) The release is at risk: the defect arrival rate is still rising, and the defect cluster coincides with the least-executed area. Prioritize executing (and fixing) the cancellation tests, and report the risk to stakeholders.
- c) Stop testing the cancellation flows, since their defects are already known, and focus on the other areas.
- d) Re-run the whole regression from scratch to confirm the pass rate.

::: details Answer
**b)** A rising arrival rate means the product isn't stabilizing, and a defect cluster in the area with the largest **test gap** suggests more defects remain there. The overall pass rate (a) hides both signals. (c) does the opposite of what the cluster suggests, and (d) spends the last week confirming a number that isn't the problem.
:::

::: tip How to use these
Get the answer *and* the reason. If you picked the right option for the wrong reason, count it as wrong: on the real exam, the distractors are built from exactly those half-understood reasons.
:::
