# How this wiki works

This site is also a QA artifact. In its first weeks it went through three architectures, one measured model comparison, one production bug and one deliberate demolition — so it gets the same treatment I give any system I test: requirements, trade-offs, evidence, and honest notes about what didn't survive. This page documents the architecture and, more importantly, *why* it is built this way, with the books and essays each decision leans on.

## The requirements

1. **Public by default.** The wiki is part of my portfolio: proof that I can explain testing in clear written English. A private notebook proves nothing.
2. **Editable from anywhere.** Publishing must work from a browser — any machine, no local checkout — or the writing habit dies.
3. **Near-zero maintenance and cost.** Side-project infrastructure that needs babysitting eventually gets abandoned. Whatever I build has to keep working while I ignore it.
4. **Only keep what gets used.** Anything that exists but isn't used is inventory, not asset — and inventory rots.

## The architecture

```
   sidebar.json ──────────── single source of truth ────────────┐
        │                                                       │
        ▼                                                       ▼
   nav + sidebar                                     CMS collections (/admin/)
        │                                                       │
        └────────────► Markdown in a public GitHub repo ◄───────┘
                                   │  push to main
                                   ▼
                    CI: build + semantic search index
                                   │
                                   ▼
                 GitHub Pages — wiki.pedromorago.com
```

Everything is **docs as code** (Anne Gentle's *Docs Like Code*): Markdown in git, a CI build that fails on broken links, automatic deploys — the same pipeline discipline as software, because for a QA engineer the pipeline *is* part of the portfolio. Commit-to-published takes about a minute.

Editing happens through [Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin/` — a static, git-backed editor. The admin page itself is public, and that is fine by design: it follows Saltzer & Schroeder's **least privilege** — the page grants nothing; the ability to write lives entirely in GitHub's permission model, and exactly one account has it. Sign-in uses a small OAuth Worker on my own Cloudflare account, so no third-party service ever touches the repo.

One detail I'm fond of: sections are defined once, in `sidebar.json`, and everything else derives from it — the top menu, the sidebar, and the CMS's own collections, generated at build time. Creating a section in the CMS makes the CMS grow an editor for it on the next build. That is the **DRY principle** from *The Pragmatic Programmer* applied to structure, not just prose. The sidebar also self-heals: entries whose page doesn't exist yet are hidden instead of breaking the build, so a section and its pages can arrive in any order.

## Search that never phones home

The wiki has two search boxes and they are deliberately different machines:

- **Ctrl K** — VitePress's local keyword search. Exact words, instant.
- **✨ AI search** — semantic search over the *meaning* of every page. At deploy time, a script chunks each page by heading and precomputes an embedding per chunk; the browser downloads the index plus a small multilingual model (~110 MB, cached), embeds *your query locally*, and ranks chunks by cosine similarity. **Nothing you type leaves the page.** No backend, no telemetry, nothing to operate — and nothing that can be abused, because there is nothing to call.

The embedding model was chosen by measurement, not vibes. A candidate model (multilingual-e5-small) fixed Spanish-question→English-article ranking but scored 5/8 on a battery of short English queries where the incumbent scored 9/10 — so the incumbent stayed, and the limitation ("ask in English") is documented on the search page instead of hidden. Per *The Pragmatic Programmer*'s "Find Bugs Once": the scores and the verdict are recorded next to the model constant in `build-index.mjs`, so any future model swap starts from that bar instead of re-arguing it.

## Answers with receipts

On top of retrieval sits a thin generation layer: press **AI answer** and the browser sends the question plus the top five excerpts — public content only, by construction — to a ~100-line Cloudflare Worker, which asks a Workers AI model for a short answer *grounded exclusively in those excerpts*, streamed back with citations. The sources list under the answer is rendered client-side from the excerpts actually sent, so the model cannot invent a reference.

The guardrail is half prompt, half calibration. The first model tried was too literal — given an excerpt about testing asynchronous operations, it refused a question about "message queues" because the words didn't match. The fix wasn't clever prompting (that was tried, and measured, and failed); it was a more capable model, verified before shipping against two cases: a question the wiki covers (must answer, with citations) and one it doesn't (must say so), both replayed against real production payloads.

Abuse economics matter for a public endpoint: origin allow-list, strict input limits, per-IP rate limiting — and the real backstop is that the Workers AI free tier has a **hard cap**: past the daily quota it errors, it never bills. The page degrades to plain results with a friendly note. Failure mode: "stops", never "surprise invoice".

## The half that no longer exists

The first architecture was more ambitious: a private overlay in a separate repo, a dual build, an authenticated twin site behind Cloudflare Access, its own CMS, and a promotion pipeline that could publish a private note to the public wiki with anti-traversal guards and CI leak checks layered like James Reason's Swiss cheese model. It worked. It was verified. And within the week I tore it down.

The reason is requirement 4. My private notes turned out to live better in a plain notes app: less friction to capture, no login wall, no pipeline. A system I built and don't use is worse than no system — it costs attention and creates the illusion of a workflow. Dan McKinley's *Choose Boring Technology* frames it as innovation tokens: I'd spent several on machinery whose job a boring tool did better. Demolishing your own good work when the evidence says so is a QA skill too.

One lesson from that era is worth keeping in print. The private build once leaked the private repo's *name* into every public page — not through content, but because VitePress serializes function-valued theme options into the page payload, and an edit-link function mentioned the private repo. The root cause was an untested assumption about a framework's serialization boundary; the fix came with a regression guard that grepped the *built output*, the only place generator leaks are visible. The guard retired with the architecture, but the class of lesson didn't: **test the artifact you ship, not the source you wrote.**

## Why public at all

Three influences convinced me the public wiki was worth building:

- **Learn in public** (swyx's essay): the feedback, connections and opportunities all live on the public side of your notes.
- **Digital gardens** (Maggie Appleton): a wiki that grows by small tending beats a blog that demands finished essays — lower the publishing bar and you publish.
- ***Show Your Work!*** (Austin Kleon): showing process, not just outcomes, is what makes work findable — and a hiring manager reading this page is the concrete use case.

Publishing still means rewriting: work material never gets pasted here — lessons are rewritten generic, in my own words, set in this wiki's two [fictional example domains](/template). Rewriting-to-publish is **elaboration** — Sönke Ahrens' *How to Take Smart Notes* argues that explaining an idea in your own words is where learning actually happens. The public wiki records what I *understand*, which is precisely why it works as a portfolio.

## What it costs

The domain: $10.46/year. Everything else — GitHub Pages, the CMS, the OAuth Worker, the search index build, the RAG Worker — runs on free tiers deliberately chosen so that their failure mode is *degradation*, never *billing*.

## The moving parts

For the code-inclined, the whole mechanism is a handful of small files in the [public repo](https://github.com/pedro-morago/qa-wiki):

- `docs/.vitepress/config.mts` — site config; at build end it generates the CMS config from `sidebar.json`.
- `docs/.vitepress/sidebar.ts` — derives nav and sidebar from `sidebar.json`, hiding entries whose pages don't exist yet.
- `docs/.vitepress/cms.ts` — generates the Sveltia collections from the same source.
- `docs/public/admin/` — the CMS page itself (static HTML + one script tag).
- `scripts/search/build-index.mjs` — chunks pages and precomputes embeddings at deploy time.
- `docs/search.md` — the browser-side search page and the AI-answer client.
- `workers/wiki-ask/` — the grounded-answer Worker, with its own mocked-AI test harness.
- `.github/workflows/` — CI, the Pages deploy with the index step, and the Worker deploy.

## References

**On engineering judgment**

- Andrew Hunt & David Thomas — [*The Pragmatic Programmer*](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) (DRY; "Find Bugs Once")
- Dan McKinley — [*Choose Boring Technology*](https://boringtechnology.club/) (innovation tokens)
- Jerome Saltzer & Michael Schroeder — [*The Protection of Information in Computer Systems*](https://web.mit.edu/Saltzer/www/publications/protection/) (least privilege, fail-safe defaults — from 1975 and still the checklist)
- James Reason — [“Human error: models and management”](https://www.bmj.com/content/320/7237/768) (the Swiss cheese model)

**On learning and publishing**

- Sönke Ahrens — [*How to Take Smart Notes*](https://www.soenkeahrens.de/en/takesmartnotes) (elaboration; writing as thinking)
- swyx — [*Learn in Public*](https://www.swyx.io/learn-in-public)
- Maggie Appleton — [*A Brief History & Ethos of the Digital Garden*](https://maggieappleton.com/garden-history)
- Austin Kleon — [*Show Your Work!*](https://austinkleon.com/show-your-work/)
- Anne Gentle — [*Docs Like Code*](https://www.docslikecode.com/) (docs through the software pipeline)
