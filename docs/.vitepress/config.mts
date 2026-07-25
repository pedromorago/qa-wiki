import { join } from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'
import { defineConfig } from 'vitepress'
import { sectionNav, sidebar } from './sidebar'
import { wikiCmsConfig } from './cms'

// Public wiki at wiki.pedromorago.com (GitHub Pages). Content is edited
// through the Sveltia CMS at /admin/ (docs/public/admin/), whose config is
// generated at build time from sidebar.json — see cms.ts.
export default defineConfig({
  title: 'QA Wiki',
  base: '/',
  lang: 'en-US',
  description:
    'Personal QA knowledge base by Pedro Morago — testing strategy, API testing, Playwright, CI/CD and quality processes.',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'QA Wiki — Quality Assurance knowledge base' }],
    ['meta', { property: 'og:description', content: 'Testing strategy, API testing, Playwright, CI/CD and quality processes — a QA engineer\'s living knowledge base.' }],
    ['meta', { property: 'og:site_name', content: 'QA Wiki' }],
    ['meta', { property: 'og:url', content: 'https://wiki.pedromorago.com/' }],
  ],

  sitemap: {
    hostname: 'https://wiki.pedromorago.com/',
  },

  markdown: {
    image: { lazyLoading: true },
  },

  // The CMS config is generated from sidebar.json, so a section created in
  // the CMS's Navigation editor becomes an editable collection on the next
  // rebuild. JSON output — valid YAML for Sveltia.
  buildEnd({ outDir }) {
    const admin = join(outDir, 'admin')
    mkdirSync(admin, { recursive: true })
    writeFileSync(join(admin, 'config.yml'), JSON.stringify(wikiCmsConfig(), null, 2))
  },

  themeConfig: {
    logo: '/logo.svg',

    // Section entries come from sidebar.json (nav + dir per section) so the
    // CMS can create and reorder them; Home/Glossary/About are not sections.
    nav: [
      { text: 'Home', link: '/' },
      ...sectionNav,
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
