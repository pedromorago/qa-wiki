# Test case design

Since exhaustive testing is impossible, test case design is about choosing **the subset of tests most likely to find defects** with the least effort. These are the fundamental black-box techniques.

## Equivalence partitioning

Divide the inputs into groups (partitions) where the system should behave the same, and test **a single representative value from each group**.

**Example**: an "age" field that accepts 18 to 65.

| Partition | Range | Test value | Valid? |
|---|---|---|---|
| Under age | < 18 | 10 | ❌ Invalid |
| Accepted | 18–65 | 40 | ✅ Valid |
| Over age | > 65 | 70 | ❌ Invalid |
| Non-numeric | "abc" | "abc" | ❌ Invalid |
| Empty | — | "" | ❌ Invalid |

With 5 cases I cover what would be infinite by brute force. Careful: invalid partitions are tested **one at a time**, so one rejection doesn't mask another.

## Boundary value analysis

Bugs live at the edges: the classic `>` that should have been `>=`. For each boundary you test the boundary value itself and its immediate neighbors.

For the 18–65 range: test **17, 18, 19** and **64, 65, 66**.

This technique is always combined with the previous one: partitions to cover the groups, boundaries to sharpen the edges.

## Decision tables

When behavior depends on **combinations of conditions**, a decision table guarantees no combination slips through.

**Example**: discount in an e-commerce site.

| Condition | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| Premium customer? | Yes | Yes | No | No |
| Purchase > €100? | Yes | No | Yes | No |
| **Result: discount** | **20%** | **10%** | **5%** | **0%** |

Each column (rule) is a test case. With N binary conditions there are 2^N combinations; you can then collapse the ones that lead to the same result.

## State transition

For systems with states (an order: `created → paid → shipped → delivered`), you model the states and the valid transitions, and test:

- Every valid transition (transition coverage).
- The **invalid** transitions: what happens if I try to cancel an order that's already been delivered?

## Pairwise (combinatorial)

When there are too many parameters to test every combination (browser × OS × language × currency…), pairwise generates the minimal set of cases covering **every pair of values**. The empirical justification: the vast majority of combinatorial defects are triggered by the interaction of just 2 parameters.

## How I choose the technique

| Situation | Technique |
|---|---|
| Field with numeric or date ranges | Partitions + boundary values |
| Business rules with several conditions | Decision table |
| Flows with states and transitions | State transition |
| Configuration explosion | Pairwise |
| Ambiguous requirements or unknown territory | Exploratory testing |
