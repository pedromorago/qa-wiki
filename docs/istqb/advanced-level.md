# The ISTQB Advanced Level: which module, and what changes

The Foundation Level ([CTFL](/istqb/exam-format)) checks that you know the vocabulary and the basic techniques. The **Advanced Level** checks that you can **apply them to a scenario and justify the choice**: longer questions, several correct-looking options, and a good share of analysis questions. It isn't one exam but a set of modules, each aimed at a different role.

The one I'm preparing is **Test Automation Engineering (CTAL-TAE v2.0)**, and it's the module this section covers in depth.

::: info Data checked in September 2026
ISTQB updates syllabi and exam rules regularly. The figures below come from the official ISTQB documents as of September 2026. Before booking, check the current **Exam Structure Tables** and the module's page on [istqb.org](https://istqb.org/).
:::

## The modules at a glance

| | Test Automation Engineering (CTAL-TAE) | Test Analyst (CTAL-TA) | Technical Test Analyst (CTAL-TTA) | Test Management (CTAL-TM) |
|---|---|---|---|---|
| **For whom** | Whoever designs, builds and maintains the test automation | Whoever designs and runs tests from the business side | Whoever tests from the code and the architecture | Whoever plans, leads and reports testing |
| **Focus** | Automation architecture and frameworks, approaches and design patterns, pilots and deployment risks, CI/CD, reporting, verifying and improving the automation | Test techniques at depth, risk-based testing, quality characteristics, defect prevention | White-box techniques, static and dynamic analysis, technical quality characteristics, reviews | Managing the test activities, the product and the team |
| **Current version** | **v2.0** (May 2024) | v4.0 (May 2025) | v4.0 (June 2021) | v3.0 (May 2024) |
| **Questions** | **40** | 45 | 45 | 50 |
| **Points / pass mark** | **66 points, pass with 43** (65%) | 78 points, pass with 51 (65%) | 78 points, 65% | 65%; check the current total |
| **Duration** | **90 min** (113 with the 25% extension) | 120 min (+25%) | 120 min (+25%) | 120 min (+25%) |
| **Chapters** | 8 | 5 | 6 | 3 |

Things they have in common:

- **Prerequisite: the CTFL certificate** (any version). Practical experience is recommended: the TAE syllabus asks for at least six months as a test or development engineer, and some exam providers ask for more.
- **Questions are weighted by cognitive level.** Besides K2 (understand) and K3 (apply), there are **K4 (analyze)** questions. In the official sample exams, a K2 question is worth 1 point, a K3 2 points and a K4 3 points. You can't pass by getting the easy ones right.
- **The certificates don't expire.**

Two neighbors worth knowing: **Test Automation Strategy** (CT-TAS v1.0, a Specialist module released alongside TAE v2.0) holds the *strategic* side of automation (business case, organizational deployment, metrics catalog), and the new **Agile Tester** (CTAL-AT v2.0, 2026) replaces the old agile certifications.

## Which one first?

- **Test Automation Engineering** if you build and maintain automated tests: frameworks, page objects and API layers, pipelines, reports, flaky tests. It's about the *engineering* of automation, not about a particular tool.
- **Test Analyst** if your day-to-day is analyzing requirements and designing test cases. It's the natural continuation of CTFL chapter 4.
- **Technical Test Analyst** if you work close to the code: white-box techniques, static analysis, performance, security.
- **Test Management** if you coordinate testing: strategy, estimation, metrics, reporting, leading testers.
- **Test Automation Strategy** (Specialist) if you decide *whether and how* an organization automates, rather than building it.

For me the choice is TAE: I've built Playwright and TypeScript suites, a REST Assured API framework, CI pipelines and a sharding optimizer, and the syllabus gives names and structure to exactly that work (layered frameworks, the facade and page object patterns, test levels in pipelines, failure analysis, static analysis of test code).

## Don't study with outdated material

TAE v2.0 is **a complete rewrite** of the 2016 syllabus, not an update. The 2016 exam was retired (in English in June 2025, in other languages in December 2025). Old courses and question banks will drill you on things that are gone (the full generic test automation architecture with its four layers, transitioning manual tests to automation, the metrics catalog, the test automation manager) and miss the new ones (CI/CD pipelines, a three-layer framework, SOLID and design patterns, TDD and BDD, contract testing, static analysis of test code, AI-assisted maintenance). The full list is in the [TAE exam page](/istqb/tae-exam#what-changed-from-2016).

## Taking it in Spain

- The Spanish member board, [SSTQB](https://www.sstqb.com/), publishes syllabi and sample exams. For TAE v2.0, a Spanish translation of the syllabus existed only as a **draft** when this page was written, and there was no Spanish sample exam.
- Exams are taken through accredited providers (for example Brightest, at test centers or online with remote proctoring). **Check the exam language before you study**: if there's no final Spanish version, the English exam with the 25% extra time (113 minutes) is the safe option, and then it pays to study from the English syllabus.

## Where to go next

- [Advanced Test Automation Engineering (CTAL-TAE v2.0)](/istqb/tae-exam): the exam in numbers and a chapter-by-chapter map.
- [TAE study plan](/istqb/tae-study-plan): eight weeks weighted by exam points, with a small framework built by hand along the way.
- [TAE practice questions](/istqb/tae-practice-questions): original questions in the exam's style, with explained answers.

## References

- [ISTQB — Advanced Level Test Automation Engineering v2.0](https://istqb.org/certifications/certified-tester-advanced-level-test-automation-engineering-ctal-tae-v2-0/)
- [ISTQB — Test Automation Strategy (CT-TAS)](https://istqb.org/certifications/certified-tester-test-automation-strategy-ct-tas/)
- [ISTQB — Advanced Level Test Analyst](https://istqb.org/certifications/certified-tester-advanced-level-test-analyst/)
- [SSTQB — Spanish member board](https://www.sstqb.com/)
