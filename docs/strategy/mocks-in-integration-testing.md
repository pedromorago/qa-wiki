# Mocks in integration testing: useful, and they lie

When your system talks to a vendor's product, a client's inventory, a network provider and an IP registry, you can't wait for all of them to be available, consistent and in the right state for every test. Mocks make testing possible. They also create a parallel world where things pass that would fail in reality, and fail in ways reality never would. These are the lessons from an integration project where most environments ran on mocks.

## First, know which world you're in

- **With mocks**, data is predictable and behavior controlled: you're validating **your own logic**.
- **With real integrations**, data is scarce and behavior messy: this is where **integration problems** show up.

A result means something different in each world. Before concluding anything from a test, know which of your dependencies were real. See [what each environment can prove](/strategy/test-environments-strategy).

## Designing mocks that don't lie

- **Mock per integration, not per story.** One mock covers the whole conversation with a third party: a cancellation with two possible responses is *one* mock with many stories behind it. Trace it the other way round: each E2E flow is linked to the mocks it needs.
- **Every development needs its mock at the same time.** Otherwise the development environment can't test it at all. Update a mock **within the task that makes it stale**, not in a separate task that never gets prioritized. Mocks age with the configuration: we once found there was no mock for a *modify* simply because that use case didn't exist when the mocks were written.
- **Respect the real system's invariants.** A mocked provider that always returned the same order key filled the database with duplicates and produced search errors that were impossible with the real integration, which guarantees uniqueness. Imitate the rules too: uniqueness, formats, sequences. Otherwise the environment lies in both directions.
- **Make them data-driven.** Let the input choose the path (an ID ending in `01` goes one way, `02` another), provide error scenarios per operation and per provider, and keep the seeds editable. And **judge by the whole flow, not by one call**: a `500` on an update isn't a failure if the validation `GET` afterwards shows the expected state (the provider timed out *after* applying the change). To force a real failure, seed the opposite state.
- **Weigh the cost.** If building the mock costs as much as the development and the real dependency already exists, test against the real one. Mocking is part of test design, not a reflex.

## Recognizing a mock that's fooling you

- **Byte-for-byte identical responses before and after an operation** that should change state reveal a **static stub**: the mock returns a fixed record and doesn't reflect what happened (a stale date and someone else's order ID in the response were the other clues). Every check against it is partial. Document it as an environment limitation, not as a product failure.
- **Mocks have limits of their own.** An inventory mock that rate-limited writes under bursts (`429 Too Many Requests`) generated failures that looked like product errors. If the read works but the write keeps returning `429`, the limit is on writes and the fix is spacing retries. Treat such failures as transient: **retry and document it** before filing a bug. It got worse because every order of one kind patched *the same* mock record.
- **Shared mocks accumulate state.** If the system refuses to delete a service with orders in a non-final state, a single canned service shared by everyone collects stuck orders until nobody can delete it.
- **Mocks change without notice.** In an environment where mocks can be switched on and off per component on request, yesterday's integrated test may be running against a mock today. Check before you conclude.

## Mocks as contract evidence

When a third-party integration doesn't exist yet but the response format has been agreed, the mock **is** the evidence of that agreement. If the provider later changes its response, you can show what was agreed and justify your own changes. Together with [validating response schemas](/api-testing/json-schema-validation) against the published specification ("something was added without telling us"), a well-versioned mock suite is how you keep an eye on integrations you don't control. It's [contract testing](/strategy/microservices-testing) by another name.

## Working agreements that help

- **The QA can spin up their own mock on demand**, with a heads-up in the team channel. Mocks are also the quickest way to **free a shared environment** that someone else needs.
- **If fixing a broken mock would take days**, skip that test in the mocked environment and run it where the real integration exists.
- **Never let a mock-induced skip disappear silently**: it's an observation of the release, and the verdict must say what was actually verified (see the [verdict scale](/strategy/test-management-with-xray#verdicts-say-what-was-verified-not-how-hard-you-tried)).

Typical tools: [WireMock](https://wiremock.org/), [Imposter](https://www.imposter.sh/), [MockServer](https://www.mock-server.com/), or the mock servers built into API tools like Postman.

::: tip Key idea
A mock is a claim about how another system behaves. Keep it honest (invariants, errors, state), keep it current (updated with the task that changes it), and never let a result against a mock be reported as proof of the integration.
:::
