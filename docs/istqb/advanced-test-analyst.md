# Advanced Test Analyst (CTAL-TA v4.0): exam and syllabus map

My map of the **Certified Tester Advanced Level Test Analyst v4.0** (released May 2025): how the exam is built, what each chapter asks of you, and which articles on this wiki prepare the ground. As with the [CTFL section](/istqb/), the syllabus and sample exams are ISTQB copyrighted material: this page **doesn't reproduce them**. It organizes and explains them in my own words. Study from the original.

## The exam in numbers

| Fact | Value |
|---|---|
| Questions | 45, multiple choice (one correct answer unless the question says otherwise) |
| Points | **78** in total; questions are weighted by K-level |
| Pass mark | **51 points** (65%) |
| Duration | 120 minutes (150 with the 25% extension for non-native speakers) |
| Prerequisite | The CTFL certificate, any version |
| K-levels | K2 (understand), K3 (apply), K4 (analyze); keywords at K1 |

In the official sample exam, **a K2 question is worth 1 point, a K3 2 points and a K4 3 points**, and the paper has 18 K2, 21 K3 and 6 K4 questions (18 + 42 + 18 = 78). The consequence is blunt: **more than half of the points come from applying techniques**. Reading the syllabus won't pass this exam; doing exercises will.

**Time budget**: 45 questions in 120 minutes is about 2 min 40 s each on average, but they're not equal. My plan: about 1 minute per K2, 3 per K3 and 5 per K4, which leaves around 10 minutes to review flagged questions.

## What the certificate says you can do

The syllabus defines nine business outcomes. In short, a certified Test Analyst can:

1. Adapt testing to the software development lifecycle in use.
2. Contribute to risk-based testing.
3. Select and apply the right test techniques.
4. Produce and maintain test documentation (test conditions, test cases, test data, environment requirements).
5. Choose and apply functional test types.
6. Contribute to non-functional testing (usability, compatibility, flexibility).
7. Contribute to defect prevention.
8. Use tools to work more efficiently.
9. Define the requirements for test environments and test data.

## Chapter map

| Chapter | Minimum training time | Learning objectives | Weight in the official sample exam | Read first on this wiki |
|---|---|---|---|---|
| 1. The Test Analyst's tasks in the test process | 225 min | 12 (11 K2, 1 K3) | 8 questions · 9 points | [Agile testing strategy](/strategy/agile-testing-strategy), [Test management with Xray](/strategy/test-management-with-xray), [Test environments strategy](/strategy/test-environments-strategy) |
| 2. The Test Analyst's tasks in risk-based testing | 90 min | 2 (1 K2, 1 K4) | 3 questions · 7 points | [What E2E tests should cover](/strategy/what-e2e-tests-should-cover), [Environment validations](/cicd/environment-validations) |
| 3. Test analysis and test design | **615 min** | 13 (4 K2, 8 K3, 1 K4) | **22 questions · 42 points** | [Test case design](/fundamentals/test-case-design), [Exploratory testing](/fundamentals/exploratory-testing), [Service orders](/telecom/service-orders-tmf641) (a real state machine) |
| 4. Testing quality characteristics | 60 min | 4 (all K2) | 4 questions · 4 points | [Types of testing](/fundamentals/types-of-testing) |
| 5. Software defect prevention | 225 min | 5 (2 K2, 2 K3, 1 K4) | 8 questions · 16 points | [Bug root cause analysis](/strategy/bug-root-cause-analysis), [How to review a task](/strategy/how-to-review-a-task), [Acceptance criteria & DoR](/strategy/acceptance-criteria-and-dor) |

The per-chapter weights are **my own count of the official sample exam**, not an official distribution, but the message is clear: chapter 3 is more than half of the exam, and chapter 5 weighs far more than its size suggests.

## Chapter by chapter

### 1. The Test Analyst in the test process

- How the Test Analyst's involvement changes with the lifecycle (sequential vs iterative and agile), and their tasks in analysis, design, implementation and execution.
- **High-level vs low-level test cases**: when each fits (experienced testers and changing requirements vs regulated contexts, inexperienced testers or automation).
- **Quality criteria for test cases**: correctness, feasibility, necessity, understandability, traceability, consistency, precision, completeness, conciseness. Worth being able to spot a violation in an example.
- **Test environment requirements** (what's needed, who provides it, when, and with what *fidelity* to production) and **test data requirements**. In my day job this is literally the question of [what's mocked where](/strategy/test-environments-strategy).
- **Test oracles and the oracle problem**: what to do when you can't know the expected result exactly (pseudo-oracles, model-based testing, property-based and metamorphic testing, human oracles, assertions).
- **Keyword-driven testing** (the chapter's K3): action keywords vs verification keywords, and the separation between the domain layer and the test-interface layer.
- Tools to manage testware: test, defect, test data, configuration and requirements management.

### 2. Risk-based testing

- The Test Analyst's contribution to **product risk analysis**: identifying risks, assessing them (likelihood and impact), and categorizing them by quality characteristic (ISO/IEC 25010).
- **Risk control, and the chapter's K4: impact analysis to decide the regression scope.** Know the selection approaches (risk-based, history-based, coverage-based, a requirements traceability matrix, operational profiles, tool-supported impact analysis) and when each makes sense. Expect a scenario where you must pick the regression set.

### 3. Test analysis and test design

The black-box techniques are now grouped by what they're based on:

**Data-based**

- **Domain testing** (K3) generalizes equivalence partitioning and boundary value analysis to domains defined by several variables. The vocabulary to master: an **ON point** lies on the boundary; an **OFF point** is as close as possible to it on the other side; **IN** and **OUT** points are inside and outside the domain, away from the boundary. Whether the ON point belongs to the domain depends on whether the boundary is closed (`≤`) or open (`<`).
- **Combinatorial testing** (K3): **base-choice** coverage (pick a base value for each parameter and vary one parameter at a time: 1 + Σ(nᵢ − 1) tests) and **pairwise** coverage (every pair of values appears at least once; the minimum is at least the product of the two largest value counts). Classification trees help capture parameters and values.
- **Random testing** (K2), guided or unguided.

**Behavior-based**

- **CRUD testing** (K2): a CRUD matrix of entities × operations, checked for **completeness** (is every entity created, read, updated and deleted somewhere?) and **consistency**.
- **State transition testing** (K3), with **N-switch coverage** (0-switch: every single valid transition; 1-switch: every valid sequence of two consecutive transitions…) and **round-trip coverage**.
- **Scenario-based testing** (K3) from activity diagrams and use cases: main, extension and exception scenarios, and loop coverage.

**Rule-based**

- **Decision table testing** (K3): building tables, **minimizing** them with "–" (don't care), the **checksum** to verify a minimized table (with binary conditions, a rule with *k* dashes stands for 2<sup>k</sup> full rules, and the total must be 2<sup>n</sup> for *n* conditions), and reviewing tables for consistency, feasibility, completeness and correctness.
- **Metamorphic testing** (K3): when you can't know the exact expected output, check *relations* between the outputs of several executions (filtering a search further can never return more results; applying a change and then its inverse must restore the original state).

**Experience-based**

- **Test charters** for session-based testing (K3), **checklists** used as *read-do* (follow step by step, for unfamiliar tasks) or *do-confirm* (work from memory, then check, for experienced people) (K3), and **crowd testing** (K2).

**Choosing**

- **Selecting techniques to mitigate specific product risks** (K4), and the benefits and risks of **automating test design** (K2).

### 4. Testing quality characteristics

Based on **ISO/IEC 25010:2023**, whose renamed characteristics you need to know:

- **Functional suitability**: completeness (is every needed function there?), correctness (are the results right?) and appropriateness (does it actually help the user do the task?).
- **Usability** / interaction capability, including user experience and **accessibility** (WCAG levels A, AA, AAA), and how to evaluate it: reviews, usability test sessions, questionnaires (SUMI, WAMMI).
- **Flexibility** (formerly *portability*): the Test Analyst's part is adaptability and installability.
- **Compatibility**: the Test Analyst's part is **interoperability**; co-existence belongs to the Technical Test Analyst.

### 5. Software defect prevention

- **Metrics**: defect removal efficiency (DRE), phase containment effectiveness (PCE) and cost of quality.
- **Phase containment**: using models to find defects in specifications and through model-based testing (K3), and choosing **review techniques** (K3): ad hoc, checklist-based, scenario-based, role-based and perspective-based reading.
- **Stopping recurrence**: **analyzing test results** (the chapter's K4: predicted vs actual defect clusters, defect detection percentage, structural coverage, test gap analysis, defect arrival patterns) and **classifying defects for root cause analysis** (K2: ODC, IEEE 1044, severity-based classifications, taxonomies; five whys, cause-effect diagrams, Pareto analysis).

## What changed from v3.1

If a course, book or question bank predates May 2025, check it against this list:

- **Five chapters instead of six.** The old tools chapter was folded into chapter 1, and the old reviews chapter grew into **software defect prevention**.
- **Technique changes**: equivalence partitioning and boundary values (K4 in v3.1) became **domain testing** (K3); pairwise and classification trees merged into **combinatorial testing**; use case testing became **scenario-based testing**; state transitions now focus on N-switch and round-trip coverage; exploratory testing became **test charters plus checklists**.
- **Fewer K4s, more K3s**: 31 learning objectives (16 K2, 5 K3, 10 K4) became 36 (22 K2, 11 K3, 3 K4).
- **New topics**: test case quality criteria, test environment and test data requirements, test oracles, random, CRUD, metamorphic and crowd testing, automating test design, using models to detect defects, analyzing test results, defect classification for root cause analysis.
- **Updated standards**: ISO/IEC 25010:2023 and ISO/IEC/IEEE 29119-4:2021.

## Official documents

All free on the [ISTQB Test Analyst page](https://istqb.org/certifications/certified-tester-advanced-level-test-analyst/):

- **Syllabus v4.0**: THE source; every question derives from it.
- **Sample exam v4.1** (questions and answers with justifications): 45 questions like the real paper plus 8 additional ones.
- **Exam Structure Tables**: the official rules for points and distribution.
- The **[ISTQB glossary](https://glossary.istqb.org/)** for the exact terminology.

::: tip Key idea
The Advanced Test Analyst exam rewards applying techniques under time pressure, not remembering definitions: more than half of the points are K3. Plan your study around exercises in chapter 3, and don't neglect chapter 5, which is worth more than it looks.
:::
