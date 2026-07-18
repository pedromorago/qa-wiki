# Architecture of an API testing framework

Notes on how an API automation framework is structured in **Java + JUnit 5 + REST Assured**, based on the framework I work with daily. The principles apply just the same with other stacks (pytest + requests, Playwright API testing…).

## The goal: the tester only writes tests

A testing framework is an internal product. Its mission is to provide a **working skeleton** so that whoever writes tests can focus on defining services and cases, not on solving authentication, reporting, or CI execution every single time. Design principles:

- **Scalable**: a single framework serving several teams, without duplicating effort.
- **Maintainable**: built for the long term; an API change shouldn't force you to rewrite a thousand tests.
- **Integrated into the ecosystem** (DevOps culture): pipelines, test case manager, tracker, and repository talk to each other through the framework.

## The three layers

```
┌──────────────────────────────────────────────┐
│  Test case layer                             │  ← WHAT is validated
│  (scenarios that validate features)          │
├──────────────────────────────────────────────┤
│  Service object layer                        │  ← HOW you talk to the API
│  (one object per service/endpoint)           │
├──────────────────────────────────────────────┤
│  Infrastructure layer                        │  ← WHERE and WITH WHAT
│  (libraries, CI/CD, reporting, logs)         │
└──────────────────────────────────────────────┘
```

The key piece is the **service object**: the equivalent of a UI Page Object, but for APIs. Each service encapsulates *all* the interactions with its endpoint. If the endpoint changes, its service object changes — **the tests never notice**.

```java
public class ServiceOrdersService extends ServiceBase {
    public ValidatableResponse createOrder(Object body) { ... }
    public ValidatableResponse getOrder(String orderId) { ... }
    public ValidatableResponse cancelOrder(String orderId) { ... }
}
```

All services inherit from a `ServiceBase` that concentrates the common bits (authentication, request building, HTTP methods). Inheriting from a common base isn't just about saving code: it **forces** everyone to authenticate and build requests the same way.

## Project organization

```
src/test/java/
├── cases/       # tests, organized by API version → domain → feature
│   └── v2/catalog/products/CreateProductTest.java
├── suites/      # JUnit suites per domain
├── services/    # service objects (CatalogService, ServiceOrdersService…)
├── model/       # request/response POJOs
└── helpers/     # utilities: random data, user creation…
src/test/resources/
├── env/         # one config directory per environment
│   └── local/config.properties
└── schemas/     # JSON Schemas per version → service (+ reusable generics)
```

Two details I find particularly well thought out:

- **Multi-environment via properties**: each environment has its own `config.properties` (base URL, admin credentials, flags). The test points at one via an environment variable, without touching code:

  ```bash
  ENV_PATH=local TEST_SUITE=V2Catalog ./gradlew :test --tests $TEST_SUITE
  ```

- **Suites per product domain**: day to day you don't run individual tests but suites (`@Suite` + `@SelectPackages("cases.v2.catalog")`), which is exactly how the pipelines are organized. Suite = package = domain: the same unit in code, execution, and CI.

## Test class hierarchy

Three levels of inheritance that balance reuse and performance:

1. **`TestBase`** — global: lifecycle, logging, reporting (with a JUnit 5 `TestWatcher`).
2. **`<Domain>TestBase`** — per domain: declares the shared users/data as `protected static final`, so they're created **only once** for all the classes in the domain.
3. **The concrete test class** — just cases.

## Lifecycle with JUnit 5

Order: `@BeforeAll` → (`@BeforeEach` → test → `@AfterEach`) × N → `@AfterAll`.

- `@BeforeAll` / `@AfterAll` must be `static` (JUnit creates a new instance per test).
- `@BeforeAll`: create the test's shared users/data.
- `@BeforeEach`: reset state if the test needs it clean.
- Hooks exist to **eliminate duplication**, not to hide logic: if a hook does something that affects the test's outcome, it should probably live in the test.

::: tip Tests must be atomic
The rule that comes before everything else: every test must be able to run on its own and in any order. Suites group, they don't chain.
:::

## A custom assertion facade

All assertions go through a custom utility class (e.g. `TestCaseReport.assertResponseCode(...)`) instead of calling JUnit/AssertJ directly. Each assert, besides validating, **writes to the log and to the HTML report**. Three advantages:

1. Homogeneous messages across the whole suite.
2. Every validation is traced in the report (not just the final failure).
3. If you switch assertion libraries tomorrow, you touch one class, not a thousand tests.
