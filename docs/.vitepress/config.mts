import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineConfig({
  lang: 'en-US',
  title: 'QA Wiki',
  description: 'Personal QA knowledge base by Pedro Morago — testing strategy, API testing, Playwright, CI/CD and quality processes.',
  base: '/formacion/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/formacion/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:title', content: 'QA Wiki — Quality Assurance knowledge base' }],
    ['meta', { property: 'og:description', content: 'Testing strategy, API testing, Playwright, CI/CD and quality processes — a QA engineer\'s living knowledge base.' }],
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
      { text: 'Home', link: '/' },
      { text: 'Fundamentals', link: '/fundamentals/' },
      { text: 'Strategy', link: '/strategy/' },
      { text: 'API Testing', link: '/api-testing/' },
      { text: 'Automation', link: '/automation/' },
      { text: 'CI/CD', link: '/cicd/' },
      { text: 'Glossary', link: '/glossary' },
      { text: 'About', link: '/about' },
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pedro-morago/formacion' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/pedro-morago-lópez-vazquez' },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/pedro-morago/formacion/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    externalLinkIcon: true,

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
})
