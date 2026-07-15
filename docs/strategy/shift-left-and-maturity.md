# Shift-left and the maturity model

**Shift-left** means moving quality activities to earlier stages of the cycle: preventing defects instead of detecting them late. The causal chain that justifies it repeats in every team that adopts it: *detect earlier → fix cheaper → deliver faster and with more confidence*.

(Its complement is **shift-right**: monitoring real behavior in production — metrics, performance, chaos engineering — to measure resilience. They don't compete; they cover opposite ends.)

## What shift-left is after

- **Shared responsibility**: quality stops being "QA's job" and becomes part of the daily work of developers, DevOps and product.
- **Testing attached to development**: unit tests, code reviews, automatic checks in CI, contract testing.
- **Smart automation**: at the base of the [pyramid](/fundamentals/the-testing-pyramid), not just late-stage UI.
- **Frequent releases with confidence.**

## The maturity model: 6 dimensions × 5 levels

To go from slogan to plan, the best thing I've used is a **maturity model**: a matrix that lets you assess where a team stands and which concrete practices move it up a level.

### The five levels

| Level | Name | In one sentence |
|---|---|---|
| 1 | **Shifted right** | Testing happens at the end; slow feedback; little testing awareness in the team. |
| 2 | **Initial** | The team knows about shift-left and takes simple steps; planning appears and documentation gets organized. |
| 3 | **Improving** | Testing activities constantly moving toward earlier stages, with metrics. |
| 4 | **Stable** | Most testing is planned and executed as early as possible; short feedback; guidelines and tooling in real practice. |
| 5 | **Shifted left** | All testing is concentrated in early stages; the team analyzes and improves its own process. |

The word that separates levels is almost always **"regular"**: the difference between level 2 and level 4 isn't *which* practices you know, but which ones are a **systematic habit** rather than an occasional heroic act.

### The six dimensions (with their key milestones)

1. **Manual testing and analysis** — from ad-hoc exploratory at the end (L1) → reviewing designs/mockups before coding (L2) → testing present in the definition conversation, dependency analysis, early exploratory (L3) → review of test specifications (L4) → regular review of automated coverage to prune obsolete and flaky tests (L5).
2. **Product definition** — no quality activity in definition (L1) → informal ACs (L2) → **ACs with product + three amigos** + user feedback in discovery (L3) → the ACs are enough to align expectations (L4) → *no functional outcome is described without its testing* + risk analysis on every feature (L5).
3. **Test planning** — nonexistent (L1) → testing time is known but not estimated in the sprint (L2) → test plan as a checklist (L3) → full test plan (non-functional, risks, dependencies) and QA capacity in planning (L4) → test plan for **every significant feature** (L5).
4. **Bug tracking** — only production bugs get logged (L1) → release fixes + backlog reviewed now and then (L2) → logging guidelines followed by everyone + early-stage bugs too (L3) → triage by severity and priority, backlog grooming, **[root cause](/strategy/bug-root-cause-analysis) for major regressions** (L4) → strict **zero bugs** policy (L5).
5. **Quality metrics** — none (L1) → production bugs and incidents (L2) → distribution by severity, by area, fixes per release (L3) → the team **acts** on the metrics + static analysis metrics (L4) → continuous improvement with goals and follow-up (L5).
6. **Reporting and documentation** — irregular documentation, no reporting (L1) → ad-hoc reporting, regression as checklists (L2) → regression up to date and understandable from the outside + knowledge base (L3) → regular reporting and validated knowledge base (L4) → **actionable quality retrospectives** (L5).

### How it's assessed

Each practice in the matrix is marked as: **Implemented · Partially implemented** (not every team adopted it — key in multi-team organizations) **· Pending** (needs to be rolled out) **· Not applicable · No info**.

The level emerges from what's in place, and the *pending* practices **are directly the improvement plan**. You don't need to reach 5 in everything: the model's value is having an honest conversation about where you are and consciously deciding the next step per dimension.

## Where to start (if you're at level 1-2)

The three practices with the best effort-to-impact ratio in my experience:

1. **Review designs and acceptance criteria before coding** (dimension 2, level 2-3) — the cheapest bug is the one that never gets written. The *three amigos* format (product + dev + QA) is enough.
2. **Log every bug with its [root cause](/strategy/bug-root-cause-analysis)** (dimension 4) — without data, improvement is just opinion-slinging.
3. **Turn each feature's manual validation into regression automation** (the phase 2 that always falls out of the sprint) — it's the only thing that breaks the vicious circle of manual testing that [doesn't scale](/fundamentals/the-evolving-qa-role).
