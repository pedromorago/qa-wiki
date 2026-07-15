# 📚 QA Wiki — Formación

[![Deploy](https://github.com/pedro-morago/formacion/actions/workflows/deploy.yml/badge.svg)](https://github.com/pedro-morago/formacion/actions/workflows/deploy.yml)
[![CI](https://github.com/pedro-morago/formacion/actions/workflows/ci.yml/badge.svg)](https://github.com/pedro-morago/formacion/actions/workflows/ci.yml)

My personal **Quality Assurance** knowledge wiki: everything I keep learning, written in my own words, organized and searchable. It serves as a reference while I work and as part of my portfolio.

**🌐 Web**: https://pedro-morago.github.io/formacion/

Built with [VitePress](https://vitepress.dev): entries are Markdown files in `docs/`, every pull request goes through a validation build (CI, which also detects broken links), and every push to `main` deploys automatically to GitHub Pages.

## How to add content

1. Create a `.md` file in its category folder (e.g. `docs/fundamentals/my-topic.md`). There's a [template](docs/template.md) with the recommended structure.
2. Add it to the sidebar in `docs/.vitepress/sidebar.ts`:
   ```ts
   { text: 'My topic', link: '/fundamentals/my-topic' }
   ```
3. Commit and push to `main`. It's published within a couple of minutes.

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
├── .vitepress/config.mts   # configuration and top menu
├── .vitepress/sidebar.ts   # sidebar
├── index.md                # home page
├── fundamentals/           # core QA concepts
├── strategy/               # testing strategy and quality processes
├── api-testing/            # API testing and automation
├── automation/             # Playwright, patterns and real cases
├── cicd/                   # pipelines, static analysis, sharding
├── glossary.md             # terms in short
├── template.md             # template for new entries
└── about.md                # bio and projects
```

## Enabling GitHub Pages (first time only)

In the repo: **Settings → Pages → Source → GitHub Actions**. From there, the `.github/workflows/deploy.yml` workflow takes care of the rest.
