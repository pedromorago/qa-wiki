import { allSections, type SidebarSection } from './sidebar'

// Generator for the public wiki's Sveltia CMS configuration.
//
// The editable collections are derived from sidebar.json at full-build time,
// so creating a section in the CMS Navigation editor is enough: on the next
// rebuild the section gets its own collection here — no hand-maintained CMS
// config, no code change. The output is written by the buildEnd hook (see
// config.mts) to admin/wiki/config.yml on the authenticated site only, as
// JSON — which is valid YAML, so Sveltia parses it as-is.
//
// Wiki pages are plain Markdown with no frontmatter, hence `format: raw` with
// a single body field everywhere: the editor reads/writes files verbatim.

const BODY_ONLY = [{ name: 'body', label: 'Content', widget: 'markdown' }]

function sectionCollection(s: SidebarSection) {
  return {
    name: s.dir,
    label: s.text,
    folder: `docs/${s.dir}`,
    extension: 'md',
    format: 'raw',
    create: true,
    slug: '{{fields._slug}}',
    index_file: { name: 'index', label: 'Section index' },
    fields: BODY_ONLY,
  }
}

const standalonePage = (name: string, label: string, file: string) => ({ name, label, file, fields: BODY_ONLY })

export function wikiCmsConfig(): unknown {
  return {
    backend: { name: 'github', repo: 'pedro-morago/formacion', branch: 'main' },
    site_url: 'https://pedro-morago.github.io/formacion/',
    media_folder: 'docs/public/images',
    public_folder: '/images',
    slug: { encoding: 'ascii', clean_accents: true },
    collections: [
      // One collection per section that has a folder. Deliberately NOT
      // filtered on whether the folder exists yet: a just-created section
      // must show up here so its first pages can be created at all.
      ...allSections.filter((s) => s.dir).map(sectionCollection),
      {
        name: 'pages',
        label: 'Standalone pages',
        format: 'raw',
        files: [
          standalonePage('home', 'Home', 'docs/index.md'),
          standalonePage('learning-path', 'QA learning path', 'docs/learning-path.md'),
          standalonePage('glossary', 'Glossary', 'docs/glossary.md'),
          standalonePage('template', 'Entry template', 'docs/template.md'),
          standalonePage('how-this-wiki-works', 'How this wiki works', 'docs/how-this-wiki-works.md'),
          standalonePage('about', 'About me', 'docs/about.md'),
        ],
      },
      {
        name: 'navigation',
        label: 'Sections & sidebar',
        files: [
          {
            name: 'sidebar',
            label: 'Sections & sidebar',
            file: 'docs/.vitepress/sidebar.json',
            fields: [
              {
                name: 'sections',
                label: 'Sections',
                widget: 'list',
                fields: [
                  { name: 'text', label: 'Section title', widget: 'string' },
                  {
                    name: 'nav',
                    label: 'Top-menu label',
                    hint: 'Shown in the top menu once the section index page exists. Leave empty to keep the section out of the top menu.',
                    widget: 'string',
                    required: false,
                  },
                  {
                    name: 'dir',
                    label: 'Folder',
                    hint: 'kebab-case, e.g. mobile-testing. Gives the section its own folder and its own collection in this editor (appears after the next rebuild, ~2 min).',
                    widget: 'string',
                    required: false,
                  },
                  { name: 'collapsed', label: 'Collapsed by default', widget: 'boolean', default: false },
                  {
                    name: 'items',
                    label: 'Pages',
                    widget: 'list',
                    fields: [
                      { name: 'text', label: 'Page title', widget: 'string' },
                      { name: 'link', label: 'Link (e.g. /automation/when-to-automate)', widget: 'string' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}
