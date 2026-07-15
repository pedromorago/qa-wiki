import type { DefaultTheme } from 'vitepress'

// Sidebar of the wiki. To add a new article: create the .md file in its
// section folder and add one { text, link } entry to the matching group.
export const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'QA Fundamentals',
    collapsed: false,
    items: [
      { text: 'What is QA?', link: '/fundamentals/what-is-qa' },
      { text: 'Types of testing', link: '/fundamentals/types-of-testing' },
      { text: 'The testing pyramid', link: '/fundamentals/the-testing-pyramid' },
      { text: 'Test case design', link: '/fundamentals/test-case-design' },
      { text: 'Bug reporting', link: '/fundamentals/bug-reporting' },
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
    ],
  },
  {
    text: 'Automation',
    collapsed: false,
    items: [
      { text: 'When to automate', link: '/automation/when-to-automate' },
      { text: 'Playwright: first steps', link: '/automation/playwright-first-steps' },
      { text: 'Page Object Model', link: '/automation/page-object-model' },
      { text: 'Configuring and organizing the suite', link: '/automation/configuring-and-organizing-playwright' },
      { text: 'TypeScript for QA', link: '/automation/typescript-for-qa' },
      { text: 'Migrating from TestCafe to Playwright', link: '/automation/migrating-from-testcafe-to-playwright' },
      { text: 'AI in test automation', link: '/automation/ai-in-test-automation' },
    ],
  },
  {
    text: 'CI/CD & Code Quality',
    collapsed: false,
    items: [
      { text: 'Environment validations', link: '/cicd/environment-validations' },
      { text: 'Static analysis', link: '/cicd/static-analysis' },
      { text: 'Parallelization and sharding', link: '/cicd/parallelization-and-sharding' },
    ],
  },
  {
    text: 'Reference',
    collapsed: false,
    items: [
      { text: 'Glossary', link: '/glossary' },
      { text: 'Entry template', link: '/template' },
      { text: 'About me', link: '/about' },
    ],
  },
]
