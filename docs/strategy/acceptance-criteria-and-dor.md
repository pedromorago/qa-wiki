# Acceptance criteria and Definition of Ready

The two artifacts that decide a feature's quality **before a single line of code is written**. As a QA, they're my main shift-left tool: the better we define, the less we second-guess — and the fewer bugs are born.

## Acceptance criteria (AC)

The conditions the software must meet to be accepted by the user, the client or other systems. Unique per story, and written **from the end user's perspective**.

### The non-negotiable properties

- **Pass/fail**: they're either met or they're not. *Never* "halfway".
- **Clear, concise and testable.** If it can't be verified, it's not an acceptance criterion.
- They describe the **what**, never the **how** of the solution.
- They're written **before** development starts and finalized during refinement. ACs written after the code aren't criteria: they're minutes of what happened.

### What they're for (besides testing)

1. **Delimiting scope** — when the story is complete.
2. **Describing the negative scenarios** — how the system reacts to invalid input. The happy path defines itself; ACs are worth their weight in gold for the sad paths.
3. **Syncing** client ↔ team: devs know what to build, stakeholders know what to expect.
4. **Enabling acceptance testing** — each criterion independently testable.
5. **Allowing the story to be estimated and split.**

### Two valid formats

**Given-When-Then** (a BDD inheritance) — my favorite when the behavior has clear states and actions:

```gherkin
Scenario: A viewer tries to edit a countermeasure
  Given a user with the viewer role on the "Payments" project
  When they try to change a countermeasure's status to "applied"
  Then the change is not saved
  And the insufficient-permissions warning is shown
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
| **Value proposition** | Product manager | Who the stakeholder is, what problem is solved, what's **out** of scope, priority, and whether release notes, a demo or a UX review are needed |
| **ACs defined and agreed** | **QA** | The benchmark for considering the task complete. QA guarantees the ACs *exist* (even if they're written as a team). |
| **UX design and specs** | Design | Changes detailed and linked, clear for engineering. |
| **Reviewed by backend** | Backend | Doubts resolved, technical notes: permissions, auditing, architecture/security review?, affected components. |
| **Reviewed by frontend** | Frontend | Same as above. |
| **Stakeholders notified** | Team lead | DevOps? Support, sales? Other teams? |

### Another team's DoR, for comparison

On a later project the DoR was shorter and stricter, and it worked as a real gate: **no story entered sprint planning** without a parent epic and its dependencies resolved, a clear goal and value, enough technical information to start, UX validation if it touched the front end, documentation with examples where possible, **acceptance criteria in Given-When-Then**, the use cases specified, and an estimate of **13 story points or less** (above that, it gets split). Stories followed INVEST. For QA it's the first line of defense: if the criteria aren't in Given-When-Then, the story isn't ready.

### The anti-waterfall warning

The DoR exists to **avoid blockers during development**, not to turn refinement into a six-week requirements phase. Sometimes it's fine to start with uncertainty and learn along the way; not every item applies to every ticket. The content matters; the format doesn't.

## QA's own Definition of Done

Besides the team's DoD, QA can bring its own checklist to every story. The one I use:

- Every acceptance criterion **validated by its functional tests**.
- **Happy and unhappy paths executed.**
- **Integration tested**, not just the component in isolation.
- **Risks identified** and written down.

Two rules complete it. **A story doesn't move to Review with tests not run or a defect of its own still open**, unless the PO explicitly accepts the risk, and then the untested scenarios and the reason are written down (that's the difference between accepting a risk and hiding it). And **if the team implements the opposite of what a criterion says** (because it turned out to be the right call), write it in the story before closing it. Otherwise the next person to test it will raise a bug against a decision.

::: tip QA's role in all this
If a ticket reaches refinement without ACs, **raising your hand is QA's job**. It's the cheapest bug you'll ever catch: it doesn't exist yet.
:::
