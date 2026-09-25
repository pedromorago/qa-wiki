# TypeScript for QA

Why I automate in TypeScript rather than JavaScript, and the code standards I apply in the test repository.

## Why TypeScript

- **Static typing**: errors show up as you type, not at minute 12 of the CI run.
- **Maintainability**: in a large test repo, the compiler is your first test suite.
- **A real POM**: abstract classes, interfaces, and strict inheritance ([SOLID in the POM](/automation/page-object-model)).
- **Tooling**: autocompletion and first-class VS Code integration.
- And an organizational reason that doesn't show up in tutorials: **using the same language as your frontend team**. If the product is React+TS, automating in TS gives you shared standards and support from their experts. Ask your team what they use before deciding your stack.

A strategy anecdote: our Playwright PoC was done in JavaScript *on purpose* (minimizing variables while evaluating the framework), and the final project in TypeScript. PoC in the language you know; product in the right language.

## Naming conventions

| Element | Convention | Example |
|---|---|---|
| Classes | `PascalCase` | `LoginPage`, `CustomFieldList` |
| Methods and variables | `camelCase` | `openMenu()`, `navigateToProjects()` |
| Files | `kebab-case` | `custom-field.list.ts` |

## Typing you can feel

Explicit signatures with typed objects, defaults, and optionals:

```ts
async find(component: { referenceId: string; name: string }, exist: boolean = true)
```

Autocompletion, enforced correct usage, and errors at development time. The medium-term goal: **zero `any`** — every domain object with its own interface. (Confession: after a migration there are always stray `any`s left. They get removed iteratively, but you have to put it in the plan or it never happens.)

## ESLint with the Playwright rules

Flat config combining three layers: recommended JS + TypeScript + **`eslint-plugin-playwright`** (specific rules: await misuse, misused assertions, Playwright globals):

```js
// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: { "@typescript-eslint/no-floating-promises": "error" },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["src/**/*.ts"],
  },
];
```

A tip learned the hard way: *type-aware* rules (`no-floating-promises` and friends) aren't part of `recommended` and require wiring up the `tsconfig` (the `projectService` above). It's tempting to leave them out to get started quickly — but `no-floating-promises` is precisely the rule that catches Playwright's number one bug: **the forgotten `await`**. Wire them up as soon as you can.

In CI, ESLint emits **checkstyle** format so the pipeline renders the findings as a build report:

```bash
npx eslint --format=checkstyle -o checkstyle-result.xml src
```

Since ESLint 9 the checkstyle formatter is no longer built in: install it with `npm i -D eslint-formatter-checkstyle` and the same `--format=checkstyle` picks it up.

The test repository also goes through [SonarCloud like any other repo](/cicd/static-analysis) — test code is code too.

## The automation engineer's checklist

My checklist before calling an automation done:

- Native locators (`getByRole`, `getByTestId`…), no fragile selectors
- Reused what exists: POM, API services, data factories, helpers
- Test in its domain folder, with its [full metadata](/automation/configuring-and-organizing-playwright) (tags + test case manager ID)
- No `waitForTimeout` — web-first assertions with auto-retry
- Pipeline green: execution + ESLint + Sonar, no regressions in stable tests
- Automation status updated in the test case manager
