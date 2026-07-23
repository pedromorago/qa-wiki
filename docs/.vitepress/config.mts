import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { hasPrivateContent, privateNav, privateSidebar } from './private'

// Two builds from one source tree:
//   npm run build       → PUBLIC:  excludes docs/private/** (GitHub Pages, base /formacion/)
//   npm run build:full  → FULL:    includes the private overlay (Cloudflare Pages + Access, base /)
//   npm run dev         → FULL:    local dev server shows everything
// docs/private/ is a separate private repo, gitignored here — the public repo
// (and therefore the public CI) never contains it. See README.md.
const FULL = process.env.WIKI_PRIVATE === '1'
const BASE = FULL ? '/' : '/formacion/'

export default defineConfig({
  title: 'QA Wiki',
  base: BASE,
  lang: 'en-US',
  description:
    'Personal QA knowledge base by Pedro Morago — testing strategy, API testing, Playwright, CI/CD and quality processes.',
  lastUpdated: true,
  cleanUrls: true,

  // In the public build the private overlay is excluded defensively; in CI it
  // does not even exist on disk. In the full build, only repo meta files are excluded.
  srcExclude: FULL ? ['private/README.md'] : ['private/**'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'QA Wiki — Quality Assurance knowledge base' }],
    ['meta', { property: 'og:description', content: 'Testing strategy, API testing, Playwright, CI/CD and quality processes — a QA engineer\'s living knowledge base.' }],
    ['meta', { property: 'og:site_name', content: 'QA Wiki' }],
    ['meta', { property: 'og:url', content: 'https://pedro-morago.github.io/formacion/' }],
  ],

  // Sitemap only makes sense for the public site; the private one sits behind
  // Cloudflare Access and must not advertise its routes anywhere.
  ...(FULL
    ? {}
    : {
        sitemap: {
          hostname: 'https://pedro-morago.github.io/formacion/',
        },
      }),

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
      { text: 'Performance', link: '/performance/' },
      { text: 'Telecom', link: '/telecom/' },
      { text: 'ISTQB', link: '/istqb/' },
      { text: 'Glossary', link: '/glossary' },
      { text: 'About', link: '/about' },
      ...(FULL && hasPrivateContent() ? privateNav() : []),
    ],

    sidebar: [
      ...sidebar,
      ...(FULL && hasPrivateContent() ? privateSidebar() : []),
    ],

    // Public pages are edited in the public repo; private pages in the private
    // one. The branching function is used ONLY in the full build: VitePress
    // serializes function-valued themeConfig into every rendered page, so in
    // the public build it would leak the private repo name to every visitor.
    // The public build has no private pages, so a plain string is equivalent.
    editLink: {
      pattern: FULL
        ? ({ relativePath }) =>
            relativePath.startsWith('private/')
              ? `https://github.com/pedro-morago/formacion-private/edit/main/${relativePath.slice('private/'.length)}`
              : `https://github.com/pedro-morago/formacion/edit/main/docs/${relativePath}`
        : 'https://github.com/pedro-morago/formacion/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

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
