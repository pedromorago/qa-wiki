# Testing strategy for microservices

Microservices change the problem: you're no longer testing *one* application, but many pieces that evolve separately and make promises to each other. The strategy that works best for me boils down to one idea: **test each service in two states**.

## State 1: the microservice in isolation

Without calling any third party — if it needs a dependency, it gets mocked. Goal: guarantee that the service, on its own, does what it says.

- **Unit tests** — the biggest slice of the pyramid, as always.
- **API E2E of the isolated service** — the service started on its own, tested **against its API catalog from a consumer's perspective**, simulating a complete business flow from input to output.
- **Isolated performance/load** — high volumes of requests to find bottlenecks and measure its capacity *before* integrating it: it's the prediction of its future stability.

## State 2: the microservice integrated into the ecosystem

Here the key principle: **the ecosystem is treated as a black box with a single logical entry point**. The tests don't know (nor care) about the internal architecture or infrastructure.

- **Contract tests** — verify that consumer↔provider agreements (format, structure, data behavior) are honored, **without spinning up the whole system**. Their specific superpower: validating **backward compatibility** — that the provider's new version doesn't break existing consumers' expectations.
- **Full-system E2E** — in two flavors: API E2E (the catalog exposed by the entire system) and frontend E2E (the same thing via the UI).
- **System performance** — from the outside: overall times, latency between services, resource usage, and the final question: does it recover from failures without affecting the user?

::: tip Gate between states
The integrated-state tests **only run if the isolated-service tests have passed**. If the service is broken on the inside, testing its integration is burning pipeline time to learn what you already know.
:::

## A real case: reporting module

How this was applied to a report-generation microservice integrated with the core of a SaaS:

- **Isolated**: backend unit tests per architectural piece (adapters, controllers, services); API E2E starting the service and validating **the content of the generated report** — that it includes all its sections and components, not just that it returns a 200.
- Frontend unit tests **were attempted and then deprecated** due to their complexity: that risk moved to being covered by the E2E tests. Retiring a layer is a legitimate strategy decision if the risk stays covered in another one — and documented.
- **Integrated**: core→module API E2E (the request that triggers the report responds correctly) and frontend E2E (generating and **downloading** the report as a user).

Out of this comes a test plan template for any new module: two phases (isolated/integrated) → layers per phase with their goal → decide which layers are worth it (and document the discarded ones) → if it produces artifacts, validate their content → gates between phases.

## Tooling: my cheat sheet

**Contract**: [Dredd](https://dredd.org) (validates directly against OpenAPI — cheap and perfect for CI, though it only does contract) or [Pact](https://pact.io) (true consumer/provider contracts, catches incompatibilities before deployment, but demands cross-team coordination and more setup).

**Functional API testing** — the recommendation is boring and correct: **each team with its native stack**:

| Stack | Framework | Requests | Mocks |
|---|---|---|---|
| Python | pytest | requests / httpx | responses, pytest-httpx |
| Java | JUnit | REST Assured | Mockito, WireMock |
| JS/TS | Vitest | supertest / axios | msw, built-in mocks |

**Load**: Artillery (lightweight, YAML, very CI-friendly — ideal for APIs), Locust (if the team is Python-first), JMeter (enterprise protocols, mature but heavy), Gatling (maximum JVM performance, steep learning curve).
