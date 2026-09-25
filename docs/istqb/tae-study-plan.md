# Study plan for the Advanced Test Automation Engineering

How I'm preparing the [CTAL-TAE v2.0](/istqb/tae-exam): eight weeks, with the time split between **reading the syllabus by exam weight** and **building a small test automation framework by hand**, one chapter at a time. The syllabus is about the engineering of automation, so the best way to make it stick is to engineer something: every concept below becomes a commit.

The principle from the [CTFL plan](/istqb/study-plan) still holds (*the syllabus tells you what will be asked; the sample exam shows you how*), but at this level almost 70% of the points are K3 and K4. Recognizing a pattern isn't enough; you have to choose it for a scenario and defend the choice.

## Before starting

- Download the **syllabus v2.0**, the latest **sample exam** (questions and answers) and the **Exam Structure Tables** from the [ISTQB page](https://istqb.org/certifications/certified-tester-advanced-level-test-automation-engineering-ctal-tae-v2-0/).
- **Discard 2016 material** (see [what changed](/istqb/tae-exam#what-changed-from-2016)).
- Decide the exam language (see [taking it in Spain](/istqb/advanced-level#taking-it-in-spain)).
- **Pick a practice target**: a public demo web app plus a public REST API (a pet store or shop demo is enough), and one stack. Mine: **TypeScript + Playwright** for both UI and API tests, which is what I use at work.
- **One rule for the exercises: write the code yourself.** An assistant can review it afterwards, but generating it would defeat the purpose: the exam asks about design decisions, and you only understand the ones you've made.

## The eight weeks

| Week | Syllabus | Build | Done when |
|---|---|---|---|
| 1 | **Ch. 1–2** + diagnostic: read the whole syllabus once, take the sample exam untimed | Scaffold the project. Write a **tool evaluation table** (tools in columns, requirements in rows) for your own context, and a testability wish list for the SUT (stable IDs for locators, config through environment variables) | Baseline score, list of weak objectives, evaluation table you could present |
| 2 | **Ch. 3 · architecture and approaches** | Split the code into **three layers**: tests → business logic (page objects, API client) → core (HTTP wrapper, config, logger). Write the same test as a **linear** script, then **structured**, then **data-driven** (JSON/CSV), then with a tiny **keyword** interpreter | You can explain which approach you'd pick for three different teams and why |
| 3 | **Ch. 3 · principles and patterns** | Add a **facade** for the API client, make the browser/client a **singleton** where it makes sense, and put a **flow** layer (user actions) on top of the page objects | Tests read like business flows, and a locator change touches one file |
| 4 | **Ch. 4 · pilot, risks, maintainability** | Write a one-page **pilot plan** (scope, prototypes, checkpoints, success criteria) and a **risk table** with mitigations. Add fixtures for setup/teardown, **logging levels** in the core library, and ESLint with formatting | You can analyze a deployment scenario and name its risks and mitigations |
| 5 | **Ch. 5 · pipelines and configuration management** | A CI pipeline (GitHub Actions or similar): unit tests of the core library and a **configuration test** (all referenced files exist) on every push, a smoke suite after deployment, a **scheduled nightly regression**. Environment config and test data versioned with the testware; a tag per release | You can place each test level in a pipeline and justify the gate |
| 6 | **Ch. 6 · data, analysis, reporting** | Log start/end times and step timings, attach screenshots and traces on failure, log a **correlation ID** per request, publish an HTML report and a JUnit export. Drill the **five-step failure analysis** on real failures | Given a failing run, you can tell SUT defect vs framework defect vs environment outage |
| 7 | **Ch. 7–8 · verify and improve** | Run the suite repeatedly (e.g. `--repeat-each`) and build a **test histogram** of fragile tests; quarantine them. Add a lint rule for tests without assertions and a secret scanner. Replace fixed waits with **polling with a timeout**; replace field-by-field assertions with **schema validation**; parallelize | You can recommend improvements for a deployed TAS and rank them |
| 8 | **Exam practice** | Timed sample exam (90 minutes), then the wiki's [practice questions](/istqb/tae-practice-questions); review **every** justification; redo the weak objectives | A stable timed score with margin, then book the exam |

**Target before booking**: consistently around **52 out of 66** (the pass mark is 43).

The reading effort follows the points of the sample exam: chapter 8 (13 points), chapter 3 (10) and chapter 2 (9) get the most attention; chapter 1 (3 points) needs one careful read and the list of limitations memorized.

## From this wiki to each chapter

| Chapter | Where I've already done it |
|---|---|
| 2. Preparing | [Test environments strategy](/strategy/test-environments-strategy) (what each environment can prove), [mocks](/strategy/mocks-in-integration-testing) (emulating the unreachable parts), [the E2E tools landscape](/automation/e2e-tools-landscape) (choosing a tool) |
| 3. Architecture | [API framework architecture](/api-testing/api-framework-architecture) (layers), [Page Object Model](/automation/page-object-model), [BDD with Cucumber](/automation/bdd-with-cucumber), [Karate](/api-testing/karate-api-testing) |
| 4. Implementing | [Migrating from TestCafe to Playwright](/automation/migrating-from-testcafe-to-playwright): a proof of concept against the worst tests, with measured velocity and listed risks, which is exactly a pilot |
| 5. Pipelines | [Environment validations](/cicd/environment-validations) (which suite at which stage), [Jenkins and GitLab CI](/cicd/jenkins-and-gitlab-ci), [Git for QA](/cicd/git-for-qa) |
| 6. Reporting | [Investigating hard failures](/strategy/investigating-hard-failures) (control runs, logs, comparisons), [Bug reporting](/fundamentals/bug-reporting) |
| 7. Verifying | [Static analysis](/cicd/static-analysis), [Bug root cause analysis](/strategy/bug-root-cause-analysis) (the binary triage of pipeline failures) |
| 8. Improving | [Parallelization and sharding](/cicd/parallelization-and-sharding), [Async APIs with Awaitility](/api-testing/async-apis-with-awaitility) (polling instead of sleeps), [JSON Schema validation](/api-testing/json-schema-validation), [AI in test automation](/automation/ai-in-test-automation) |

## Exam-day tactics

- **First pass: answer the K2 questions fast** and flag the long K3/K4 ones.
- **In scenario questions, find the constraint that decides the answer**: who writes the tests (programmers or not), how often the SUT changes, what the pipeline must gate, what's reachable in each environment.
- **"Select TWO" questions** only score if both choices are right: read them twice.
- **Watch the syllabus's exact vocabulary**: TAS vs TAA vs TAF, test log vs test progress report, and the order of the wait mechanisms. Keywords can be asked on their own.
- Wrong answers don't subtract points: never leave a question blank.

## Common mistakes

- **Studying with 2016 material**: a full chapter on transitioning manual tests and a four-layer gTAA that the new exam barely touches.
- **Treating it as a tool exam.** It never asks about Playwright or Selenium APIs; it asks about architecture, approaches and decisions.
- **Leaving chapter 8 for the last day.** It's the heaviest chapter in points.
- **Reading about patterns without implementing them.** The difference between a facade and a flow model is obvious once you've written both, and confusing on paper.

::: tip Key idea
Build the framework the syllabus describes while you study it: layered, patterned, running in a pipeline, reporting its failures and improving itself. By week eight, the exam's scenarios are descriptions of code you've written.
:::
