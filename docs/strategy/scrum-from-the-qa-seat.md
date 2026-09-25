# Scrum from the QA seat: ceremonies, estimation and metrics

The [agile testing strategy](/strategy/agile-testing-strategy) describes where testing fits in the cycle. This page is the day-to-day version: what a QA actually does in each ceremony, how estimation should account for testing, and which team habits make or break the flow into QA. Most of it comes from joining a consultancy with several Scrum teams, two-week sprints and a well-documented way of working.

## Refinement: where QA earns its keep

Refinement is the cheapest place to find bugs, because they don't exist yet.

- **Ask "how would you test this?"** Test design is part of refinement, not something that starts when the story reaches QA. Badly written acceptance criteria are paid for at execution time.
- **The PO writes the acceptance criteria, but improving them is collaborative.** QA can and should propose extra criteria, especially for the unhappy paths. Criteria are increasingly drafted with AI; refinement is the filter that catches the generic scenario nobody actually needs.
- **Identify E2E impact with the PO**: which [critical flows](/strategy/what-e2e-tests-should-cover) the story can touch.
- **Split what doesn't belong together.** If the client packed two unrelated requests into one story, split it before anyone starts.
- **Surface side requests.** Requests the client makes directly to a developer, outside the backlog, have to reach the PO.

## Planning: ready, sized and believed

- **Definition of Ready as a gate**: no story enters the sprint without a parent epic, dependencies resolved, clear goal and value, enough technical information, UX validation if it touches the front end, acceptance criteria in **Given/When/Then**, the use cases specified, and an estimate **of 13 points or less** (above that, split it). The [DoR article](/strategy/acceptance-criteria-and-dor) covers the reasoning.
- **Ask for client-dependent test data now.** If a story needs the client to prepare a scenario, request it in planning, not when the story reaches "Ready for QA".
- **Plan with real capacity**, holidays included.
- **Close with a confidence vote.** Everyone rates the plan from 1 to 5; if the average is below 3, the plan is reworked and voted again. It's an explicit brake on over-commitment, and it works.

## Estimation that includes testing

- **Story points are calibrated per team** and can't be compared across teams. In one team, 8 points was roughly one person for a whole sprint, and that rule decided what fit.
- **Testing is part of the estimate.** A task always carries at least the developer's effort *and* the tester's. What deserves the minimum is negotiated per team (trivial configuration changes were the eternal debate).
- **Estimate for the person who'll do it.** The same task was a 3 for the person who built that front end and a 5 for someone who'd never touched it. Points reflect the effort of whoever does the work.
- **Points don't change once the sprint has started.** Raise objections before.
- **Spikes are time-boxed**: you decide how much to invest (typically one or two days, like Shape Up's *appetite*), not how long it will take. The output is documented knowledge that turns into better-defined stories, and **a spike closes with a decision**. It doesn't just fade out.

## During the sprint: keep the flow into QA continuous

- **Hand work to QA continuously**, not in a heap at the end of the sprint. If everything reaches QA in the last two days, cycle time explodes and quality becomes a bottleneck. Small units help: they give visibility and let testing start earlier.
- **Close what's open before pulling from the next sprint**, without working on several things in parallel.
- **Respect the workflow.** Nothing reaches "Ready for QA" without having been "In Progress", and the handover goes through the merge request: review, approve, then Ready for QA. A task that fails validation goes back to In Progress.
- **"It worked in my tests" doesn't close a ticket.** Without QA there's no closure.
- **Don't send anything to review with doubts.** If it isn't clear what a feature should return, ask the PO and the developers instead of approving out of insecurity. And a test isn't complete if it depends on something that hasn't been switched on yet: ask what happens when it is.
- **A blocked task always gets a comment**: what blocks it and who you're waiting for.

## The daily: progress towards the goal

Since the 2020 edition, the [Scrum Guide](https://scrumguides.org/scrum-guide.html) defines the Daily Scrum as a 15-minute event for the developers to **inspect progress towards the Sprint Goal** and adapt the plan. The three classic questions (yesterday, today, blockers) are no longer part of it; they're an optional technique. It's not a status report to the PO or the manager.

What I try to say, in about thirty seconds:

- What moved **towards the goal** (completed or unblocked, not a list of everything I did).
- What will move today.
- **Impediments and dependencies**, the most valuable part, because it's what the team can solve.
- Whether the plan must change because something puts the goal at risk.

And some team conventions I've found useful: keep your assignments in the tracker up to date *before* the daily; in each team's daily, report only that team's work, even when you're on loan to it; if you're running out of tasks two days before the end, that's a topic for the daily too.

## Review: separate what's done from what's assumed

- Prepare the review by separating **what was actually done and verified** from what's assumed to work.
- **Blockers that depend on the client** (preparing test scenarios, access) are recorded in the review, where they're visible to the people who can unblock them.
- **Metrics are objective feedback, not a way to point at people.** They're not rankings, they're not absolute, and they don't replace the conversation. They're a starting point to detect imbalances.

## Retrospective: actions with an owner

- Every retrospective is **documented** and ends with **actions, each with an owner and follow-up**.
- The owner is **whoever makes sure the action happens**, not necessarily whoever executes it. That's what keeps collective actions from being orphaned. At the next review, the owner reports its status as a traffic light.

## Team metrics without the dark side

- Throughput and velocity are only comparable once **normalized**: by the days of the sprint and by the number of developers (weighted by seniority, when they set the pace).
- A quarterly consolidation (a spreadsheet fed by the tracker's API, scored 0–5 per dimension) is enough to see trends without turning metrics into surveillance.
- A useful cycle-time diagnostic: *does everything reach QA at the end of the sprint?*

## Absences and handovers

- **Nobody goes on holiday without documenting**, and writing down what's pending is what decides whether a task is closed or handed over. (And no, the documentation doesn't get delegated to a free AI tool with company data in it.)
- **Shield the end of the sprint against absences**: close earlier and delegate the handover.
- When holidays threaten a delivery, **degrade the goal explicitly**, from "tested" to "at least deployed", instead of pretending.

::: tip Key idea
QA's leverage in Scrum is upstream: in refinement (testable criteria), in planning (data and capacity for testing) and in the flow (work arriving continuously). By the time a story reaches "Ready for QA", most of its quality has already been decided.
:::
