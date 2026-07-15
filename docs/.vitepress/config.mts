import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'es-ES',
  title: 'QA Wiki',
  description: 'Wiki personal de formación y conocimiento en QA — por Pedro Moraga',
  base: '/formacion/',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Fundamentos', link: '/fundamentos/' },
      { text: 'API Testing', link: '/api-testing/' },
      { text: 'Automatización', link: '/automatizacion/' },
      { text: 'Glosario', link: '/glosario' },
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
        ],
      },
      {
        text: 'API Testing',
        collapsed: false,
        items: [
          { text: 'Fundamentos de HTTP', link: '/api-testing/fundamentos-http' },
          { text: 'Qué probar en una API', link: '/api-testing/que-probar-en-una-api' },
        ],
      },
      {
        text: 'Automatización',
        collapsed: false,
        items: [
          { text: 'Cuándo automatizar', link: '/automatizacion/cuando-automatizar' },
        ],
      },
      {
        text: 'Referencia',
        collapsed: false,
        items: [
          { text: 'Glosario', link: '/glosario' },
          { text: 'Plantilla de entrada', link: '/plantilla' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pedro-morago/formacion' },
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

    outline: { label: 'En esta página' },
    lastUpdatedText: 'Última actualización',
    darkModeSwitchLabel: 'Apariencia',
    sidebarMenuLabel: 'Menú',
    returnToTopLabel: 'Volver arriba',
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
  },
})
