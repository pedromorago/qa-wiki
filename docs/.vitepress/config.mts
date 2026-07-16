import { defineConfig } from 'vitepress'
import { sidebarEn, sidebarEs } from './sidebar'

export default defineConfig({
  title: 'QA Wiki',
  base: '/formacion/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/formacion/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'QA Wiki — Quality Assurance knowledge base' }],
    ['meta', { property: 'og:description', content: 'Testing strategy, API testing, Playwright, CI/CD and quality processes — a QA engineer\'s living knowledge base. In English and Spanish.' }],
    ['meta', { property: 'og:site_name', content: 'QA Wiki' }],
    ['meta', { property: 'og:url', content: 'https://pedro-morago.github.io/formacion/' }],
  ],

  sitemap: {
    hostname: 'https://pedro-morago.github.io/formacion/',
  },

  markdown: {
    image: { lazyLoading: true },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      description: 'Personal QA knowledge base by Pedro Morago — testing strategy, API testing, Playwright, CI/CD and quality processes.',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Fundamentals', link: '/fundamentals/' },
          { text: 'Strategy', link: '/strategy/' },
          { text: 'API Testing', link: '/api-testing/' },
          { text: 'Automation', link: '/automation/' },
          { text: 'CI/CD', link: '/cicd/' },
          { text: 'Performance', link: '/performance/' },
          { text: 'Telecom', link: '/telecom/' },
          { text: 'ISTQB', link: '/istqb/' },
          { text: 'Glossary', link: '/glossary' },
          { text: 'About', link: '/about' },
        ],
        sidebar: sidebarEn,
        editLink: {
          pattern: 'https://github.com/pedro-morago/formacion/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        notFound: {
          title: 'PAGE NOT FOUND',
          quote: 'As a QA engineer I know a 404 needs testing too — but this one should not be here.',
          linkText: 'Back to home',
          linkLabel: 'back to home',
          code: '404',
        },
        outline: { label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
      },
    },
    es: {
      label: 'Español',
      lang: 'es-ES',
      link: '/es/',
      description: 'Base de conocimiento de QA de Pedro Morago — estrategia de testing, API testing, Playwright, CI/CD y procesos de calidad.',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Fundamentos', link: '/es/fundamentals/' },
          { text: 'Estrategia', link: '/es/strategy/' },
          { text: 'API Testing', link: '/es/api-testing/' },
          { text: 'Automatización', link: '/es/automation/' },
          { text: 'CI/CD', link: '/es/cicd/' },
          { text: 'Rendimiento', link: '/es/performance/' },
          { text: 'Telecom', link: '/es/telecom/' },
          { text: 'ISTQB', link: '/es/istqb/' },
          { text: 'Glosario', link: '/es/glossary' },
          { text: 'Sobre mí', link: '/es/about' },
        ],
        sidebar: sidebarEs,
        editLink: {
          pattern: 'https://github.com/pedro-morago/formacion/edit/main/docs/:path',
          text: 'Editar esta página en GitHub',
        },
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
        langMenuLabel: 'Cambiar idioma',
        docFooter: { prev: 'Anterior', next: 'Siguiente' },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pedro-morago/formacion' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/pedro-morago-lópez-vazquez' },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          es: {
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
      },
    },
  },
})
