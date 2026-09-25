# Test case design

Since exhaustive testing is impossible, test case design is about choosing **the subset of tests most likely to find defects** with the least effort. These are the fundamental black-box techniques.

## Equivalence partitioning

Divide the inputs into groups (partitions) where the system should behave the same, and test **a single representative value from each group**.

**Example**: a "contracted bandwidth" field (in Mbps) that accepts 100 to 1000.

| Partition | Range | Test value | Valid? |
|---|---|---|---|
| Below minimum | < 100 | 50 | ❌ Invalid |
| Accepted | 100–1000 | 500 | ✅ Valid |
| Above maximum | > 1000 | 2000 | ❌ Invalid |
| Non-numeric | "abc" | "abc" | ❌ Invalid |
| Empty | — | "" | ❌ Invalid |

With 5 cases I cover what would be infinite by brute force. Careful: invalid partitions are tested **one at a time**, so one rejection doesn't mask another.

## Boundary value analysis

Bugs live at the edges: the classic `>` that should have been `>=`. For each boundary you test the boundary value itself and its immediate neighbors.

For the 100–1000 range, ISTQB distinguishes two variants:

- **2-value BVA**: each boundary and its nearest neighbor on the other side: **99, 100** and **1000, 1001**.
- **3-value BVA**: each boundary and both neighbors: **99, 100, 101** and **999, 1000, 1001**. More cases, and it catches a few more mistakes (like `==` where `<=` was meant).

Exam questions tell you which variant to apply, so read them carefully. This technique is always combined with the previous one: partitions to cover the groups, boundaries to sharpen the edges.

## Decision tables

When behavior depends on **combinations of conditions**, a decision table guarantees no combination slips through.

**Example**: convergence discount at a telecom operator (a customer adding a mobile tariff).

| Condition | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| Has fiber contracted? | Yes | Yes | No | No |
| Adds a second mobile line? | Yes | No | Yes | No |
| **Result: discount on the mobile fee** | **20%** | **10%** | **5%** | **0%** |

Each column (rule) is a test case. With N binary conditions there are 2<sup>N</sup> combinations; you can then collapse the ones that lead to the same result.

## State transition

For systems with states (a service order: `created → validated → provisioning → active`), you model the states and the valid transitions, and test:

- Every **valid transition** (*valid transitions coverage*, also known as 0-switch coverage).
- The **invalid** transitions too: what happens if I try to cancel a service order that's already active? Covering valid and invalid ones is *all transitions coverage*.

In telecom this technique is daily work: a [service order](/telecom/service-orders-tmf641) has a dozen states, and the transitions between `held`, `partial` and the cancellation states are where the bugs hide.

## Pairwise (combinatorial)

When there are too many parameters to test every combination (browser × OS × language × currency…), pairwise generates the minimal set of cases covering **every pair of values**. The empirical justification: the vast majority of combinatorial defects are triggered by the interaction of just 2 parameters.

## Taming combinatorial explosion: follow the code paths

Two CPE devices × {active, terminated} × {with, without interface} already explodes, and "if you try to test everything, life isn't long enough", as a developer put it. The strategy we agreed on: **look at how the logic is actually built and cover the paths it really takes**, not the Cartesian product of the inputs. Testing every negative combination is tedious and probably unnecessary if input validation is well controlled upstream. (Pairwise, above, is the systematic version of the same idea when you can't see the code.)

## From technique to test case

- **A test case doesn't copy the acceptance criterion.** The criterion says *what* must hold ("the customer can pay"); the test case says *how* it's checked: preconditions, concrete steps, input data and expected result. Pasting the criterion into a test doesn't make it a test.
- **Design cases in the design phase**, in parallel with the PO finishing the criteria and development deciding the implementation. When the story reaches QA, it's time to execute, not to start writing cases.
- **Make inputs distinguishable.** When several inputs end up in the same output record (several forms feeding one order), fill each with recognizable values (`-001`, `-002`…) so you can trace which value came from where. With identical values, the verification step can't be verified.
- **Reproduce the condition, not just the scenario.** When re-validating a fix, first identify the condition that triggered the original failure. A cancellation bug that only appeared *after a form had been completed* would have "passed" if retested by cancelling with the form still empty.

## How I choose the technique

| Situation | Technique |
|---|---|
| Field with numeric or date ranges | Partitions + boundary values |
| Business rules with several conditions | Decision table |
| Flows with states and transitions | State transition |
| Configuration explosion | Pairwise |
| Ambiguous requirements or unknown territory | Exploratory testing |

::: tip Key idea
Techniques exist to pick the few tests that matter out of infinitely many. Choose the technique by the shape of the problem (ranges, rules, states, combinations), and when the combinations explode, let the real code paths, not the Cartesian product, decide.
:::

## References

- [ISTQB CTFL v4.0 syllabus](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/), chapter 4: test analysis and design
- [Exploratory testing](/fundamentals/exploratory-testing)
