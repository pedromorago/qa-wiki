# Karate: API testing with BDD syntax

**Karate** is an API testing framework that uses Gherkin syntax with a twist: **there are no step definitions to write**. HTTP steps and assertions are already defined by the framework's language, so the `.feature` file is the complete test.

## What a test looks like

```gherkin
Feature: Service orders API

  Background:
    * url baseUrl

  Scenario: Create a service order and verify the response
    Given path 'service-orders'
    And request { customerId: 987, productId: 'fiber-1gbps' }
    When method post
    Then status 201
    And match response == { id: '#number', customerId: 987, productId: 'fiber-1gbps', status: 'created' }

  Scenario: The new order shows up in the customer's order list
    Given path 'service-orders'
    And param customerId = 987
    When method get
    Then status 200
    And match response[*].productId contains 'fiber-1gbps'
```

The distinctive part is `match`: an assertion language that understands JSON natively, with markers like `#number`, `#string`, `#uuid` or `#notnull` to validate structure without pinning exact values — a lightweight form of [schema validation](/api-testing/json-schema-validation).

## What it ships with

- **Full HTTP**: paths, headers, params, authentication, files.
- **JSON and XML as first-class citizens**: written as-is in the test, no escaping or builders.
- **Data-driven**: `Scenario Outline` with tables, or reading data from JSON/CSV files.
- **Reuse**: features calling other features (a shared login, for example).
- Extras from the same framework: **API mocks** (test doubles for integration) and even performance testing over the same features (with Gatling).

## Karate or REST Assured

| | Karate | REST Assured (+ JUnit) |
|---|---|---|
| The test is | A self-contained `.feature` | Java code |
| Learning curve | Low: productive in hours | Medium: requires the Java ecosystem |
| Complex logic | Possible (embedded JS) but gets messy fast | Natural: it's code |
| Fits when | The team mixes profiles and readability rules | The suite is large and lives as [a software project](/api-testing/api-framework-architecture) |

My take: Karate shines for covering APIs quickly with tests the whole team can read; when the suite grows in logic (complex dynamic data, helpers, typing), a code framework scales better.

## Common mistakes

- **Stuffing complex logic into features** with embedded JavaScript: when a feature looks like a program, it was time for a code framework.
- **Pinning values you don't control** (ids, dates) in `match` instead of using `#…` markers.
- **Not using `Background`/shared features** and repeating setup in every scenario.

::: tip Key idea
Karate removes the layer that makes Cucumber heavy (step definitions) in exchange for a language of its own. For readable, fast-to-write API testing it's a great option; just watch for the moment your features start being programs.
:::

## References

- [Karate — official documentation](https://github.com/karatelabs/karate)
