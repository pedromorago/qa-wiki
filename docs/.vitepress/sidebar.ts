import type { DefaultTheme } from 'vitepress'

// Sidebars for both locales. Page slugs are identical across locales
// (English slugs, Spanish under /es/) so the language switcher can jump
// between versions of the same page.
//
// To add a new article: create the .md file in BOTH trees
// (docs/<section>/ and docs/es/<section>/) and add one entry per sidebar.

export const sidebarEn: DefaultTheme.Sidebar = [
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
      { text: 'About me', link: '/about' },
    ],
  },
]

export const sidebarEs: DefaultTheme.Sidebar = [
  {
    text: 'Empieza aquí',
    collapsed: false,
    items: [
      { text: 'Ruta de aprendizaje QA', link: '/es/learning-path' },
    ],
  },
  {
    text: 'Fundamentos de QA',
    collapsed: false,
    items: [
      { text: '¿Qué es QA?', link: '/es/fundamentals/what-is-qa' },
      { text: 'Tipos de testing', link: '/es/fundamentals/types-of-testing' },
      { text: 'La pirámide de testing', link: '/es/fundamentals/the-testing-pyramid' },
      { text: 'Diseño de casos de prueba', link: '/es/fundamentals/test-case-design' },
      { text: 'Reporte de bugs', link: '/es/fundamentals/bug-reporting' },
      { text: 'Testing exploratorio', link: '/es/fundamentals/exploratory-testing' },
      { text: 'La evolución del rol de QA', link: '/es/fundamentals/the-evolving-qa-role' },
    ],
  },
  {
    text: 'Estrategia y procesos',
    collapsed: false,
    items: [
      { text: 'Estrategia de testing ágil', link: '/es/strategy/agile-testing-strategy' },
      { text: 'Definir las pruebas de una feature', link: '/es/strategy/defining-tests-for-a-feature' },
      { text: 'Capas de testing: backend', link: '/es/strategy/backend-testing-layers' },
      { text: 'Capas de testing: frontend', link: '/es/strategy/frontend-testing-layers' },
      { text: 'Qué debe cubrir un E2E', link: '/es/strategy/what-e2e-tests-should-cover' },
      { text: 'Testing de microservicios', link: '/es/strategy/microservices-testing' },
      { text: 'Shift-left y madurez', link: '/es/strategy/shift-left-and-maturity' },
      { text: 'Criterios de aceptación y DoR', link: '/es/strategy/acceptance-criteria-and-dor' },
      { text: 'Causa raíz de bugs', link: '/es/strategy/bug-root-cause-analysis' },
      { text: 'Cómo revisar una tarea', link: '/es/strategy/how-to-review-a-task' },
    ],
  },
  {
    text: 'API Testing',
    collapsed: false,
    items: [
      { text: 'Fundamentos de HTTP', link: '/es/api-testing/http-fundamentals' },
      { text: 'Qué probar en una API', link: '/es/api-testing/what-to-test-in-an-api' },
      { text: 'Arquitectura de un framework', link: '/es/api-testing/api-framework-architecture' },
      { text: 'Anatomía de un test de API', link: '/es/api-testing/anatomy-of-an-api-test' },
      { text: 'Validación de JSON Schema', link: '/es/api-testing/json-schema-validation' },
      { text: 'Datos de prueba y autenticación', link: '/es/api-testing/test-data-and-authentication' },
      { text: 'APIs asíncronas: Awaitility', link: '/es/api-testing/async-apis-with-awaitility' },
      { text: 'REST Client (VS Code)', link: '/es/api-testing/rest-client-vscode' },
      { text: 'Karate: API testing con BDD', link: '/es/api-testing/karate-api-testing' },
      { text: 'Postman y SoapUI', link: '/es/api-testing/postman-and-soapui' },
      { text: 'SQL para QA', link: '/es/api-testing/sql-for-qa' },
      { text: 'NoSQL para QA', link: '/es/api-testing/nosql-for-qa' },
    ],
  },
  {
    text: 'Automatización',
    collapsed: false,
    items: [
      { text: 'Cuándo automatizar', link: '/es/automation/when-to-automate' },
      { text: 'El panorama de herramientas E2E', link: '/es/automation/e2e-tools-landscape' },
      { text: 'Cypress: primeros pasos', link: '/es/automation/cypress-first-steps' },
      { text: 'Cypress: patrones que funcionan', link: '/es/automation/cypress-patterns' },
      { text: 'Playwright: primeros pasos', link: '/es/automation/playwright-first-steps' },
      { text: 'Page Object Model', link: '/es/automation/page-object-model' },
      { text: 'Configurar y organizar la suite', link: '/es/automation/configuring-and-organizing-playwright' },
      { text: 'TypeScript para QA', link: '/es/automation/typescript-for-qa' },
      { text: 'Python para QA', link: '/es/automation/python-for-qa' },
      { text: 'BDD con Cucumber', link: '/es/automation/bdd-with-cucumber' },
      { text: 'Migrar de TestCafe a Playwright', link: '/es/automation/migrating-from-testcafe-to-playwright' },
      { text: 'IA en automatización', link: '/es/automation/ai-in-test-automation' },
    ],
  },
  {
    text: 'CI/CD y calidad de código',
    collapsed: false,
    items: [
      { text: 'Git básico para QA', link: '/es/cicd/git-for-qa' },
      { text: 'Validaciones por entorno', link: '/es/cicd/environment-validations' },
      { text: 'Jenkins y GitLab CI', link: '/es/cicd/jenkins-and-gitlab-ci' },
      { text: 'Análisis estático', link: '/es/cicd/static-analysis' },
      { text: 'Paralelización y sharding', link: '/es/cicd/parallelization-and-sharding' },
      { text: 'Docker para QA', link: '/es/cicd/docker-for-qa' },
      { text: 'AWS para QA', link: '/es/cicd/aws-for-qa' },
    ],
  },
  {
    text: 'Rendimiento',
    collapsed: false,
    items: [
      { text: 'Fundamentos de rendimiento', link: '/es/performance/performance-fundamentals' },
      { text: 'JMeter en la práctica', link: '/es/performance/jmeter-in-practice' },
    ],
  },
  {
    text: 'Telecom',
    collapsed: false,
    items: [
      { text: 'OSS/BSS para QA', link: '/es/telecom/oss-bss-for-qa' },
    ],
  },
  {
    text: 'Certificación ISTQB',
    collapsed: false,
    items: [
      { text: 'El examen CTFL v4.0', link: '/es/istqb/exam-format' },
      { text: 'Plan de estudio', link: '/es/istqb/study-plan' },
    ],
  },
  {
    text: 'Referencia',
    collapsed: false,
    items: [
      { text: 'Glosario', link: '/es/glossary' },
      { text: 'Plantilla de entrada', link: '/es/template' },
      { text: 'Sobre mí', link: '/es/about' },
    ],
  },
]
