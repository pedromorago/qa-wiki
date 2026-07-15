# Acceptance criteria and Definition of Ready

The two artifacts that decide a feature's quality **before a single line of code is written**. As a QA, they're my main shift-left tool: the better we define, the less we second-guess — and the fewer bugs get born.

## Acceptance criteria (AC)

The conditions the software must meet to be accepted by the user, the client or other systems. Unique per story, and written **from the end user's perspective**.

### The non-negotiable properties

- **Pass/fail**: they're either met or they're not. *Never* "halfway".
- **Clear, concise and testable.** If it can't be verified, it's not an acceptance criterion.
- They describe the **what**, never the **how** of the solution.
- They're written **before** development starts and finalized during refinement. ACs written after the code aren't criteria: they're minutes of what happened.

### What they're for (besides testing)

1. **Delimiting scope** — when the story is complete.
2. **Describing the negative scenarios** — how the system reacts to invalid input. The happy path defines itself; ACs are worth gold for the sad paths.
3. **Syncing** client ↔ team: devs know what to build, stakeholders know what to expect.
4. **Enabling acceptance testing** — each criterion independently testable.
5. **Allowing the story to be estimated and split.**

### Two valid formats

**Given/When/Then** (a BDD inheritance) — my favorite when the behavior has clear states and actions:

```
Scenario: Login with wrong password
  Given a registered user with email ana@example.com
  When they enter a wrong password 3 times
  Then the account is temporarily locked
  And the account-locked message is shown
```

Extra advantage: if the team uses a BDD framework, the format is already familiar — dev-QA alignment for free.

**Rule-oriented** — a simple list of behavior rules, from which the scenarios are later derived. Better for features with many rules and few interactions.

The non-negotiable part isn't the format: it's that what's expected is made clear.

### Distinctions that prevent arguments

| | What it is |
|---|---|
| **AC** | The **what** that must be met (per issue) |
| **Testing steps** | The **how** to check it's met |
| **DoD** | Checklist **common to all** issues (green pipeline, docs, merged…) |
| **DoR** | What's needed to **start** (see below) |

And a small, brilliant rule: analysis/spike tickets **don't carry ACs — they carry the questions** the analysis must answer.

### Making it happen (enforcement)

Guidelines that depend on goodwill last two sprints. What works:

- AC template/checklist **auto-included by issue type** in the ticket manager.
- **Validator on the workflow transition**: you can't move to "Delivered" with unchecked AC items.
- Linking each criterion to **the tests that verify it** — evidence, not promise.
- AI to draft them? As a **draft** for the team to refine, never as the final result — and never feeding it sensitive information.

## Definition of Ready (DoR)

The DoR answers: is this task ready to be **started**? It's the mirror image of the DoD. It's defined on the **parent tasks** (epics, stories), not on the subtasks — single source of truth.

### The checklist, with its owner

| Item | Who answers | What it guarantees |
|---|---|---|
| **Value proposition** | Product manager | Who the stakeholder is, what problem is solved, what's **out** of scope, priority, release notes?, demo?, UX review? |
| **ACs defined and agreed** | **QA** | The benchmark for considering the task complete. QA guarantees the ACs *exist* (even if they're written as a team). |
| **UX design and specs** | Design | Changes detailed and linked, clear for engineering. |
| **Reviewed by backend** | Backend | Doubts resolved, technical notes: permissions, auditing, architecture/security review?, affected components. |
| **Reviewed by frontend** | Frontend | Same as above. |
| **Stakeholders notified** | Team lead | DevOps? Support, sales? Other teams? |

### The anti-waterfall warning

The DoR exists to **avoid blockers during development**, not to turn refinement into a six-week requirements phase. Sometimes it's fine to start with uncertainty and learn along the way; not every item applies to every ticket. The content matters; the format doesn't.

::: tip QA's role in all this
If a ticket reaches refinement without ACs, **raising your hand is QA's job**. It's the cheapest bug you'll ever catch: it doesn't exist yet.
:::
