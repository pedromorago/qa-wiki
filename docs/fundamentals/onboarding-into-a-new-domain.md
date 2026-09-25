# Onboarding into a complex domain

Changing jobs as a QA engineer often means changing domains too. The testing skills travel; the vocabulary, the systems and the unwritten rules don't. When I moved from SaaS products to a telecom OSS project, I had no telecom background, dozens of acronyms per meeting and several teams' worth of conventions to absorb. This is what made the first months productive instead of overwhelming.

## Make the domain concrete

- **Translate every flow into an everyday example.** The most useful advice I got, from a colleague who had also arrived with no telecom experience: think of each technical flow as a customer (and as a technician) of an operator you know. Contracting the line, receiving the router, the installation visit. Abstract flows stick once they're attached to something you've lived.
- **Go little by little, and lean on a glossary.** Build your own as you go, in your own words: writing the definition is the test of whether you understood it.
- **Use the standards as maps.** Many domains have reference models that explain the landscape faster than any internal document. In telecom, [TM Forum's eTOM, Functional Framework and SID](/telecom/oss-bss-for-qa#tm-forum-the-industry-standard) describe processes, functions and data with the same structure.
- **Learn on a real task.** A guided tour of the tools on an actual ticket puts things in order far better than reading loose documentation.

## Study training material actively

Recorded sessions and demos are a gold mine if you treat them as a QA engineer would treat a spec:

- **Come back with contradictions, not just notes.** "In onboarding session X you said A, and in session Y B: did the information cross, or did I misunderstand?" Detecting inconsistencies between sources is QA muscle applied to your own learning, and it improves the material for the next person.
- **Mark doubts explicitly** in your notes (I use `(?)`) so you know what still needs confirming before you rely on it.
- **Read the whole story, not just its acceptance criteria**, and be meticulous with small details: if a criterion says `NETWORK_A` and the value arrives without the underscore, it doesn't meet it.

## Know your role before you act

- **Don't send anything to review with doubts.** Stories don't always arrive fully refined and the client doesn't always give you everything. Ask the PO and the developers instead of approving out of insecurity. Raising your hand is part of the job.
- **Testing just to test doesn't count.** When I worked as a cross-team QA engineer, it was tempting to explore another team's story that looked under-tested. But that effort hung from no test plan (so it didn't count or show), it stepped on the work of that team's QA, and any bug found arrived without context. The right move: **propose the missing cases** to the team's QA or PO, let them decide whether they enter the plan, and run them once they're assigned. Free exploration prepares the proposal; it doesn't replace it.
- **Proposing changes from outside is part of the job**, not an intrusion, as long as they go through the people who own the process.

## Capture what you learn, the same day

Most of this wiki started as a private note taken the day I learned it. The system that works for me:

- **One learning per note, titled with the lesson itself**: "The inventory is the truth, not the order", not "Meeting 12/08".
- **A type**: concept, lesson, test idea, or process.
- **The source**: the meeting, video, document or ticket it came from, so it can be checked later.
- **A confidentiality level**: private, *genericizable* (useful if you strip names), or publishable. That's what decides whether it can become a public article. On a client project, the default is private.
- **A retrieval question and a review date** for the ones worth memorizing: spaced review beats rereading.

## Using AI tools during onboarding

- **Check the policy before uploading anything.** Putting an internal recording or client documents into a personal AI account means taking corporate data to an external service. Ask first, especially if the company is going through a security certification.
- **Know what the tool actually reads.** Some notebook-style assistants only import a video's **audio transcript**: anything shown only on screen (a portal, a diagram, a slide, a form) is lost. For slide-based sessions, the original deck is a better source than the recording; for screen demos, screenshots of the key moments plus the transcript work well with assistants that accept images.
- **Feed tabular exports, not PDFs.** Exporting stories from the issue tracker to a spreadsheet is almost instant and gives the model a clean table; PDF exports are slow and can freeze a modest laptop. (Connectors that read the tracker directly make this unnecessary for small batches.)
- **Fix the project's terminology first.** When documenting with AI, give it a base document with the project's terms and constrain its answers to it. Otherwise it will "correct" your domain vocabulary into something generic. And if you generate stories or criteria with AI, force the team's template so the backlog stays consistent.

## Documentation as a deliverable

- *"I'd rather have less analysis, well documented."* A manager's phrase that stuck with me: the documentation **is** the deliverable.
- **Nobody goes on holiday without documenting**, and writing down what's pending before you leave is what decides whether a task gets closed or handed over.

::: tip Key idea
Treat a new domain like a new system under test: build a model of it (examples, glossary, standards), look for contradictions in the sources, and write down what you learn while it's fresh. The notes you take in the first month are the documentation the next newcomer will wish existed.
:::

## Related

- [OSS/BSS for QA](/telecom/oss-bss-for-qa): the map of the telecom domain.
- [The evolving QA role](/fundamentals/the-evolving-qa-role)
