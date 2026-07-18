# Ruta de aprendizaje QA

El camino que yo seguiría hoy para formarme como QA Engineer, en orden. Los enlaces llevan a artículos de esta wiki; lo marcado como <Badge type="warning" text="pendiente" /> son temas que forman parte del camino pero que aún no he escrito — son también el backlog de esta wiki.

No es una escalera estricta: las etapas se solapan, y lo normal es trabajar con una mientras estudias la siguiente. Pero el orden importa — automatizar sin saber diseñar casos de prueba es automatizar mal.

## Etapa 1 — La base

El vocabulario y los conceptos sobre los que se construye todo lo demás.

1. [¿Qué es QA?](/es/fundamentals/what-is-qa) — QA vs QC vs testing, y los 7 principios.
2. [Tipos de testing](/es/fundamentals/types-of-testing)
3. [La pirámide de testing](/es/fundamentals/the-testing-pyramid)
4. [Diseño de casos de prueba](/es/fundamentals/test-case-design) — la habilidad central del oficio.
5. [Reporte de bugs](/es/fundamentals/bug-reporting) — un bug mal reportado es un bug que no se arregla.
6. [Testing exploratorio](/es/fundamentals/exploratory-testing) — la técnica que encuentra lo que los scripts no anticipan.

## Etapa 2 — El oficio en un equipo real

Cómo se trabaja la calidad dentro de un equipo ágil, más allá de ejecutar pruebas.

1. [Estrategia de testing ágil](/es/strategy/agile-testing-strategy)
2. [Criterios de aceptación y DoR](/es/strategy/acceptance-criteria-and-dor)
3. [Cómo revisar una tarea](/es/strategy/how-to-review-a-task)
4. [Definir las pruebas de una feature](/es/strategy/defining-tests-for-a-feature)
5. [La evolución del rol de QA](/es/fundamentals/the-evolving-qa-role)
6. [Git básico para QA](/es/cicd/git-for-qa) — el flujo diario y Git como herramienta de investigación (diff, blame, bisect).

## Etapa 3 — Certificación (opcional, recomendable)

El [CTFL de ISTQB](/es/istqb/) no te hace mejor tester, pero ordena el vocabulario, rellena huecos y abre filtros de RRHH. Este es el mejor momento del camino: con las etapas 1 y 2 hechas, gran parte del syllabus ya te suena.

1. [El examen CTFL v4.0](/es/istqb/exam-format)
2. [Plan de estudio](/es/istqb/study-plan)

## Etapa 4 — La web por dentro: APIs

Antes de automatizar interfaces hay que entender lo que viaja por debajo.

1. [Fundamentos de HTTP](/es/api-testing/http-fundamentals)
2. [Qué probar en una API](/es/api-testing/what-to-test-in-an-api)
3. [Anatomía de un test de API](/es/api-testing/anatomy-of-an-api-test)
4. [Validación de JSON Schema](/es/api-testing/json-schema-validation)
5. [Datos de prueba y autenticación](/es/api-testing/test-data-and-authentication)
6. [APIs asíncronas: Awaitility](/es/api-testing/async-apis-with-awaitility)
7. [Arquitectura de un framework de API testing](/es/api-testing/api-framework-architecture)
8. [Karate: API testing con BDD](/es/api-testing/karate-api-testing) — la vía rápida y legible.
9. [REST Client (VS Code)](/es/api-testing/rest-client-vscode)
10. [Postman y SoapUI](/es/api-testing/postman-and-soapui) — probar APIs sin framework, incluido SOAP con su WSDL.
11. [SQL para QA](/es/api-testing/sql-for-qa) — validar en base de datos lo que la API afirma.
12. [NoSQL para QA](/es/api-testing/nosql-for-qa) — validar cuando no hay esquema que te defienda.
13. Contract testing (Pact) <Badge type="warning" text="pendiente" />

## Etapa 5 — Automatización E2E

Con criterio primero, herramienta después.

1. [Cuándo automatizar](/es/automation/when-to-automate) — y cuándo no.
2. [El panorama de herramientas E2E](/es/automation/e2e-tools-landscape) — Selenium, WebDriverIO, Cypress, Playwright: elige con criterio.
3. [Cypress: primeros pasos](/es/automation/cypress-first-steps) — el modelo mental: encadenamiento y reintento automático.
4. [Cypress: patrones que funcionan](/es/automation/cypress-patterns) — cy.session, cy.intercept y estado por API.
5. [Playwright: primeros pasos](/es/automation/playwright-first-steps)
6. [Page Object Model](/es/automation/page-object-model)
7. [Configurar y organizar la suite](/es/automation/configuring-and-organizing-playwright)
8. [TypeScript para QA](/es/automation/typescript-for-qa)
9. [Python para QA](/es/automation/python-for-qa) — el lenguaje comodín: pytest y requests.
10. [BDD con Cucumber](/es/automation/bdd-with-cucumber) — cuándo aporta y cuándo es teatro.
11. [Migrar de TestCafe a Playwright](/es/automation/migrating-from-testcafe-to-playwright) — un caso real, con números.
12. [IA en automatización](/es/automation/ai-in-test-automation)
13. Testing visual <Badge type="warning" text="pendiente" />
14. Mobile testing <Badge type="warning" text="pendiente" />

## Etapa 6 — La pipeline

El testing vive en CI/CD o no escala.

1. [Validaciones por entorno](/es/cicd/environment-validations)
2. [Jenkins y GitLab CI](/es/cicd/jenkins-and-gitlab-ci) — los conceptos viajan entre herramientas.
3. [Análisis estático](/es/cicd/static-analysis)
4. [Paralelización y sharding](/es/cicd/parallelization-and-sharding)
5. [Docker para QA](/es/cicd/docker-for-qa) — la máquina de fabricar entornos reproducibles.
6. [AWS para QA](/es/cicd/aws-for-qa) — logs, datos y artefactos en la nube, sin depender de nadie.
7. Observabilidad y logs para QA <Badge type="warning" text="pendiente" />

## Etapa 7 — Estrategia avanzada

Diseñar la calidad de un sistema completo, no de una feature.

1. [Capas de testing: backend](/es/strategy/backend-testing-layers)
2. [Capas de testing: frontend](/es/strategy/frontend-testing-layers)
3. [Qué debe cubrir un E2E](/es/strategy/what-e2e-tests-should-cover)
4. [Testing de microservicios](/es/strategy/microservices-testing)
5. [Shift-left y madurez](/es/strategy/shift-left-and-maturity)
6. [Causa raíz de bugs](/es/strategy/bug-root-cause-analysis)
7. [Fundamentos del testing de rendimiento](/es/performance/performance-fundamentals) — tipos de prueba y las métricas que importan.
8. [JMeter en la práctica](/es/performance/jmeter-in-practice) — de la GUI de diseño a la CLI en la pipeline.
9. Seguridad para QA: OWASP Top 10 <Badge type="warning" text="pendiente" />
10. Testing de accesibilidad <Badge type="warning" text="pendiente" />

## Etapa 8 — Especialización de dominio

Cada sector tiene su mapa de sistemas y su vocabulario. En mi caso, telecom:

1. [OSS/BSS para QA](/es/telecom/oss-bss-for-qa) — los sistemas de una operadora, TM Forum y qué significa probar en cadenas de sistemas.

::: tip Cómo usar esta ruta
Si empiezas de cero: etapas 1 y 2 completas antes de nada, y busca cuanto antes un proyecto real (propio o de práctica) donde aplicar cada etapa. Si ya trabajas de QA: úsala para detectar huecos — todos los tenemos.
:::
