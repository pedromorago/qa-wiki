# AI in test automation: what works (and what doesn't yet)

Notes from two real experiences applying AI to QA: a PoC with the Playwright agents, and using coding assistants during a massive test migration. No hype: with numbers and verdicts.

## PoC: the Playwright agents

Playwright offers three AI agents. We evaluated them on a real E2E suite:

### 🩹 Healer — fixes failing tests

- **Reliable** when the failure is **in the automation repo itself**: badly specified locators or test implementation errors. In the PoC we introduced a typo in a method argument and it identified and fixed it quickly.
- **Fails** when many tests break at once due to selector changes in the application: it can't detect the mismatch between the frontend code and the automation's selectors.

**Verdict**: useful as a detector of test implementation errors; not for failures caused by changes in the application.

### 📋 Planner — generates test plans

You give it context about the app and how many scenarios you want; it produces an `.md` with numbered scenarios and steps with nested `expect:` items. What surprised me most: the coverage includes **responsiveness, accessibility (keyboard, screen reader, ARIA), and performance with large datasets** — dimensions a manual plan often forgets.

**Verdict**: valuable as a **scenario checklist generator** that a human curates and implements.

### 🤖 Generator — generates the tests

It takes the Planner's plan + context about the team's approach (POM, locators) and generates the test class. The numbers from our PoC:

- Generating a test for a cross-domain scenario: **13–15 minutes**.
- Most generated tests **don't work** and come with a significant number of errors.
- Fixing a single cross-domain test: **more than 15 minutes**.

**Verdict**: for complex E2E, today it doesn't beat writing it yourself with the existing POM.

### PoC conclusion

The agent solution **doesn't (yet) fit into the daily flow** of creating and maintaining complex E2E tests. What's worth keeping: Healer for one-off implementation failures and Planner as scenario brainstorming.

## What did work: AI as a migration accelerator

During the [TestCafe → Playwright migration](/automation/migrating-from-testcafe-to-playwright) we used Copilot/ChatGPT with a simple technique that multiplies the quality of the result: **the reference file** (few-shot). Instead of asking "migrate this to Playwright" cold:

```
> Use 'editor.ts' as a reference example to migrate selectors
> from 'Feature/UI/Feature.js'
```

The full flow: a **style corpus** (tests already migrated by hand by humans) + AI for the mechanical translation work + **human review, always**. AI performs far better imitating your pattern than inventing its own.

## My rules for using AI in QA

1. **AI proposes, the human curates.** Drafts of acceptance criteria, test plans, mechanical migrations: yes. Final output without review: no.
2. **Give it examples, not descriptions.** One reference file is worth more than three paragraphs of instructions.
3. **Never share sensitive data** (business, internal security, personal data) with external AI tools.
4. **Measure before adopting.** Our PoC cost little and saved us from adopting a flow that doesn't pay off today. Verdicts expire: what doesn't work today may work two versions from now — re-evaluate.
