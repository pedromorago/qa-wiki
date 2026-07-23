# 📚 QA Wiki — Formación

[![Deploy](https://github.com/pedro-morago/formacion/actions/workflows/deploy.yml/badge.svg)](https://github.com/pedro-morago/formacion/actions/workflows/deploy.yml)
[![CI](https://github.com/pedro-morago/formacion/actions/workflows/ci.yml/badge.svg)](https://github.com/pedro-morago/formacion/actions/workflows/ci.yml)

My personal **Quality Assurance** knowledge wiki: everything I keep learning, written in my own words, organized and searchable. It serves as a reference while I work and as part of my portfolio.

**🌐 Web**: https://pedro-morago.github.io/formacion/

Built with [VitePress](https://vitepress.dev): entries are Markdown files in `docs/`, every pull request goes through a validation build (CI, which also detects broken links), and every push to `main` deploys automatically to GitHub Pages.

## Public wiki + private overlay

This repo is the **public** wiki. Alongside it there is a **private overlay** — a separate private repo cloned at `docs/private/` (gitignored here) with company docs, runbooks and rough notes. One source tree, two builds:

| Command | What it builds | Where it goes |
|---|---|---|
| `npm run build` | Public wiki only (`docs/private/` excluded) | GitHub Pages — this site |
| `npm run build:full` | Public + private overlay | Cloudflare Pages, behind Cloudflare Access (authenticated) |
| `npm run dev` | Everything, locally | Local dev server |

The private overlay cannot leak into the public site by construction: its files are not in this repo, so the public CI never even has them on disk. Three CI leak guards additionally fail the build if `docs/private/` is ever tracked, if a file marked `confidential: true` appears in the public tree, or if the public build emits any `/private/` route.

The full design write-up — requirements, rejected alternatives, threat model and the reasoning (with references) behind each guard — is published as a wiki page: [How this wiki works](https://pedro-morago.github.io/formacion/how-this-wiki-works).

## How to add content

1. Create the `.md` file in its category folder (e.g. `docs/fundamentals/my-topic.md`). There's a [template](docs/template.md) with the recommended structure.
2. Add it to the sidebar in `docs/.vitepress/sidebar.json`:
   ```json
   { "text": "My topic", "link": "/fundamentals/my-topic" }
   ```
3. Commit and push to `main`. It's published in about half a minute.

Both steps can also be done from the browser: the authenticated site serves a web CMS (Sveltia) that edits this repo — including the sidebar — through the GitHub API, so "save" is just a commit that goes through the same pipeline and leak guards.

Private notes are even simpler: drop a `.md` file into the right folder under `docs/private/` — its sidebar is generated automatically.

## Local development

```bash
npm install
npm run dev         # local server with hot reload (includes private overlay if present)
npm run dev:public  # local server, public content only
npm run build       # public production build
npm run build:full  # full production build (public + private)
npm run preview     # preview the build
```

## Structure

```
docs/
├── .vitepress/config.mts   # configuration, top menu, public/full build modes
├── .vitepress/sidebar.json # curated public sidebar (data — editable via the CMS)
├── .vitepress/sidebar.ts   # thin typed wrapper around sidebar.json
├── .vitepress/private.ts   # auto-generated sidebar for the private overlay
├── index.md                # home page
├── fundamentals/           # core QA concepts
├── strategy/               # testing strategy and quality processes
├── api-testing/            # API testing and automation
├── automation/             # Playwright, Cypress, patterns and real cases
├── cicd/                   # pipelines, static analysis, sharding
├── performance/            # performance testing
├── telecom/                # QA in the telecom domain
├── istqb/                  # ISTQB certification
├── private/                # PRIVATE overlay (separate repo, gitignored)
├── glossary.md             # terms in short
├── template.md             # template for new entries
└── about.md                # bio and projects
```

## Enabling GitHub Pages (first time only)

In the repo: **Settings → Pages → Source → GitHub Actions**. From there, the `.github/workflows/deploy.yml` workflow takes care of the rest.

## License

Dual-licensed — see [LICENSE.md](LICENSE.md): the code (VitePress config, workflows) is **MIT**; the wiki content under `docs/` is **CC BY-NC-SA 4.0** (share and adapt non-commercially, with attribution).
