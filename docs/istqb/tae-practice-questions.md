# Test Automation Engineering: practice questions

Twenty **original** questions in the style of the [CTAL-TAE v2.0](/istqb/tae-exam) exam, written by me around the kind of systems I test. They're **not** official ISTQB questions and don't replace the official sample exam; they're a way to practice the syllabus on concrete scenarios. Each question shows its K-level and points, weighted like the official sample exam (K2 = 1, K3 = 2, K4 = 3).

Total: 36 points. Try them timed (about 50 minutes) and keep score: 65% is 24 points.

## Chapter 1 · Introduction and objectives

### 1. Limitations of test automation <Badge type="info" text="K2 · 1 pt" />

Which of the following is a **limitation** of test automation, rather than an advantage or a disadvantage?

- a) It gives quicker feedback on each build.
- b) It can only check results that are machine-interpretable.
- c) It requires an initial investment in tools and skills.
- d) It makes it possible to run tests that can't be run manually.

::: details Answer
**b)** Automation only verifies what it was programmed to verify, and only results a machine can interpret (and an automated oracle can decide). (a) and (d) are advantages; (c) is a disadvantage (a cost), not a limitation of what automation can do.
:::

### 2. Automation in agile teams <Badge type="info" text="K2 · 1 pt" />

How is test automation typically developed in an agile team?

- a) By a separate automation team, once each release is stable.
- b) Within the sprint, as part of the team's work on each increment.
- c) After the system test phase, to support the next maintenance release.
- d) Only at the acceptance test level, using the customer's tools.

::: details Answer
**b)** In agile, automation is built in-sprint by the team, removing the silo between development and testing. (a) and (c) describe sequential or siloed practices; (d) restricts it for no reason.
:::

## Chapter 2 · Preparing for test automation

### 3. Design for testability <Badge type="info" text="K2 · 1 pt" />

Developers add a test-only endpoint that puts the system into a given state before each test (for example, a customer with active fiber and a pending order). Which aspect of design for testability does this improve most directly?

- a) Observability
- b) Controllability
- c) Architecture transparency
- d) Interoperability

::: details Answer
**b) Controllability**: the ability to drive the SUT into the state a test needs. Observability (a) is about seeing the SUT's state and outputs (logs, status endpoints); architecture transparency (c) is about documented, understandable architecture. Interoperability (d) isn't a testability aspect.
:::

### 4. Choosing a test automation solution <Badge type="warning" text="K4 · 3 pts" />

A service-ordering system exposes a standard REST API for orders and a workflow UI where technicians complete tasks by hand. A third-party network inventory is only reachable in pre-production. The team has two testers who program and three domain experts who don't. Every release needs a regression. Which solution is the most appropriate?

- a) Record UI tests for every flow with a capture/playback tool, so the domain experts can create them.
- b) Structured, data-driven API tests maintained by the programmers, data files the domain experts can extend, the third-party inventory emulated in the lower environments, and a small set of UI tests for the technicians' tasks.
- c) Only UI tests, run in pre-production, where every integration is real.
- d) Postpone automation until the third-party inventory is available in every environment.

::: details Answer
**b)** It matches the SUT (most logic behind an API, some human UI tasks), the skills (programmers build the framework; domain experts contribute data), and the environments (emulate what's unreachable). (a) produces hard-to-maintain tests for a changing SUT; (c) makes automation depend on the one environment where it's hardest to run unattended; (d) gives up the benefit instead of emulating the dependency.
:::

## Chapter 3 · Test automation architecture

### 5. TAS, TAA, TAF <Badge type="info" text="K2 · 1 pt" />

Which statement best describes the **test automation architecture (TAA)**?

- a) The complete solution, including tools, framework, testware and adaptors to the SUT.
- b) The technical design of the solution: the tools and libraries chosen, its components, connectivity to the SUT and to other systems, and links to test and defect management.
- c) The test harness, the test libraries, the test scripts and the test suites.
- d) A high-level reference model with interfaces to project, test and configuration management.

::: details Answer
**b)** (a) is the TAS, (c) the TAF, and (d) the generic TAA (gTAA). The TAA is the *design* of your particular TAS.
:::

### 6. Layering the framework <Badge type="tip" text="K3 · 2 pts" />

In a code review you find a test script that builds an HTTP request with the core library's generic HTTP wrapper, bypassing the order API client that lives in the business logic layer. The test passes. What should the automation engineer do?

- a) Leave it: the test passes and the wrapper is reusable.
- b) Move the call behind the business logic layer (use or extend the order API client), because test scripts shouldn't call core libraries directly.
- c) Copy the HTTP wrapper into the test script so it has no dependencies.
- d) Add a new layer between the test scripts and the core libraries for this kind of test.

::: details Answer
**b)** In the three-layer framework, test scripts call the business logic, which uses the core libraries. Calling the core directly spreads SUT knowledge into tests and breaks the moment the API changes. (c) destroys reuse; (d) adds layers, when the syllabus recommends keeping them few.
:::

### 7. Choosing an approach <Badge type="tip" text="K3 · 2 pts" />

The same order-validation flow must be checked with dozens of input combinations (products, bandwidths, addresses). Domain experts who don't program want to add new combinations themselves. The framework already uses structured scripting. Which approach fits best?

- a) Capture/playback
- b) Linear scripting
- c) Data-driven testing
- d) Test-driven development

::: details Answer
**c) Data-driven testing**: it builds on structured scripting and lets people add tests by adding rows to data files, with no code. Keyword-driven testing would also let non-programmers contribute, but it's a heavy investment when the steps are always the same and only the data changes. (a) and (b) scale badly; (d) is a development practice for component-level tests.
:::

### 8. Design patterns <Badge type="tip" text="K3 · 2 pts" />

Five test scripts repeat the same sequence (open the customer, add a product, go to checkout, confirm), each one calling several page objects in the same order. Which change reduces the duplication while keeping the page objects?

- a) Make every page object a singleton.
- b) Introduce a flow model: a facade of user actions on top of the page objects, used by the scripts.
- c) Merge all page objects into one class.
- d) Copy the sequence into a base test class that every script inherits from.

::: details Answer
**b)** The flow model adds a second facade that stores user actions over the page objects, so steps are reused across scripts. (a) solves a different problem (one instance of a driver); (c) destroys the page object model; (d) couples tests through inheritance instead of composing reusable actions.
:::

## Chapter 4 · Implementing test automation

### 9. Running a pilot <Badge type="tip" text="K3 · 2 pts" />

Which pilot plan best follows good practice for a test automation pilot?

- a) Automate the easiest tests first to show quick results, and integrate with CI/CD once the pilot is approved.
- b) Build several prototypes of the candidate approaches, set a timeline with periodic progress checks, integrate into CI/CD during the pilot, assess team skills and licensing, and decide with the test manager at the end.
- c) Automate the full regression suite with the preferred tool, then evaluate the results.
- d) Let each team choose its own tool during the pilot and compare them after a year.

::: details Answer
**b)** Prototypes to compare approaches, checkpoints to catch risks early, **CI/CD integration during the pilot** (it exposes issues in the SUT, the TAS or the tool chain), non-technical factors, and an explicit success/failure decision. (a) postpones exactly the integration that reveals problems; (c) is not a pilot; (d) never converges.
:::

### 10. Deployment risks <Badge type="warning" text="K4 · 3 pts" />

Nightly UI tests run on real mobile devices in a lab. Runs fail at random, with devices going offline mid-run; the test tool updates itself automatically on the agents; and logging is set to error level only. Which mitigation plan addresses these risks best?

- a) Re-run the failed tests until they pass, and report only the final result.
- b) Monitor device power, battery and network, and keep devices charged and connected; control tool and agent updates (upgrade deliberately after checking a representative sample of tests); and raise the log level while investigating.
- c) Remove the devices from the nightly run and test only on the developers' phones.
- d) Increase every timeout in the suite to five minutes.

::: details Answer
**b)** It addresses each risk: device reliability (power, battery, network), uncontrolled updates to the harness and agents, and logging too poor to diagnose. (a) hides the problem; (c) abandons the coverage instead of mitigating the risk; (d) makes runs slower without touching the causes.
:::

## Chapter 5 · Implementation and deployment strategies

### 11. Tests that roll back a deployment <Badge type="tip" text="K3 · 2 pts" />

A team wants a deployment to be **rolled back automatically** if the system tests fail. How should the system tests be integrated into the pipeline?

- a) In a separate pipeline triggered by the successful deployment.
- b) As part of the deployment phase, after the components are deployed.
- c) In the build phase, together with the component tests.
- d) In the nightly regression, the morning after.

::: details Answer
**b)** Running them inside the deployment lets the deployment fail and roll back on their result; the price is that a rerun requires a redeployment. A separate triggered pipeline (a) isn't a quality gate, so rollback becomes manual. The build phase (c) runs before there's a deployed system to test; (d) is too late to gate anything.
:::

### 12. Matching testware to releases <Badge type="info" text="K2 · 1 pt" />

Different releases of the SUT are deployed in different environments at the same time, and each release has a different feature set. How can the team make sure each environment runs the tests that correspond to its release?

- a) Always run the latest version of the testware everywhere and ignore the failures of unreleased features.
- b) Release the testware with the same version as the SUT (for example, with tags), so each SUT version is tested by the matching testware.
- c) Keep a single test suite and disable failing tests by hand in each environment.
- d) Create a copy of the test repository for each environment.

::: details Answer
**b)** Versioning testware with the SUT (tags or branches) gives an exact match between each SUT version and the testware that tests it. Feature toggles per release or environment are the other valid option. (a) and (c) turn every run into noise; (d) multiplies maintenance.
:::

### 13. Contract testing <Badge type="info" text="K2 · 1 pt" />

What does contract testing add beyond validating API responses against a schema?

- a) It checks response times under load.
- b) Both parties agree on the allowed interactions, captured in a contract that each side is verified against, which lets the integration evolve safely.
- c) It replaces the need for component tests on each service.
- d) It validates the user interface that consumes the API.

::: details Answer
**b)** A schema says what a message looks like; a contract captures the interactions both services agreed to, consumer-driven or provider-driven, and verifies both sides against it. (a) is performance testing; (c) and (d) are unrelated.
:::

## Chapter 6 · Reporting and metrics

### 14. Analyzing a failed nightly run <Badge type="warning" text="K4 · 3 pts" />

In last night's regression, 180 of 200 tests failed between 02:10 and 02:25 with timeouts, across unrelated features. The SUT logs show the inventory service unavailable during that window. A rerun at 08:00 passes. What is the best conclusion and next step?

- a) Log a defect for each of the 180 failed tests, with its screenshot.
- b) Treat it as an environment outage: confirm it with the SUT logs, report the outage once, and consider an environment health check before the suite starts.
- c) Quarantine the 180 tests as flaky.
- d) Conclude the SUT has a performance defect and open a performance ticket.

::: details Answer
**b)** Many unrelated tests failing in the same window, with the SUT logs showing a dependency down, points to the environment, not to 180 defects. (a) floods the tracker; (c) removes good tests from the suite; (d) jumps to a conclusion the data doesn't support.
:::

### 15. Tracing a request through the system <Badge type="tip" text="K3 · 2 pts" />

An automated API test fails after an order crossed five microservices. Which enhancement to the framework's core library would help most to trace what happened to that request?

- a) Take a screenshot at the end of every API test.
- b) Send and log a correlation (trace) ID with each request, so it can be followed through the SUT's logs.
- c) Log only the failed assertions.
- d) Reduce the logging level to error to keep the logs short.

::: details Answer
**b)** A correlation ID travels with the request and every service logs it, so the test log can be joined with the SUT logs. And because it's in the core library, every test gets it. (a) is useless for an API test; (c) and (d) remove exactly the information you'd need.
:::

## Chapter 7 · Verifying the test automation solution

### 16. An unreliable test <Badge type="info" text="K2 · 1 pt" />

A test fails about one run in ten because of a race condition in the test itself. What should be done?

- a) Add automatic retries until it passes.
- b) Move it out of the active suite and analyze it separately to find the root cause.
- c) Increase the global timeout of the suite.
- d) Keep it in the suite: an occasional failure is normal.

::: details Answer
**b)** Tests that don't give repeatable results are taken out of the active suite and investigated apart. Otherwise the team keeps spending time on the same false failures, and trust in the suite drops. (a) and (c) hide the problem; (d) accepts it.
:::

### 17. Static analysis of test code <Badge type="info" text="K2 · 1 pt" />

A static analysis scan of the test repository flags a password written in plain text in several test scripts. How should this finding be treated?

- a) Ignore it: test code isn't deployed to production.
- b) As a real security violation: move the credential to a secrets store or environment configuration, rotate it, and keep scanning test code in the pipeline.
- c) Disable the rule for the test repository.
- d) Encode the password in Base64 inside the scripts.

::: details Answer
**b)** Test code is code, and a plaintext credential in it is a security issue whether or not it ships with the product. Static analysis should cover the automation code too. (d) isn't protection: Base64 is an encoding, not encryption.
:::

## Chapter 8 · Continuous improvement

### 18. Waiting for asynchronous orders <Badge type="warning" text="K4 · 3 pts" />

A deployed TAS for a service-ordering system uses about 300 fixed sleeps to wait for orders to change state, and runs are both slow and flaky. The SUT publishes order state changes on a message broker that the TAS can subscribe to. Which recommendation is best?

- a) Double every sleep to reduce the flakiness.
- b) Subscribe to the SUT's order events, with a timeout, and use polling with a timeout where no event is available.
- c) Remove the waits and retry each failing step three times.
- d) Poll the order state every 100 ms with no timeout, so no test ever fails on timing.

::: details Answer
**b)** From least to most reliable: hardcoded waits, polling with a timeout, subscribing to SUT events with a timeout. Events are the best option when the SUT offers them; polling is the fallback. (a) makes runs slower and is still fragile; (c) masks timing problems; (d) can wait forever if there's a defect: every wait needs a timeout.
:::

### 19. Using run history <Badge type="tip" text="K3 · 2 pts" />

The CI server keeps the results of every test for the last 30 nightly runs. Which use of this data best supports improving the test cases?

- a) Delete the tests that failed most often.
- b) Build a test histogram to identify fragile tests (those that alternate between pass and fail without SUT changes) and refactor or rethink them.
- c) Rerun the suite until the whole history is green.
- d) Report only the overall pass rate to management.

::: details Answer
**b)** A test histogram shows which tests are fragile, so they can be refactored or reimplemented. Tests that fail often may be finding real defects (a); (c) and (d) throw away the information.
:::

### 20. Restructuring after a SUT change <Badge type="tip" text="K3 · 2 pts" />

A new SUT release replaces the date picker on 40 screens with a new component. The TAS has date-picker handling duplicated, with small variations, in six page objects. What is the best way to restructure the testware?

- a) Patch each of the six copies separately to match the new component.
- b) Consolidate the handling into one parameterized function for that control type in the business logic layer, change it incrementally, verify it, and then run the full regression.
- c) Rewrite all the tests that use a date.
- d) Add a new framework layer just for date handling.

::: details Answer
**b)** Consolidating functions that act on the same type of control, parameterized for the variations, reduces maintenance now and at the next change; incremental change followed by a full regression limits the risk. (a) keeps the duplication; (c) is disproportionate; (d) adds a layer where a library function is enough.
:::

::: tip How to use these
Get the answer *and* the reason. If you picked the right option for the wrong reason, count it as wrong: in the real exam, the distractors are built from exactly those half-understood reasons.
:::
