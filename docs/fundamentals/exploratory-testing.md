# Exploratory testing

**Exploratory testing** means testing software while learning, designing and executing tests **at the same time**: every result you observe feeds the next test you come up with. It is not "clicking around to see what happens" — it's a structured technique, and one of the best at finding interesting bugs.

## Exploratory vs. scripted

| | Scripted testing | Exploratory testing |
|---|---|---|
| Cases are designed | Before execution | During execution |
| Guided by | The test case | The behavior you keep observing |
| Strength | Repeatable, traceable, automatable | Finds what nobody thought to write down |
| Weakness | Only finds what was anticipated | Hard to repeat if you don't document |

They don't compete: they complement each other. Automation checks what you already know must work; exploration hunts for what you **don't know can fail**.

## Charter-based sessions: the structure

The most practical way to explore with rigor is **session-based testing**: time-boxed sessions with a written mission, the *charter*. A template that works (from Elisabeth Hendrickson):

> **Explore** *(an area of the product)* **with** *(resources, tools, data)* **to discover** *(what information you're after)*.

Examples:

- *Explore the diagram editor with nested components to discover problems when moving elements.*
- *Explore importing a large threat model with two tabs at once to discover race conditions.*

The session: **60–90 minutes**, uninterrupted, taking notes as you go (what you tried, what you saw, what you left unexplored). When it ends, a short debrief: bugs found, risks spotted, new charters that emerged along the way.

## Heuristics so you never go blank

When you don't know where to go next, a heuristic gives you new angles. **SFDPOT** (by James Bach) is a good starting point — look at the product from six sides:

- **S**tructure — what the product *is*: components, files, dependencies.
- **F**unction — what the product *does*: every function, including the secondary ones.
- **D**ata — what the product *processes*: inputs, outputs, boundaries, empty values, unicode, the huge.
- **P**latform — what the product *depends on*: browser, operating system, permissions, network.
- **O**perations — *how it's used*: real user profiles, odd-but-legitimate flows.
- **T**ime — *when*: concurrency, timeouts, time zones, before/after a migration.

## When to explore

- **New features** with ambiguous or missing specs: exploring is the fastest way to understand what was actually built.
- **Before a release**, as a complementary sweep to the automated regression.
- **While investigating a bug**: reproducing it is, at heart, an exploratory session with a very narrow charter.
- **When joining a new product**: there's no better onboarding than exploring it with notes.

## Common mistakes

- **Exploring without a charter.** Without a mission you're wandering within ten minutes. Exploratory freedom works *inside* a frame.
- **Not taking notes.** A bug you can't reproduce because you didn't write down the path is a half-lost bug.
- **Treating it as filler.** "If there's time left, we'll explore" means you never explore. Sessions get planned like any other testing activity.
- **Not reporting the session.** The output isn't just bugs: it's information — risks, fragile areas, open questions. Share it.

::: tip Key idea
Automation checks what you already know; exploration discovers what you don't. A product with only automated tests is protected against the past, not against surprises.
:::

## References

- Elisabeth Hendrickson — *Explore It!* (Pragmatic Bookshelf), the reference book on charters and sessions.
- [James Bach — Session-Based Test Management](https://www.satisfice.com/blog/archives/category/session-based-testing)
- [ISTQB Glossary — exploratory testing](https://glossary.istqb.org/)
