# Template for new entries

Copy this structure when creating a new wiki entry. You don't have to fill everything in — it's a starting point so you never begin from scratch.

```markdown
# Topic title

One or two sentences: what this is and why it matters to me as a QA engineer.

## Context

Where I ran into this (project, course, article) and what problem it solves.

## The main idea

An explanation in my own words. If I can't explain it simply,
I don't fully understand it yet.

## Practical example

A concrete case, ideally from my day-to-day work.

## How I apply it

- Checklist or actionable steps.

## Common mistakes / things that surprised me

- ...

::: tip Key idea
The one sentence I'd want to remember from this page.
:::

## References

- [Link to the source](https://...)
```

## Wiki conventions

1. **One `.md` file per topic**, in its category folder (`docs/fundamentals/`, `docs/api-testing/`…).
2. **File name**: lowercase with hyphens — `my-new-topic.md`.
3. **Add the page to the sidebar**: add `{ "text": "...", "link": "/category/my-new-topic" }` to its section in `docs/.vitepress/sidebar.json` — or do it from the CMS at `/admin/` ("Sections & sidebar"). Links to pages that don't exist yet are hidden until the page is created, so order doesn't matter.
4. For a **new category**: add a section to `docs/.vitepress/sidebar.json` (give it `nav` and `dir` to get a top-menu entry and its own CMS collection) and create `docs/<dir>/index.md` — again, doable entirely from `/admin/`.
5. Write **in my own words**: the wiki is worth what I understand, not what I copy.
6. **Two recurring example domains**: the wiki's examples use a threat modeling platform and a telecommunications operator as fictional domains, so they speak the language of real projects without naming companies or products.
