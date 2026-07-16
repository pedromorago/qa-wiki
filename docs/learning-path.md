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
8. [REST Client (VS Code)](/api-testing/rest-client-vscode)
9. [SQL for QA](/api-testing/sql-for-qa) — validating in the database what the API claims.
10. Contract testing (Pact) <Badge type="warning" text="planned" />

## Stage 5 — E2E automation

Judgment first, tooling second.

1. [When to automate](/automation/when-to-automate) — and when not to.
2. [Playwright: first steps](/automation/playwright-first-steps)
3. [Page Object Model](/automation/page-object-model)
4. [Configuring and organizing the suite](/automation/configuring-and-organizing-playwright)
5. [TypeScript for QA](/automation/typescript-for-qa)
6. [Migrating from TestCafe to Playwright](/automation/migrating-from-testcafe-to-playwright) — a real case, with numbers.
7. [AI in test automation](/automation/ai-in-test-automation)
8. Visual testing <Badge type="warning" text="planned" />
9. Mobile testing <Badge type="warning" text="planned" />

## Stage 6 — The pipeline

Testing lives in CI/CD or it doesn't scale.

1. [Environment validations](/cicd/environment-validations)
2. [Static analysis](/cicd/static-analysis)
3. [Parallelization and sharding](/cicd/parallelization-and-sharding)
4. Docker for QA <Badge type="warning" text="planned" />
5. Observability and logs for QA <Badge type="warning" text="planned" />

## Stage 7 — Advanced strategy

Designing the quality of a whole system, not of a single feature.

1. [Testing layers: backend](/strategy/backend-testing-layers)
2. [Testing layers: frontend](/strategy/frontend-testing-layers)
3. [What E2E tests should cover](/strategy/what-e2e-tests-should-cover)
4. [Microservices testing](/strategy/microservices-testing)
5. [Shift-left and maturity](/strategy/shift-left-and-maturity)
6. [Bug root cause analysis](/strategy/bug-root-cause-analysis)
7. Performance testing with k6 <Badge type="warning" text="planned" />
8. Security for QA: OWASP Top 10 <Badge type="warning" text="planned" />
9. Accessibility testing <Badge type="warning" text="planned" />

::: tip How to use this path
Starting from zero: complete stages 1 and 2 before anything else, and find a real project (your own or a practice one) to apply each stage to as soon as possible. Already working as a QA: use it to spot your gaps — we all have them.
:::
