# About me

I'm **Pedro Morago**, a QA Engineer with 5 years of experience in quality assurance and test automation, first on international SaaS products and now in telecom OSS. This wiki is my personal knowledge base: everything I learn while working and studying, written in my own words.

- 🎓 Degree in **Mathematics** (University of Cantabria) — that's where my obsession with optimizing everything comes from.
- 📜 **ISTQB® Certified Tester Foundation Level (CTFL) v4.0**
- 💼 QA Engineer at a technology consultancy, on an OSS service-ordering project for a telecommunications operator. Previously at a cybersecurity SaaS product (threat modeling) and at a field service management SaaS.
- 🌍 Working 100% remotely in agile, distributed teams.

[LinkedIn](https://www.linkedin.com/in/pedro-morago-lopezvazquez/) · [GitHub](https://github.com/pedromorago)

## What I do day to day

- **Telecom OSS testing**: service orders over TM Forum Open APIs (TMF641, TMF638), catalog-driven decomposition, BPM workflows and [fallout management](/telecom/fallout-management), in environments that mix real integrations and mocks.
- **Test management**: test plans, executions and traceability in **Jira + Xray**, and proposals to keep that process consistent across several Scrum teams.
- **Triage**: [investigating intermittent and production failures](/strategy/investigating-hard-failures) across chains of systems, with Postman as the everyday tool.

Before that, on SaaS products:

- **Testing strategy**: defining the test mix across the pyramid (unit, integration, API, E2E) for features and entire modules.
- **Backend automation**: APIs in **Java with REST Assured and JUnit 5** — Given-When-Then pattern, JSON schema validation, negative cases, traceability with Qase.
- **E2E automation**: **Playwright with TypeScript** (I took part in a full migration from TestCafe that cut execution times by ~80%). Previously Cypress and Selenium.
- **CI/CD**: integrating tests into Bitbucket Pipelines, static analysis (SonarCloud, linters) and parallel execution optimization.
- **Shift-left**: reviewing requirements and designs from early stages and turning them into actionable test cases.
- **Root cause analysis** of bugs to steer the testing strategy and reduce recurrence.

## Projects

### 🧩 CI Shard Advisor
A tool to **optimize the distribution of E2E tests across CI shards**. Born from a real problem: I designed an optimization model in Python (mixed-integer linear programming) to parallelize E2E test execution, cutting pipeline time by around 40% without increasing infrastructure cost.
→ [github.com/pedromorago/ci-shard-advisor](https://github.com/pedromorago/ci-shard-advisor)

### 🎥 Screen recorder
A browser extension for recording your screen. Video evidence is among the most valuable things when reporting a bug, and I wanted a tool built to my taste.
→ [github.com/pedromorago/screen-recorder-qa](https://github.com/pedromorago/screen-recorder-qa)

### 📚 This wiki
The site you're on right now: a QA learning wiki built with VitePress and deployed automatically with GitHub Actions. Its architecture — a git-backed web CMS, in-browser semantic search and grounded AI answers, all at near-zero cost — is itself a QA exercise: [I documented the design and its reasoning](/how-this-wiki-works).
→ [github.com/pedromorago/qa-wiki](https://github.com/pedromorago/qa-wiki)

### 💼 Portfolio
My personal site with the rest of my projects.
→ [github.com/pedromorago/portfolio](https://github.com/pedromorago/portfolio)

### 🎰 Spins *(under construction)*
Coming soon.

## Why this wiki

Three reasons:

1. **Learning by writing** — explaining something in your own words is the litmus test that you understand it.
2. **Quick reference** — my go-to documentation while I work.
3. **Sharing** — if what I'm learning helps someone else too, that's a double win.

## How this wiki is made

Full transparency: I maintain this wiki **with the help of Claude Code**. The experience, the technical decisions and the criteria behind every article are mine — drawn from my day-to-day work as a QA Engineer — and the AI helps me with drafting, translation and the site's infrastructure. I review and stand behind every page.

I see it the same way I see test automation: the tool multiplies you, but [it doesn't replace your judgment](/automation/ai-in-test-automation). Knowing how to work *with* AI — giving it the right context, reviewing its output critically, and keeping ownership of the result — is part of my toolkit as an engineer.
