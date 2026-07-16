# QA learning path

The path I would follow today to train as a QA Engineer, in order. Links go to articles on this wiki; items marked <Badge type="warning" text="planned" /> are part of the path but not written yet — they're also this wiki's backlog.

It's not a strict ladder: stages overlap, and it's normal to work with one while studying the next. But the order matters — automating without knowing how to design test cases is automating badly.

## Stage 1 — The base

The vocabulary and concepts everything else is built on.

1. [What is QA?](/fundamentals/what-is-qa) — QA vs QC vs testing, and the 7 principles.
2. [Types of testing](/fundamentals/types-of-testing)
3. [The testing pyramid](/fundamentals/the-testing-pyramid)
4. [Test case design](/fundamentals/test-case-design) — the core skill of the craft.
5. [Bug reporting](/fundamentals/bug-reporting) — a badly reported bug is a bug that doesn't get fixed.
6. [Exploratory testing](/fundamentals/exploratory-testing) — the technique that finds what scripts don't anticipate.

## Stage 2 — The craft in a real team

How quality is worked inside an agile team, beyond executing tests.

1. [Agile testing strategy](/strategy/agile-testing-strategy)
2. [Acceptance criteria & DoR](/strategy/acceptance-criteria-and-dor)
3. [How to review a task](/strategy/how-to-review-a-task)
4. [Defining tests for a feature](/strategy/defining-tests-for-a-feature)
5. [The evolving QA role](/fundamentals/the-evolving-qa-role)
6. [Git basics for QA](/cicd/git-for-qa) — the daily flow and Git as an investigation tool (diff, blame, bisect).

## Stage 3 — Certification (optional, recommended)

The [ISTQB CTFL](/istqb/) won't make you a better tester by itself, but it organizes your vocabulary, fills gaps and opens HR filters. This is the best moment in the path for it: with stages 1 and 2 done, much of the syllabus will already sound familiar.

1. [The CTFL v4.0 exam](/istqb/exam-format)
2. [Study plan](/istqb/study-plan)

## Stage 4 — The web from the inside: APIs

Before automating interfaces you need to understand what travels underneath.

1. [HTTP fundamentals](/api-testing/http-fundamentals)
2. [What to test in an API](/api-testing/what-to-test-in-an-api)
3. [Anatomy of an API test](/api-testing/anatomy-of-an-api-test)
4. [JSON Schema validation](/api-testing/json-schema-validation)
5. [Test data and authentication](/api-testing/test-data-and-authentication)
6. [Async APIs with Awaitility](/api-testing/async-apis-with-awaitility)
7. [API framework architecture](/api-testing/api-framework-architecture)
8. [Karate: API testing with BDD](/api-testing/karate-api-testing) — the fast, readable route.
9. [REST Client (VS Code)](/api-testing/rest-client-vscode)
10. [Postman and SoapUI](/api-testing/postman-and-soapui) — testing APIs without a framework, including SOAP and its WSDL.
11. [SQL for QA](/api-testing/sql-for-qa) — validating in the database what the API claims.
12. [NoSQL for QA](/api-testing/nosql-for-qa) — validating when no schema defends you.
13. Contract testing (Pact) <Badge type="warning" text="planned" />

## Stage 5 — E2E automation

Judgment first, tooling second.

1. [When to automate](/automation/when-to-automate) — and when not to.
2. [The E2E tools landscape](/automation/e2e-tools-landscape) — Selenium, WebDriverIO, Cypress, Playwright: choose with criteria.
3. [Playwright: first steps](/automation/playwright-first-steps)
4. [Page Object Model](/automation/page-object-model)
5. [Configuring and organizing the suite](/automation/configuring-and-organizing-playwright)
6. [TypeScript for QA](/automation/typescript-for-qa)
7. [Python for QA](/automation/python-for-qa) — the utility language: pytest and requests.
8. [BDD with Cucumber](/automation/bdd-with-cucumber) — when it pays off and when it's theater.
9. [Migrating from TestCafe to Playwright](/automation/migrating-from-testcafe-to-playwright) — a real case, with numbers.
10. [AI in test automation](/automation/ai-in-test-automation)
11. Visual testing <Badge type="warning" text="planned" />
12. Mobile testing <Badge type="warning" text="planned" />

## Stage 6 — The pipeline

Testing lives in CI/CD or it doesn't scale.

1. [Environment validations](/cicd/environment-validations)
2. [Jenkins and GitLab CI](/cicd/jenkins-and-gitlab-ci) — the concepts travel between tools.
3. [Static analysis](/cicd/static-analysis)
4. [Parallelization and sharding](/cicd/parallelization-and-sharding)
5. [Docker for QA](/cicd/docker-for-qa) — the factory of reproducible environments.
6. [AWS for QA](/cicd/aws-for-qa) — logs, data and artifacts in the cloud, without depending on anyone.
7. Observability and logs for QA <Badge type="warning" text="planned" />

## Stage 7 — Advanced strategy

Designing the quality of a whole system, not of a single feature.

1. [Testing layers: backend](/strategy/backend-testing-layers)
2. [Testing layers: frontend](/strategy/frontend-testing-layers)
3. [What E2E tests should cover](/strategy/what-e2e-tests-should-cover)
4. [Microservices testing](/strategy/microservices-testing)
5. [Shift-left and maturity](/strategy/shift-left-and-maturity)
6. [Bug root cause analysis](/strategy/bug-root-cause-analysis)
7. [Performance testing fundamentals](/performance/performance-fundamentals) — test types and the metrics that matter.
8. [JMeter in practice](/performance/jmeter-in-practice) — from the design GUI to the CLI in the pipeline.
9. Security for QA: OWASP Top 10 <Badge type="warning" text="planned" />
10. Accessibility testing <Badge type="warning" text="planned" />

## Stage 8 — Domain specialization

Every sector has its own map of systems and its own vocabulary. In my case, telecom:

1. [OSS/BSS for QA](/telecom/oss-bss-for-qa) — an operator's systems, TM Forum, and what testing chains of systems means.

::: tip How to use this path
Starting from zero: complete stages 1 and 2 before anything else, and find a real project (your own or a practice one) to apply each stage to as soon as possible. Already working as a QA: use it to spot your gaps — we all have them.
:::
