# Advanced Test Automation Engineering (CTAL-TAE v2.0): exam and syllabus map

My map of the **Certified Tester Advanced Level Test Automation Engineering v2.0** (released May 2024): how the exam is built, what each chapter asks of you, and which articles on this wiki prepare the ground. As with the [CTFL section](/istqb/), the syllabus and sample exams are ISTQB copyrighted material: this page **doesn't reproduce them**. It organizes and explains them in my own words. Study from the original.

## The exam in numbers

| Fact | Value |
|---|---|
| Questions | 40, multiple choice (a few ask you to "select TWO") |
| Points | **66** in total; questions are weighted by K-level |
| Pass mark | **43 points** (65%) |
| Duration | 90 minutes (113 with the 25% extension for non-native speakers) |
| Prerequisite | The CTFL certificate (any version); practical experience recommended |
| K-levels | K2 (understand), K3 (apply), K4 (analyze); keywords are examinable too |

In the official sample exam, **K2 questions are worth 1 point, K3 2 points and K4 3 points**, and the paper has 20 K2, 14 K3 and 6 K4 questions (20 + 28 + 18 = 66). **Almost 70% of the points come from applying and analyzing**: the exam gives you a framework, a pipeline or a pile of test logs and asks what you'd do.

**Time budget**: 90 minutes for 40 questions is 2 min 15 s on average. My plan: about 1 minute per K2, 2.5 per K3 and 4 per K4 (20 + 35 + 24 = 79 minutes), which leaves around 10 minutes to review flagged questions.

## The syllabus in 29 learning objectives

Eight chapters, 29 learning objectives (15 K2, 9 K3, 5 K4) and twelve business outcomes. Around 20 hours of minimum training time.

| Chapter | Minimum training time | Learning objectives | Weight in the official sample exam | Read first on this wiki |
|---|---|---|---|---|
| 1. Introduction and objectives for test automation | 45 min | 3 (all K2) | 3 questions · 3 points | [When to automate](/automation/when-to-automate), [The testing pyramid](/fundamentals/the-testing-pyramid), [E2E tools landscape](/automation/e2e-tools-landscape) |
| 2. Preparing for test automation | 180 min | 4 (2 K2, 2 K4) | 5 questions · 9 points | [Test environments strategy](/strategy/test-environments-strategy), [Environment validations](/cicd/environment-validations), [Mocks](/strategy/mocks-in-integration-testing) |
| 3. Test automation architecture | 210 min | 5 (2 K2, 3 K3) | 6 questions · 10 points | [API framework architecture](/api-testing/api-framework-architecture), [Page Object Model](/automation/page-object-model), [BDD with Cucumber](/automation/bdd-with-cucumber), [Karate](/api-testing/karate-api-testing) |
| 4. Implementing test automation | 150 min | 3 (K2, K3, K4) | 4 questions · 7 points | [Migrating from TestCafe to Playwright](/automation/migrating-from-testcafe-to-playwright) (a real pilot), [Configuring and organizing the suite](/automation/configuring-and-organizing-playwright) |
| 5. Implementation and deployment strategies | 90 min | 3 (2 K2, 1 K3) | 6 questions · 8 points | [Jenkins and GitLab CI](/cicd/jenkins-and-gitlab-ci), [Git for QA](/cicd/git-for-qa), [Microservices testing](/strategy/microservices-testing) (contract testing) |
| 6. Test automation reporting and metrics | 150 min | 3 (K2, K3, K4) | 4 questions · 8 points | [Investigating hard failures](/strategy/investigating-hard-failures), [Bug reporting](/fundamentals/bug-reporting), [AWS for QA](/cicd/aws-for-qa) (logs) |
| 7. Verifying the test automation solution | 135 min | 4 (3 K2, 1 K3) | 6 questions · 8 points | [Static analysis](/cicd/static-analysis), [Bug root cause analysis](/strategy/bug-root-cause-analysis) (flaky triage) |
| 8. Continuous improvement | 210 min | 4 (1 K2, 2 K3, 1 K4) | 6 questions · **13 points** | [Parallelization and sharding](/cicd/parallelization-and-sharding), [Async APIs with Awaitility](/api-testing/async-apis-with-awaitility), [JSON Schema validation](/api-testing/json-schema-validation), [AI in test automation](/automation/ai-in-test-automation) |

The per-chapter weights are **my own count of the official sample exam**, not an official distribution. Two things stand out: **chapter 8 is the heaviest in points** despite being the last one people study, and chapters 2, 4, 6 and 8 each carry a K4.

## Chapter by chapter

### 1. Introduction and objectives for test automation

- **What test automation is**: tools to set up and control tests, execute them, and compare actual with expected results.
- **Advantages and disadvantages**, and the **limitations** worth memorizing: not every manual test can be automated; automation only checks what it was programmed to check, only machine-interpretable results, and only what an automated oracle can verify.
- **Automation across lifecycles**: in sequential models it's built alongside or after implementation; in the V-model a framework per test level is possible; in agile it's in-sprint, as part of the team's work.
- **Selecting tools** for a given system under test (SUT): start from the SUT and the project requirements, weigh costs (commercial vs open source or custom) and the team's skills (low-code for non-programmers; a language that matches the SUT for technical testers).

### 2. Preparing for test automation

- **Design for testability**: *observability*, *controllability* and *architecture transparency*. Testability is a non-functional requirement the architect owns, with the automation engineer's input. Concretely: accessibility identifiers for locators, and configuration through environment and deployment variables.
- **Automation in each environment**: local development, build (CI agents: low-level tests and static analysis), integration (black-box, and the first place where monitoring should be present), pre-production (non-functional tests, acceptance), and production (canary, blue/green, A/B).
- **Analyzing a SUT to choose the automation solution** (K4): which test activities, levels and types to automate, the roles and skills involved, which products and SUTs it must support, test data availability, and **how to emulate the parts you can't reach** (third-party systems: see [mocks](/strategy/mocks-in-integration-testing)).
- **Presenting a tool evaluation** (K4): a comparison table (tools in columns, requirements in rows) covering language and IDE, configurability, test data, test types, reporting, integrations (CI/CD, defect and test management) and qualities like scalability and maintainability, demonstrated to stakeholders.

### 3. Test automation architecture

The central vocabulary:

| Term | What it is |
|---|---|
| **TAS** (test automation solution) | The whole thing: tools, framework, testware and the adaptors to your SUT |
| **TAA** (test automation architecture) | The technical design of the TAS: tools and libraries, components, connectivity (URLs, databases, queues, mocks), links to test and defect management, version control |
| **TAF** (test automation framework) | The foundation of the TAS: the test harness (runner), test libraries, test scripts and suites |
| **gTAA** (generic test automation architecture) | A high-level reference: interfaces to the SUT and to project, test and configuration management, and the *capabilities* a toolset provides (test generation, definition, execution, adaptation) |

- **Layering the framework** (K3): keep the number of layers low. Three are enough: **test scripts** (the test cases; they call the business logic, never the core libraries directly), **business logic** (SUT-specific libraries: page objects, API clients, user flows) and **core libraries** (SUT-independent code, reusable across projects that share the stack). The REST Assured framework in [API framework architecture](/api-testing/api-framework-architecture) follows the same shape.
- **Approaches** (K3), each with its pros and cons: capture/playback, linear scripting, structured scripting, TDD, **data-driven** (built on structured scripting), **keyword-driven** (usually built on data-driven) and **BDD**. Know which one fits a scenario: who writes the tests, how often the SUT changes, how much the initial investment is.
- **Design principles and patterns** (K3): the four OOP principles, SOLID, and three patterns singled out for automation: **facade** (expose only what test writers need), **singleton** (one driver talking to the SUT) and **page object**, plus the **flow model**, which puts a second facade of user actions on top of the page objects so steps are reused across scripts.

### 4. Implementing test automation

- **Running a pilot** (K3): decide the language, tools, test levels, test cases and development approach; build several prototypes; set a timeline with periodic checkpoints; **integrate into CI/CD during the pilot**, not after; and evaluate non-technical aspects (skills, team structure, licensing, organizational rules). The pilot ends with an explicit success/failure decision.
- **Deployment risks and mitigations** (K4): what the pilot reveals (firewall openings, CPU/RAM, network, device reliability) and the technical risks (packaging and versioning, logging with sensible levels from *fatal* to *trace*, test structure with fixtures and repeatable, atomic tests, and updates to harnesses, agents and devices).
- **Maintainability** (K2): clean code (naming, structure, no hardcoding, short methods, few parameters), logging, design patterns, static analyzers and formatters, and an agreed branching strategy.

### 5. Implementation and deployment strategies

- **Test levels in pipelines** (K3): configuration tests of the framework itself and component tests during the build (quality gates of CI), component integration tests in CI, system integration tests in continuous delivery, and system tests as the last gate of continuous deployment. For the higher levels there are two options: run them **inside the deployment** (they can fail and roll it back, but a rerun needs a redeploy) or in a **separate pipeline** triggered by the deployment (more flexible, but not a quality gate, so rollback is manual). Plus nightly regressions and periodic non-functional runs. See [environment validations](/cicd/environment-validations) for a real matrix.
- **Configuration management of testware** (K2): environment configuration, test data and suites are versioned too. To match testware to SUT releases, either use **feature toggles** per release or environment, or **release the testware with the SUT** under the same version (tags or branches).
- **API dependencies** (K2): API connections and documentation as the baseline, and **contract testing** (consumer-driven or provider-driven), which goes beyond schema validation because both parties agree on the allowed interactions.

### 6. Test automation reporting and metrics

- **Collecting data** (K3) from the SUT (UI, API, application, web and database server logs), the framework's own logs, build and deployment logs, production monitoring, and screenshots and recordings. Enhance the framework once (start and end times, steps, random choices, replayable logs, stack traces) and every test benefits.
- **Analyzing results** (K4): the framework's data is primary, the SUT's secondary. A failure analysis in five steps: *is it a known failure?* → identify the test case → find the failing step → check the SUT's state in the logs → if the SUT is wrong, log a defect with the evidence. If actual and expected results match and the test still failed, suspect the framework. If everything fails at once, suspect the environment. **Correlation IDs** let you follow a request through the system.
- **Test progress reports** (K2): results, SUT information and environment, shaped for each stakeholder and **published** where people actually look (web, test management tool, mailing list, chatbot), with history for trend analysis.

### 7. Verifying the test automation solution

- **Verifying the environment** (K3): tool installation and configuration (ideally automated from a repository), repeatable setup and teardown, connectivity with internal and external systems, and testing the framework's own components.
- **Verifying suites** (K2): composition (every test has expected results and data; the right framework and SUT versions), new tests that use new framework features, **repeatability** (move unreliable tests out of the active suite and investigate them apart), and **intrusiveness** (a tool coupled to the SUT can make it behave differently than in production).
- **Unexpected results** (K2): root cause analysis across test case, SUT, framework, hardware and network; isolated runs; resource monitoring. **Missing assertions give inconclusive results.**
- **Static analysis of test code** (K2): test code is code, and a plaintext password in a script is a security finding. Scan it in the pipeline like production code.

### 8. Continuous improvement

- **Improving test cases through data** (K3): a **test histogram** to spot fragile tests, AI-based self-healing locators, and **schema validation** to replace dozens of individual assertions on API responses.
- **Recommending improvements to a deployed TAS** (K4): upgrading the scripting approach, consolidating duplicated steps into libraries, a failure recovery process, **wait mechanisms** (hardcoded waits < polling with a timeout < subscribing to SUT events with a timeout), parallel and split execution, standard verification methods, architecture changes for testability, and upgrading core libraries through a pilot and an adoption plan.
- **Restructuring testware when the SUT changes** (K3): incremental changes first, then full regression; make core libraries more efficient; consolidate functions acting on the same kind of control; refactor instead of bolting on features; revise or remove scripts that no longer earn their keep.
- **Other uses of automation tools** (K2): environment setup, data aging, generating screenshots and videos.

## What changed from 2016

If a course, book or question bank predates mid-2024, it's about the old syllabus. The rewrite moved the **strategic** content to the new CT-TAS module and made TAE about engineering:

- **Gone** (or moved to CT-TAS): the in-depth four-layer gTAA, transitioning manual testing to automation, the catalog of automation metrics, the test automation manager role, process-driven scripting.
- **New**: automation across lifecycles and DevOps environments (including testing in production), CI/CD pipelines, configuration management of testware, contract testing, the three-layer framework, OOP and SOLID, the facade, singleton, page object and flow model patterns, TDD and BDD, clean code and logging levels, static analysis of test code, AI-assisted log analysis and self-healing, schema validation and test histograms.

## Official documents

All free on the [ISTQB TAE page](https://istqb.org/certifications/certified-tester-advanced-level-test-automation-engineering-ctal-tae-v2-0/):

- **Syllabus v2.0**: THE source; every question derives from it.
- **Sample exam (set A)**, questions and answers with justifications, in its latest version (it has been corrected several times since 2024).
- **Exam Structure Tables**: the official rules for points and distribution.
- The **[ISTQB glossary](https://glossary.istqb.org/)** for the keywords, which are examinable on their own.

::: tip Key idea
The TAE exam rewards thinking like the owner of an automation solution: how it's layered, how it runs in the pipeline, how you read its failures and how you improve it. If you've built and maintained a real suite, most scenarios will feel familiar; the work is learning the syllabus's names for what you already do.
:::
