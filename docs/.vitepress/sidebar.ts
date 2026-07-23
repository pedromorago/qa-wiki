import type { DefaultTheme } from 'vitepress'

// Curated sidebar for the public wiki.
// To add a new article: create the .md file in its section
// (docs/<section>/) and add one entry here.
//
// The private overlay (docs/private/) is NOT listed here — its sidebar is
// generated automatically by scanning the directory (see private.ts).

export const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Start here',
    collapsed: false,
    items: [
      { text: 'QA learning path', link: '/learning-path' },
    ],
  },
  {
    text: 'QA Fundamentals',
    collapsed: false,
    items: [
      { text: 'What is QA?', link: '/fundamentals/what-is-qa' },
      { text: 'Types of testing', link: '/fundamentals/types-of-testing' },
      { text: 'The testing pyramid', link: '/fundamentals/the-testing-pyramid' },
      { text: 'Test case design', link: '/fundamentals/test-case-design' },
      { text: 'Bug reporting', link: '/fundamentals/bug-reporting' },
      { text: 'Exploratory testing', link: '/fundamentals/exploratory-testing' },
      { text: 'The evolving QA role', link: '/fundamentals/the-evolving-qa-role' },
    ],
  },
  {
    text: 'Strategy & Processes',
    collapsed: false,
    items: [
      { text: 'Agile testing strategy', link: '/strategy/agile-testing-strategy' },
      { text: 'Defining tests for a feature', link: '/strategy/defining-tests-for-a-feature' },
      { text: 'Testing layers: backend', link: '/strategy/backend-testing-layers' },
      { text: 'Testing layers: frontend', link: '/strategy/frontend-testing-layers' },
      { text: 'What E2E tests should cover', link: '/strategy/what-e2e-tests-should-cover' },
      { text: 'Microservices testing', link: '/strategy/microservices-testing' },
      { text: 'Shift-left and maturity', link: '/strategy/shift-left-and-maturity' },
      { text: 'Acceptance criteria & DoR', link: '/strategy/acceptance-criteria-and-dor' },
      { text: 'Bug root cause analysis', link: '/strategy/bug-root-cause-analysis' },
      { text: 'How to review a task', link: '/strategy/how-to-review-a-task' },
    ],
  },
  {
    text: 'API Testing',
    collapsed: false,
    items: [
      { text: 'HTTP fundamentals', link: '/api-testing/http-fundamentals' },
      { text: 'What to test in an API', link: '/api-testing/what-to-test-in-an-api' },
      { text: 'API framework architecture', link: '/api-testing/api-framework-architecture' },
      { text: 'Anatomy of an API test', link: '/api-testing/anatomy-of-an-api-test' },
      { text: 'JSON Schema validation', link: '/api-testing/json-schema-validation' },
      { text: 'Test data and authentication', link: '/api-testing/test-data-and-authentication' },
      { text: 'Async APIs with Awaitility', link: '/api-testing/async-apis-with-awaitility' },
      { text: 'REST Client (VS Code)', link: '/api-testing/rest-client-vscode' },
      { text: 'Karate: API testing with BDD', link: '/api-testing/karate-api-testing' },
      { text: 'Postman and SoapUI', link: '/api-testing/postman-and-soapui' },
      { text: 'SQL for QA', link: '/api-testing/sql-for-qa' },
      { text: 'NoSQL for QA', link: '/api-testing/nosql-for-qa' },
    ],
  },
  {
    text: 'Automation',
    collapsed: false,
    items: [
      { text: 'When to automate', link: '/automation/when-to-automate' },
      { text: 'The E2E tools landscape', link: '/automation/e2e-tools-landscape' },
      { text: 'Cypress: first steps', link: '/automation/cypress-first-steps' },
      { text: 'Cypress: patterns that work', link: '/automation/cypress-patterns' },
      { text: 'Playwright: first steps', link: '/automation/playwright-first-steps' },
      { text: 'Page Object Model', link: '/automation/page-object-model' },
      { text: 'Configuring and organizing the suite', link: '/automation/configuring-and-organizing-playwright' },
      { text: 'TypeScript for QA', link: '/automation/typescript-for-qa' },
      { text: 'Python for QA', link: '/automation/python-for-qa' },
      { text: 'BDD with Cucumber', link: '/automation/bdd-with-cucumber' },
      { text: 'Migrating from TestCafe to Playwright', link: '/automation/migrating-from-testcafe-to-playwright' },
      { text: 'AI in test automation', link: '/automation/ai-in-test-automation' },
    ],
  },
  {
    text: 'CI/CD & Code Quality',
    collapsed: false,
    items: [
      { text: 'Git basics for QA', link: '/cicd/git-for-qa' },
      { text: 'Environment validations', link: '/cicd/environment-validations' },
      { text: 'Jenkins and GitLab CI', link: '/cicd/jenkins-and-gitlab-ci' },
      { text: 'Static analysis', link: '/cicd/static-analysis' },
      { text: 'Parallelization and sharding', link: '/cicd/parallelization-and-sharding' },
      { text: 'Docker for QA', link: '/cicd/docker-for-qa' },
      { text: 'AWS for QA', link: '/cicd/aws-for-qa' },
    ],
  },
  {
    text: 'Performance',
    collapsed: false,
    items: [
      { text: 'Performance fundamentals', link: '/performance/performance-fundamentals' },
      { text: 'JMeter in practice', link: '/performance/jmeter-in-practice' },
    ],
  },
  {
    text: 'Telecom',
    collapsed: false,
    items: [
      { text: 'OSS/BSS for QA', link: '/telecom/oss-bss-for-qa' },
    ],
  },
  {
    text: 'ISTQB Certification',
    collapsed: false,
    items: [
      { text: 'The CTFL v4.0 exam', link: '/istqb/exam-format' },
      { text: 'Study plan', link: '/istqb/study-plan' },
    ],
  },
  {
    text: 'Reference',
    collapsed: false,
    items: [
      { text: 'Glossary', link: '/glossary' },
      { text: 'Entry template', link: '/template' },
      { text: 'How this wiki works', link: '/how-this-wiki-works' },
      { text: 'About me', link: '/about' },
    ],
  },
]
