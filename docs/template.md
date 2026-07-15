# Template for new entries

Copy this structure when creating a new wiki entry. You don't have to fill everything in — it's a starting point so you never begin from scratch.

```markdown
# Topic title

One or two sentences: what this is and why it matters to me as a QA.

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

## References

- [Link to the source](https://...)
```

## Wiki conventions

1. **One `.md` file per topic**, in its category folder (`docs/fundamentals/`, `docs/api-testing/`…).
2. **File name**: lowercase with hyphens — `my-new-topic.md`.
3. **Add the page to the sidebar**: edit `docs/.vitepress/config.mts` and add a line `{ text: '...', link: '/category/my-new-topic' }` in its section. Note: the sidebar definition now lives in `docs/.vitepress/sidebar.ts`.
4. For a **new category**: create the folder with its `index.md` and add the section to the sidebar and to the top menu.
5. Write **in my own words**: the wiki is worth what I understand, not what I copy.
