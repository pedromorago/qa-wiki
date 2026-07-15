import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'es-ES',
  title: 'QA Wiki',
  description: 'Wiki personal de formación y conocimiento en QA — por Pedro Morago',
  base: '/formacion/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/formacion/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'es_ES' }],
    ['meta', { property: 'og:title', content: 'QA Wiki — Formación y conocimiento en Quality Assurance' }],
    ['meta', { property: 'og:description', content: 'Base de conocimiento de QA: estrategia de testing, API testing, Playwright, CI/CD y procesos de calidad, en español.' }],
    ['meta', { property: 'og:site_name', content: 'QA Wiki' }],
    ['meta', { property: 'og:url', content: 'https://pedro-morago.github.io/formacion/' }],
  ],

  sitemap: {
    hostname: 'https://pedro-morago.github.io/formacion/',
  },

  markdown: {
    image: { lazyLoading: true },
  },

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Fundamentos', link: '/fundamentos/' },
      { text: 'Estrategia', link: '/estrategia/' },
      { text: 'API Testing', link: '/api-testing/' },
      { text: 'Automatización', link: '/automatizacion/' },
      { text: 'CI/CD', link: '/cicd/' },
      { text: 'Glosario', link: '/glosario' },
      { text: 'Sobre mí', link: '/sobre-mi' },
    ],

    sidebar: [
      {
        text: 'Fundamentos de QA',
        collapsed: false,
        items: [
          { text: '¿Qué es QA?', link: '/fundamentos/que-es-qa' },
          { text: 'Tipos de testing', link: '/fundamentos/tipos-de-testing' },
          { text: 'La pirámide de testing', link: '/fundamentos/piramide-de-testing' },
          { text: 'Diseño de casos de prueba', link: '/fundamentos/diseno-de-casos-de-prueba' },
          { text: 'Reporte de bugs', link: '/fundamentos/reporte-de-bugs' },
          { text: 'La evolución del rol de QA', link: '/fundamentos/evolucion-del-rol-de-qa' },
        ],
      },
      {
        text: 'Estrategia y procesos',
        collapsed: false,
        items: [
          { text: 'Estrategia de testing ágil', link: '/estrategia/testing-agil' },
          { text: 'Definir las pruebas de una feature', link: '/estrategia/definir-las-pruebas-de-una-feature' },
          { text: 'Capas de testing: backend', link: '/estrategia/capas-de-testing-backend' },
          { text: 'Capas de testing: frontend', link: '/estrategia/capas-de-testing-frontend' },
          { text: 'Qué debe cubrir un E2E', link: '/estrategia/que-debe-cubrir-un-e2e' },
          { text: 'Testing de microservicios', link: '/estrategia/testing-de-microservicios' },
          { text: 'Shift-left y madurez', link: '/estrategia/shift-left-y-madurez' },
          { text: 'Criterios de aceptación y DoR', link: '/estrategia/criterios-de-aceptacion-y-dor' },
          { text: 'Causa raíz de bugs', link: '/estrategia/causa-raiz-de-bugs' },
          { text: 'Cómo revisar una tarea', link: '/estrategia/revisar-una-tarea' },
        ],
      },
      {
        text: 'API Testing',
        collapsed: false,
        items: [
          { text: 'Fundamentos de HTTP', link: '/api-testing/fundamentos-http' },
          { text: 'Qué probar en una API', link: '/api-testing/que-probar-en-una-api' },
          { text: 'Arquitectura de un framework', link: '/api-testing/arquitectura-framework-api' },
          { text: 'Anatomía de un test de API', link: '/api-testing/anatomia-de-un-test-de-api' },
          { text: 'Validación de JSON Schema', link: '/api-testing/validacion-json-schema' },
          { text: 'Datos de prueba y autenticación', link: '/api-testing/datos-de-prueba-y-autenticacion' },
          { text: 'APIs asíncronas: Awaitility', link: '/api-testing/apis-asincronas-awaitility' },
          { text: 'REST Client (VS Code)', link: '/api-testing/rest-client-vscode' },
        ],
      },
      {
        text: 'Automatización',
        collapsed: false,
        items: [
          { text: 'Cuándo automatizar', link: '/automatizacion/cuando-automatizar' },
          { text: 'Playwright: primeros pasos', link: '/automatizacion/playwright-primeros-pasos' },
          { text: 'Page Object Model', link: '/automatizacion/page-object-model' },
          { text: 'Configurar y organizar la suite', link: '/automatizacion/configurar-y-organizar-playwright' },
          { text: 'TypeScript para QA', link: '/automatizacion/typescript-para-qa' },
          { text: 'Migrar de TestCafe a Playwright', link: '/automatizacion/migrar-de-testcafe-a-playwright' },
          { text: 'IA en automatización', link: '/automatizacion/ia-en-automatizacion' },
        ],
      },
      {
        text: 'CI/CD y calidad de código',
        collapsed: false,
        items: [
          { text: 'Validaciones por entorno', link: '/cicd/validaciones-por-entorno' },
          { text: 'Análisis estático', link: '/cicd/analisis-estatico' },
          { text: 'Paralelización y sharding', link: '/cicd/paralelizacion-y-sharding' },
        ],
      },
      {
        text: 'Referencia',
        collapsed: false,
        items: [
          { text: 'Glosario', link: '/glosario' },
          { text: 'Plantilla de entrada', link: '/plantilla' },
          { text: 'Sobre mí', link: '/sobre-mi' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pedro-morago/formacion' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/pedro-morago-lópez-vazquez' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
          modal: {
            noResultsText: 'Sin resultados para',
            resetButtonTitle: 'Limpiar búsqueda',
            footer: {
              selectText: 'para seleccionar',
              navigateText: 'para navegar',
              closeText: 'para cerrar',
            },
          },
        },
      },
    },

    editLink: {
      pattern: 'https://github.com/pedro-morago/formacion/edit/main/docs/:path',
      text: 'Editar esta página en GitHub',
    },

    externalLinkIcon: true,

    notFound: {
      title: 'PÁGINA NO ENCONTRADA',
      quote: 'Como buen QA sé que un 404 también hay que probarlo — pero este no debería estar aquí.',
      linkText: 'Volver al inicio',
      linkLabel: 'volver al inicio',
      code: '404',
    },

    outline: { label: 'En esta página' },
    lastUpdatedText: 'Última actualización',
    darkModeSwitchLabel: 'Apariencia',
    sidebarMenuLabel: 'Menú',
    returnToTopLabel: 'Volver arriba',
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
  },
})
