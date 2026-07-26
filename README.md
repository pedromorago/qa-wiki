# 📚 QA Wiki — Formación

[![Deploy](https://github.com/pedro-morago/qa-wiki/actions/workflows/deploy.yml/badge.svg)](https://github.com/pedro-morago/qa-wiki/actions/workflows/deploy.yml)
[![CI](https://github.com/pedro-morago/qa-wiki/actions/workflows/ci.yml/badge.svg)](https://github.com/pedro-morago/qa-wiki/actions/workflows/ci.yml)

My personal **Quality Assurance** knowledge wiki: everything I keep learning, written in my own words, organized and searchable. It serves as a reference while I work and as part of my portfolio.

**🌐 Web**: https://wiki.pedromorago.com/

Built with [VitePress](https://vitepress.dev): entries are Markdown files in `docs/`, every pull request goes through a validation build (CI, which also detects broken links), and every push to `main` deploys automatically to GitHub Pages in about a minute.

The full design write-up — requirements, decisions, the search architecture and the parts that got deliberately torn down — is published as a wiki page: [How this wiki works](https://wiki.pedromorago.com/how-this-wiki-works).

## Editing: web CMS at /admin/

The site serves a static, git-backed CMS ([Sveltia](https://github.com/sveltia/sveltia-cms)) at `/admin/`. "Save" is just a commit to this repo through the GitHub API, so it goes through the same pipeline as any push. The admin page is public but harmless: write access lives entirely in GitHub's permission model. Sign-in uses a small OAuth Worker on my own Cloudflare account (no third-party service).

Sections are data: each entry in `docs/.vitepress/sidebar.json` may declare a `nav` (top-menu label) and `dir` (folder under `docs/`). The top menu, the sidebar and the CMS's own collections are all derived from that one file (`sidebar.ts`, `cms.ts` — the CMS config is generated at build time), and links to pages that don't exist yet are simply hidden until they do — so a new section can be created and filled entirely from the CMS, in any order, without ever breaking a build.

## AI search & answers

`/search` offers semantic search that runs entirely in the visitor's browser: chunk embeddings are precomputed at deploy time (`scripts/search/`) and the query is embedded client-side — no backend, nothing typed ever leaves the page. On top of it, the **AI answer** button sends the question plus the top excerpts to our own Cloudflare Worker (`workers/wiki-ask`), which asks a Workers AI model for a short grounded answer with citations. Free tier with a hard cap: if the daily quota runs out it degrades to plain results — and on the **Workers Free plan** it can never bill (on Workers Paid, overage would auto-bill, so this account deliberately stays on Free).

## How to add content

From the browser: `/admin/` → pick the section → New → write → Save. Or by hand:

1. Create the `.md` file in its category folder (e.g. `docs/fundamentals/my-topic.md`). There's a [template](docs/template.md) with the recommended structure.
2. Add it to the sidebar in `docs/.vitepress/sidebar.json`:
   ```json
   { "text": "My topic", "link": "/fundamentals/my-topic" }
   ```
3. Commit and push to `main`. It's published in about a minute.

## Local development

```bash
npm install
npm run dev      # local server with hot reload
npm run build    # production build
npm run preview  # preview the build
```

## Structure

```
docs/
├── .vitepress/config.mts   # site config; generates the CMS config at build end
├── .vitepress/sidebar.json # sections and sidebar (data — editable via the CMS)
├── .vitepress/sidebar.ts   # derives nav + sidebar from sidebar.json
├── .vitepress/cms.ts       # derives the CMS collections from sidebar.json
├── public/admin/           # the CMS page (static HTML)
├── index.md                # home page
├── fundamentals/           # core QA concepts
├── strategy/               # testing strategy and quality processes
├── api-testing/            # API testing and automation
├── automation/             # Playwright, Cypress, patterns and real cases
├── cicd/                   # pipelines, static analysis, sharding
├── performance/            # performance testing
├── telecom/                # QA in the telecom domain
├── istqb/                  # ISTQB certification
├── search.md               # browser-side semantic search + AI answers
├── glossary.md             # terms in short
├── learning-path.md        # ordered QA learning path
├── how-this-wiki-works.md  # design write-up: architecture, decisions, teardown
├── template.md             # template for new entries
└── about.md                # bio and projects
scripts/search/             # build-time embedding index (CI-only deps)
workers/wiki-ask/           # grounded-answer Worker (+ mocked-AI tests)
```

## Enabling GitHub Pages (first time only)

In the repo: **Settings → Pages → Source → GitHub Actions**. From there, the `.github/workflows/deploy.yml` workflow takes care of the rest.

## License

Dual-licensed — see [LICENSE.md](LICENSE.md): the code (VitePress config, workflows) is **MIT**; the wiki content under `docs/` is **CC BY-NC-SA 4.0** (share and adapt non-commercially, with attribution).
