# When to automate (and when not to)

Automation isn't free: every automated test is code you have to write, maintain, and trust. The right question isn't "can I automate this?" but "is it worth it?".

## Good candidates

- **Regression**: tests that repeat on every release. The number one use case.
- **Critical business flows**: login, sign-up, checkout, payment. The things that can never break.
- **Repetitive data**: the same flow with 50 data combinations (data-driven testing).
- **Smoke tests**: the minimal battery that runs on every deployment.
- **Anything tedious and prone to human error**: calculations, bulk comparisons, data preparation.
- **What's impossible to do manually**: load, performance, concurrency.

## Bad candidates

- **Unstable functionality or features in flux**: automating on quicksand = rewriting tests every sprint.
- **Tests that will run only once**: the cost never pays off.
- **Usability, "eyeballed" visual design, user experience**: these require human judgment.
- **Exploratory testing**: by definition, it can't be scripted.
- **Flows with uncontrollable external dependencies** (third parties with no test environment): better a contract/mock, or leave it manual.

## The mental ROI math

```
Manual cost     =  (time to run by hand) × (number of times it will run)
Automation cost =  (time to build it) + (maintenance) × (lifetime of the test)
```

If the flow is tested on every release, two releases a month, and it takes 15 minutes by hand… that's 6 hours a year. If automating it costs 3 hours and it's stable, it pays off handsomely. If the flow changes every month and the test needs tweaking every time, probably not.

## Signs that an automated suite is going wrong

- **Flaky tests** (passing or failing at random): they're worse than having no tests at all, because they destroy trust in the entire suite. A flaky test gets fixed or deleted, never ignored.
- Nobody looks at the results; failures get re-run "to see if it passes this time".
- The suite takes so long that it runs "every now and then" instead of on every change.
- Tests verify implementation details (fragile selectors, exact text) instead of behavior.

## Automation doesn't replace QA

Automated tests **verify what we already know** should work; they're a safety net against regressions. Finding new bugs is still the job of test design and exploration. Automation buys you the *time* to do that work — that's its real return on investment.
