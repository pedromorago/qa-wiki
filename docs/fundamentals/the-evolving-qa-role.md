# The evolving QA role

What is quality, who produces it, and where is the QA role headed? My take, built on one central idea: **manual testing as the core of the role doesn't scale** — and the way out isn't testing more, it's changing your position in the process.

## What quality (really) is

The formal definition: the degree to which a product meets functional and non-functional requirements, ensuring reliability, efficiency, and maintainability. Correct, and not very useful. The operational version that works for me stands on two legs:

1. **Knowing the user** — knowing how they use the product and what they need to do with it.
2. **Responding fast** — the ability to react to those needs.

And one idea that changes everything: final quality is the **sum of all the teams and processes involved**. *"It's an aggregation of small gains that produces a high-quality workflow — and a quality workflow is what produces a quality product, not isolated actions."* There's no QA hero who can make up for a broken process.

## The manual testing trap

The "classic" QA concentrates their activity on testing during development and re-testing at release. The problem, as a chain reaction:

1. Manual testing **doesn't scale**: its capacity is the number of people.
2. QA, being responsible for automation, **has no time to automate** — manual work eats it all.
3. Result: more manual testing → slower deliveries → more pressure → more manual work. A vicious circle.

### Measure your process before arguing about it

An exercise I recommend to any team: break down what it *really* costs to validate a ticket. In one real, measured case:

| Validating a sprint ticket | Time |
|---|---|
| Best case (everything flows) | ~2.3 h |
| Worst case (bug + merge conflicts) | ~6 h |
| **Average** | **~4 h** |

(Reading the ticket 10 min, setting up the environment 15, running the cases 1 h, aligning with dev 30 min… and if there's a bug: verifying it, discussing it, documenting it, re-testing the fix.)

With data like this, the "QA is a bottleneck" conversation stops being an opinion and becomes an optimization problem: classify your tasks by **effort × frequency** and attack the dominant cell. It's almost always the manual validation of features — which is why phase 2 of every ticket (automating what was tested by hand) is non-negotiable.

## The four axes of the evolution

1. **Early integration** — participating in requirements, design, and planning from the start ([shift-left](/strategy/shift-left-and-maturity)).
2. **Continuous testing** — automation + CI/CD so you can test at any stage.
3. **Focus on business value** — concentrating tests where they have the most impact for the customer, not where it's most convenient to test.
4. **Data-driven decisions** — metrics: QA as the expert at detecting the process's strengths and weaknesses ([root cause](/strategy/bug-root-cause-analysis), quality metrics).

## Responsible vs Accountable: the map of the role

The distinction that puts everything in order: **responsible** does the work; **accountable** answers for it being done well and signs off on the result.

| Activity | QA's role |
|---|---|
| Clear requirements in tickets | **Accountable** |
| The team's testing strategy | **Accountable** |
| The feature working (tests: identify, run, code, maintain) | **Accountable** — execution can be shared with dev |
| Getting the release ready | **Responsible** (dev can too) |
| Performance and its monitoring | **Accountable** |
| Raising testing blockers and pain points, **quantified** | **Accountable** |
| Visibility of quality (metrics, gaps, strategy) | **Accountable** |

The pattern is clear: the future of QA is being **accountable for the quality system** — enabling the team (coaching, pair testing, workshops), automating, measuring — and keeping direct execution only where it truly adds value. From verification bottleneck to **multiplier of the team's quality**.

::: tip In one sentence
The QA who only runs tests is competing with a script. The QA who designs the system that prevents, detects, and measures — that one has no substitute.
:::
