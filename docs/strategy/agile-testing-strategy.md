# Agile testing strategy

How testing integrates into an agile product team so that **there is no separate "testing phase"**: every feature is validated as part of its own development, and by the time it's closed it's ready to ship.

## The philosophy

- Continuous testing is part of development, **on the same level as writing code**.
- **Real shift-left: testing starts when the story is written**, not when there's code.
- Automation exists to reduce human error and gain coverage and speed. *Earlier means faster*: detect sooner = fix cheaper = deliver faster.
- Operational goal: no critical bug shows up on deploy that forces the cycle to start over.

## The lifecycle of a feature, with testing inside it

### 1. Technical refinement (shaping)

The team defines the initiative's main flows. Out of this ceremony comes **a QA analysis task** with three goals:

1. Analyze the initiative's behavior.
2. Generate the necessary tests **at every layer that applies** and add them to the regression plan.
3. Automate them.

The key point: the **regression plan stays alive** — every initiative feeds it, and the freshly added tests are, precisely, the automation backlog. There is no separate list that drifts out of date.

### 2. Development

- **The feature's developer tests their own acceptance criteria** — they define the tests and the information needed to run them. This is the feature's *progression testing*.
- The **reviewer** validates the behavior and adds tests if they spot gaps.
- In parallel, **regression** runs to protect what already exists: once on the pull request, again when merging into the main branch.

### 3. Release

Each release bundles already-validated features that get promoted through the environments. Validations are scaled per stage ([dedicated article](/cicd/environment-validations)).

## Who owns testing? (RACI)

The million-dollar question in agile teams. The answer that has worked best for me:

- **Any role can be *responsible*** for executing a feature's validation (creating cases, running them, automating them). The *test owner* doesn't have to be QA.
- **QA is always *accountable***: they answer for the validation being done according to the strategy and sign off on the result.

QA stops being the bottleneck that runs everything and becomes **the guarantor of the process**: they define the strategy, facilitate it, and watch over it.

## An operational definition of "automated"

> A test case is only considered automated when **it runs in CI/CD inside the pipelines**.

Having the script isn't enough: if it's launched by hand, it's not automation — it's a manual test with extra maintenance. Each case's automation state is tracked in the test case manager (an "automation status" field), which makes it possible to know at any time what's automated, what's planned, and what isn't automatable.

## Test types by lifecycle

Beyond the classic catalog, there's one category I find especially useful:

| Type | What it is |
|---|---|
| **Smoke** | Verifies the app is properly deployed and communicating with its dependencies. It's a *deployment* test more than a functionality test. |
| **Sanity** | The core functionality, free of bugs. Formally: a **subset of regression**. |
| **Regression** | What existed before still works after every change. |
| **Progression** | **The new tests for a feature under development.** A *transitional* category: when the feature closes, each test either gets promoted to smoke/sanity/regression (and automated) or dies with the validation. |

That lifecycle — every test is born as *progression* and a conscious decision is made about promoting it — avoids both the gaps ("nobody moved this case to regression") and the infinite regression suite ("we keep every test forever").
