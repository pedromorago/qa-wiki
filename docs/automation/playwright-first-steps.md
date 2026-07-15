# Playwright: first steps

The essentials to get started with Playwright on a serious project: structure, your first test, and — most importantly — how to debug.

## Installation and getting started

```bash
npm init playwright@latest   # new project
npx playwright install       # download the browsers
npx playwright test          # run everything
npx playwright test src/tests/usuarios/crear-usuario.spec.ts   # a specific spec
```

On a real project there's a prior step that tutorials forget: **setting up API access** for the application under test (enabling it, generating a token for the test user), because well-built tests prepare their data via API before touching the UI.

## A project structure that works for me

| Folder | Contents | Rule |
|---|---|---|
| `src/tests/` | Specs, organized **by functional domain** | Each test goes in its domain's folder |
| `src/pages/` | Page Objects (one class per page/modal/list) | Check what already exists before creating new methods |
| `src/api/` | API services for data preparation | Same: check whether the service already exists |
| `src/data/` | Typed mock data factories | Reuse the interfaces |
| `src/files/` | Static resources (images, XML…) | |
| `src/helpers/` | Cross-cutting utilities (e.g. login with different users) | A helper only if Playwright doesn't ship it and it's used across several tests |

## The first test (and the recorder)

The official VS Code extension (`ms-playwright.playwright`) has two features I use constantly:

- **Record new**: opens a browser and writes the test as you interact. As a *draft*, not as a final test:

```ts
import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByLabel('Email or username').fill('user@example.com');
  await page.getByLabel('Password').fill('<password>');
  await page.getByTestId('submit-button').click();
});
```

- **Pick locator**: hover over any element and it shows you the locator Playwright suggests. A lifesaver when an element puts up a fight.

The mature workflow: record to **discover selectors and actions**, then encapsulate that in the [Page Object Model](/automation/page-object-model) with native locators (`getByRole`, `getByLabel`, `getByTestId`…), which are the most resilient.

## Debugging: the part that makes you fast

From least to most interactive:

1. **HTML report** — after every run: `npx playwright show-report`. In CI it's published as a pipeline artifact for you to download.
2. **Trace viewer** — Playwright's crown jewel. The report includes traces (`.zip`); you replay them locally **exactly as they happened in CI**:

   ```bash
   npx playwright show-trace path/to/trace.zip
   ```

   DOM snapshot before/after every action, console, network, code. It's the standard way to answer "it fails in CI but not locally".
3. **UI mode** — `npx playwright test --ui` (filterable: `npx playwright test tests/usuarios --ui`). *Time travel* through every action, watch mode, browser selection. For developing tests, unbeatable.

::: warning Don't measure timings in UI mode
UI mode is noticeably slower than running from the console (in an internal measurement: 54.9 s vs 30.5 s for the same suite). To compare performance, always use the console.
:::
