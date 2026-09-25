# Configuring and organizing a Playwright suite

The `playwright.config.ts` decisions, environment management, and the tag system that keeps a large suite manageable.

## Timeouts: tune them to your application

Playwright's defaults (30 s per test, 5 s per assertion) fall short on heavy applications. On ours:

```ts
export default defineConfig({
  timeout: 3 * 60 * 1000,             // test: 3 min
  expect: { timeout: 2 * 60 * 1000 }, // assertions: 2 min
});
```

With a caveat: a high timeout unblocks you, but it can also **mask performance problems**. If a screen needs 90 seconds to load, the test isn't the problem.

## Parallelization

```ts
fullyParallel: true,
workers: process.env.CI ? 2 : 4,   // fewer workers in CI (smaller machines)
```

By default Playwright parallelizes per file (tests in a file run in order on the same worker); with `fullyParallel: true`, as above, tests from the same file are also spread across workers. Prerequisite: [independent tests with their own data](/cicd/parallelization-and-sharding).

## Projects: browsers and variants

```ts
projects: [
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } },
  },
  {
    name: 'chrome',
    use: {
      ...devices['Desktop Chrome'],
      channel: 'chrome',        // "real" Chrome, not Chromium
      viewport: { width: 1920, height: 1080 },
      bypassCSP: true,          // apps with a strict Content Security Policy
    },
  },
],
```

Selection via CLI: `--project=firefox`. Fixed viewport = visual stability. And beware: **each engine behaves differently with certificates and localhost in Docker** — validate every browser in CI separately; working in Firefox doesn't guarantee Chromium/WebKit.

## Environment variables

A `.env` at the root (outside git), loaded from the config with dotenv:

```ts
dotenv.config({ path: path.resolve(__dirname, '.env') });
```

```ini
BASE_URL=http://localhost:8080
API_TOKEN=<test-user-token>
ADMIN_USER_NAME=<username>
ADMIN_USER_PASSWORD=<password>
```

- Locally, each person points to their own deployment; in CI, the same variables are injected from the pipeline (secrets as CI secret variables — never in the repo).
- Non-sensitive constants (per-module URLs, permission names) go in versioned TS files — autocompletion and a single point of change.

## Organizing with metadata: the three dimensions

Every test carries three kinds of metadata:

```ts
test('Try to get assets without permissions', {
  tag: ['@sanity', '@enterprise', '@community'],
}, async ({ page }) => {
  qase.id(1830);
  // ...
});
```

1. **Test type**: `@smoke`, `@sanity`, `@regression` — determines which battery it runs in.
2. **Case ID in the test case manager** (Qase/TestRail…): **the first statement of the test**, so the result always gets published.
3. **Product edition** (if applicable): `@enterprise`, `@community`, or both.

### Filtering at run time

`--grep` with **regex lookaheads** to combine dimensions with AND logic:

```bash
# one dimension
npx playwright test --grep "(?=.*@sanity)"

# AND of several (type + edition), parameterized from the pipeline
npx playwright test --grep "(?=.*@$TEST_TYPE)(?=.*@$EDITION)"
```

The variables come from the environment: the same command works for any combination in any pipeline.

### The skip detail

If you skip a test, the `test.skip()` goes **after** the `qase.id()` — otherwise the test case manager doesn't associate the result and that case drops off the test run's radar:

```ts
test('Delete component when the ref is duplicated', { tag: ['@regression'] }, async () => {
  qase.id(1043);
  test.skip(true, 'Fix pending');
});
```

## A fixtures gotcha you will run into

`context` and `page` **don't exist in `beforeAll`** (they're created per test). If you need to reuse a page across tests — or record video, which is a context option — create the context by hand:

```
Error: "context" and "page" fixtures are not supported in "beforeAll"
since they are created on a per-test basis.
```

```ts
import { test, type BrowserContext, type Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });   // the tests share the page, so they run in order

let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();   // here you can pass recordVideo, etc.
  page = await context.newPage();
});
test.afterAll(async () => { await context.close(); });
```
