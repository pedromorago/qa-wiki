# Migrating from TestCafe to Playwright: a real case

I took part in the full migration of a TestCafe E2E suite (3+ years of history, ~383 tests) to Playwright with TypeScript. Here's what I learned — the numbers, the method, and the traps.

## Why we migrated

- **Execution time**: TestCafe runs were essentially sequential; with the suite growing, CI became a bottleneck.
- **Cookies and API calls**: preparing data via API inside the tests (needing the session token) was a constant fight with TestCafe's native methods.
- **Flakiness**, especially in tests acting on an **iframe** (an embedded visual editor — our worst case).

## The PoC: validate the framework against your worst tests

Instead of migrating the easy tests to show off a pretty PoC, we deliberately picked **the flakiest tests and the iframe ones** (~21 tests across all domains). If Playwright survived that, it would survive anything.

Measured results (same suite, Firefox):

| Suite | TestCafe (sequential) | Playwright (console, parallel) |
|---|---|---|
| Domain A — 6 tests | 2 min 56 s (with 2/6 failing) | **30.5 s (6/6 green)** |
| Suite B — 2 tests | 1 min 20 s | **24.2 s** |

**~5-6× faster and more stable**: tests that failed in TestCafe passed in Playwright. The PoC also validated the critical bits: iframes (`FrameLocator`), getting the session token from the context cookies (trivial in Playwright), tags, HTML report, parallelization, and running in Docker with the official image.

A method detail: the PoC was done **in JavaScript** (our language at the time — that way we were evaluating the framework, not the language) and the final project in **TypeScript**.

## Estimate the migration with data, not faith

The part I've seen done wrong most often. Our method:

1. **Inventory**: every test by domain and type (sanity/regression/key workflow) → 383 in total, 362 remaining after the PoC.
2. **Real velocity measured in the PoC**: a senior QA migrated **6 tests/day** (including the JS→TS learning curve).
3. **Plan**: 4 QAs × ~6 tests/day ≈ 16 days per person (~3 weeks) — explicitly declared as an optimistic scenario, with the risks listed: learning curve, hard-to-locate elements, squad priorities, releases, and reviews.

Two hygiene rules that worked very well:

- **Start with the sanity suite**: coverage of the core stuff as early as possible; the long regression suite afterwards.
- **Delete each TestCafe file as soon as its content is migrated.** In a mixed repo, zombie code confuses and duplicates maintenance; plus, progress stays visible.

## The mechanics of the migration

**Tests**: the main change is instantiating the page objects with `page`:

```js
// TestCafe
await mainMenuTasks.goTo('AUDIT-LOG');
await auditLogQuestions.validateTitleExists();
```

```ts
// Playwright
const mainMenu = new MainMenu(page);
await mainMenu.goTo('AUDIT-LOG');
const auditLog = new AuditLog(page);
await auditLog.validateTitleExists();
```

**POM**: from three folders per page (UI/Tasks/Questions) to [one class per page](/automation/page-object-model); TestCafe's global `t` object disappears in favor of methods over typed locators.

**Assertions** — the subtle trap that explains the "residual flakiness" after migrating:

```ts
// ❌ literally migrated pattern: does NOT retry
await expect(this.success.innerText()).resolves.toBe(msg);
expect(await locator.isVisible()).toBe(true);

// ✅ web-first assertions: retry until the timeout
await expect(this.success).toHaveText(msg);
await expect(locator).toBeVisible();
```

**API services and data**: same classes in `.ts`, session token from the context cookies (`getAccessToken(page)`), and the mock data converted into **typed factories** with random generation.

**Least privilege by default**: each entity is tested with a user that has only the permission for that action (not the admin). Trick: the backend's OpenAPI spec tells you which permission each endpoint requires.

## Lessons

1. PoC against your worst tests, not your prettiest ones.
2. Measure your migration velocity before committing to a plan — and list the risks.
3. PoC in the language you know, product in the right language.
4. Aligning with the frontend team's stack (TypeScript) brought standards and support for free.
5. Short "how to migrate X" guides (tests, POM, API, data) let 4 people parallelize without stepping on each other.
6. Web-first assertions are half the stability you gain with Playwright — use them from the very first migrated test.
