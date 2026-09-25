# Study plan for the Advanced Test Analyst

How I'm preparing the [CTAL-TA v4.0](/istqb/advanced-test-analyst): ten weeks, around six to eight hours a week, with the time allocated by **exam points** rather than by pages. The syllabus's minimum training time is about 20 hours for an accredited course; self-study with exercises takes several times that.

The principle is the same as for the [CTFL](/istqb/study-plan): *the syllabus tells you what will be asked; the sample exam shows you how*. What changes is the balance: at this level, more than half of the points are for **applying** a technique, so most of the hours go into exercises.

## Before starting

- Download the **syllabus v4.0**, the **sample exam v4.1** (questions and answers) and the **Exam Structure Tables** from the [ISTQB page](https://istqb.org/certifications/certified-tester-advanced-level-test-analyst/).
- **Throw away v3.1 material**, or at least check it against the [list of changes](/istqb/advanced-test-analyst#what-changed-from-v3-1). Most question banks online are still v3.1.
- Decide the exam language now (see [taking it in Spain](/istqb/advanced-level#taking-it-in-spain)): it decides which syllabus you study from.

## The ten weeks

| Week | Focus | What "done" looks like |
|---|---|---|
| 1 | **Diagnosis.** Quick read of the whole syllabus; take the sample exam untimed, without studying. List the learning objectives you couldn't answer. | A baseline score and a list of weak learning objectives |
| 2 | **Chapter 1**: test cases (high/low level, quality criteria), oracles, environment and data requirements, keyword-driven testing | You can critique a test case against the quality criteria and write a keyword-driven test |
| 3 | **Chapter 2**: product risk analysis and **impact analysis for regression** (K4) | You can justify a regression scope for a change, choosing the selection approach |
| 4 | **Chapter 3 · data-based**: domain testing (ON/OFF/IN/OUT points), random testing | You derive domain test points for one- and two-variable conditions without hesitating |
| 5 | **Chapter 3 · data-based (cont.) and CRUD**: base-choice and pairwise by hand, classification trees, CRUD matrices | You compute the number of base-choice and pairwise tests and build a pairwise set by hand |
| 6 | **Chapter 3 · behavior-based**: state transitions (0-switch, 1-switch, round-trip), scenario-based testing from use cases and activity diagrams | You count the transitions and sequences for each coverage level on a diagram |
| 7 | **Chapter 3 · rule-based, experience-based, choosing**: decision tables (minimization, checksum, review), metamorphic relations, charters, checklists, technique selection (K4) | You minimize a table and verify it with the checksum; you can write metamorphic relations for a feature |
| 8 | **Chapters 4 and 5**: quality characteristics (ISO/IEC 25010:2023); defect prevention: DRE and PCE, review techniques, analysis of test results (K4), defect classification | You compute DRE/PCE and pick a review technique for a scenario |
| 9 | **Timed exam**: the sample exam again, under real conditions (120 minutes); then the wiki's [practice questions](/istqb/advanced-practice-questions). Review **every** justification. | A timed score and a new, shorter list of weak objectives |
| 10 | **Consolidation**: redo the weak objectives, the sample exam's additional questions, a last timed run | A stable score with margin, then book the exam |

**Target before booking**: consistently around **60 out of 78** (the pass mark is 51). The real exam always feels harder than your living room.

## Exercises from my own work

The best exercises are the ones built on a system you know. These are the ones I use, from the telecom domain:

| Technique | Exercise |
|---|---|
| **Domain testing** | A `modify` may not raise the bandwidth from below 1 Gbps to above 1 Gbps: a two-variable domain (current and new bandwidth). Derive the ON/OFF points of each boundary. |
| **Combinatorial** | Order characteristics: redundancy (yes/no) × IP version (IPv4/IPv6/both) × CPE (managed/customer-owned). Base-choice set vs pairwise set. |
| **CRUD** | Services in the inventory: created by `add`, read by `GET`, updated by `modify`, and "deleted"… which only sets them to terminated. Is the matrix complete? Is that a defect or a design decision? |
| **State transitions** | The [service order state machine](/telecom/service-orders-tmf641#the-state-machine): count the 0-switch and 1-switch items, and find the invalid transitions worth testing. |
| **Decision tables** | A decomposition rule of the [catalog](/telecom/catalog-cfs-rfs): conditions on the order → which RFS gets instantiated. Minimize and check it with the checksum. |
| **Metamorphic** | Raising the bandwidth and then lowering it back must leave the inventory as it was; adding a filter to an inventory search can never return more results. |
| **Checklists** | The [catalog deployment validation](/telecom/catalog-cfs-rfs#validating-a-catalog-deployment-between-environments) as a read-do checklist for a newcomer, and as do-confirm for someone experienced. |
| **Charters** | "Explore the fallout actions with forced failures to discover whether *continue* can leave the order inconsistent." |
| **Impact analysis** | A vendor release changes a core process used by several use cases: which regression set, and why? |
| **Review techniques** | Perspective-based reading of a story: as the operator, as the developer, as the tester. |
| **Test oracles** | The TM Forum specification and the inventory as oracles; metamorphic relations where neither helps. |
| **Environment requirements** | The fidelity of each environment: which integrations are real and which mocked ([test environments strategy](/strategy/test-environments-strategy)). |
| **Test results analysis** | Defects per use case during a release regression: where are the clusters, and is the arrival rate still growing? |

## Exam-day tactics

- **Do a first pass answering the K2 questions fast** and flagging long K3/K4 ones; come back to them with the remaining time.
- **Read the scenario before the options** in K4 questions, and note the constraint that decides the answer (risk, time, the lifecycle, the tester's experience).
- **For calculation questions, write the working down**: pairwise and base-choice counts, transitions, checksums. Most mistakes are arithmetic, not concept.
- Wrong answers don't subtract points: never leave a question blank.

## Common mistakes

- **Studying from v3.1 material.** Domain testing, CRUD, metamorphic testing and test result analysis don't exist there, and they're on the exam.
- **Reading instead of practicing.** Over half of the points are K3.
- **Underestimating chapter 5.** It's a small chapter by pages but worth a fifth of the sample exam.
- **Skipping the justifications of the answers you got right.** That's where the examiner's reasoning lives.

::: tip Key idea
Allocate study time by exam points, not by pages, and practice each technique on a system you know. If you can explain why you chose a technique for your own project, the K4 questions become much easier.
:::
