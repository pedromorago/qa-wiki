import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { allSections, sectionNav, sidebar } from './sidebar'
import { wikiCmsConfig } from './cms'
import { hasPrivateContent, privateNav, privateSidebar } from './private'

// Two builds from one source tree:
//   npm run build       → PUBLIC:  excludes docs/private/** (GitHub Pages at wiki.pedromorago.com)
//   npm run build:full  → FULL:    includes the private overlay (Cloudflare Pages + Access)
//   npm run dev         → FULL:    local dev server shows everything
// docs/private/ is a separate private repo, gitignored here — the public repo
// (and therefore the public CI) never contains it. See README.md.
// Both sites serve at a domain root since the custom domain, so one base.
const FULL = process.env.WIKI_PRIVATE === '1'
const BASE = '/'

export default defineConfig({
  title: 'QA Wiki',
  base: BASE,
  lang: 'en-US',
  description:
    'Personal QA knowledge base by Pedro Morago — testing strategy, API testing, Playwright, CI/CD and quality processes.',
  lastUpdated: true,
  cleanUrls: true,

  // In the public build the private overlay is excluded defensively; in CI it
  // does not even exist on disk. In the full build, only repo meta files and
  // the promotion queue (requests for the promote workflow, not content) are excluded.
  srcExclude: FULL ? ['private/README.md', 'private/promote/**'] : ['private/**'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'QA Wiki — Quality Assurance knowledge base' }],
    ['meta', { property: 'og:description', content: 'Testing strategy, API testing, Playwright, CI/CD and quality processes — a QA engineer\'s living knowledge base.' }],
    ['meta', { property: 'og:site_name', content: 'QA Wiki' }],
    ['meta', { property: 'og:url', content: 'https://wiki.pedromorago.com/' }],
  ],

  // Sitemap only makes sense for the public site; the private one sits behind
  // Cloudflare Access and must not advertise its routes anywhere.
  ...(FULL
    ? {}
    : {
        sitemap: {
          hostname: 'https://wiki.pedromorago.com/',
        },
      }),

  markdown: {
    image: { lazyLoading: true },
  },

  // The private overlay may ship extra static files (the /admin CMS, media)
  // that must exist ONLY on the authenticated site. They cannot live in
  // docs/public/ (shared by both builds), so the full build copies them into
  // the output here. In the public build this is a no-op twice over: the hook
  // is gated on FULL, and in public CI docs/private/ does not exist at all.
  buildEnd({ outDir }) {
    if (!FULL) return
    const privateStatic = fileURLToPath(new URL('../private/static', import.meta.url))
    if (existsSync(privateStatic)) cpSync(privateStatic, outDir, { recursive: true })
    // The wiki CMS config is generated from sidebar.json (see cms.ts), so a
    // section created in the Navigation editor becomes an editable collection
    // on the next rebuild. JSON output — valid YAML for Sveltia.
    const wikiAdmin = join(outDir, 'admin', 'wiki')
    mkdirSync(wikiAdmin, { recursive: true })
    writeFileSync(join(wikiAdmin, 'config.yml'), JSON.stringify(wikiCmsConfig(), null, 2))
    // The notes CMS "Publish to wiki" select gets the real section list, so
    // the promotion target is always in sync with sidebar.json.
    const notesConfig = join(outDir, 'admin', 'notes', 'config.yml')
    if (existsSync(notesConfig)) {
      const dirs = allSections.filter((s) => s.dir).map((s) => s.dir)
      writeFileSync(
        notesConfig,
        readFileSync(notesConfig, 'utf8').replaceAll('__WIKI_SECTIONS__', JSON.stringify(dirs)),
      )
    }
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
      ...(FULL && hasPrivateContent() ? privateNav() : []),
    ],

    // Multi-sidebar on the full build: pages under /private/ get a dedicated
    // sidebar with only the private sections; every other page gets the
    // public one (the 🔒 Private nav item is the way in).
    sidebar:
      FULL && hasPrivateContent()
        ? { '/private/': privateSidebar(), '/': sidebar }
        : sidebar,

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
