# BDD with Cucumber

**BDD** (Behavior-Driven Development) is a collaboration practice: business, development and QA define the expected behavior **with concrete examples before building**. Cucumber is the tool that turns those examples into executable tests. The order matters: first the collaboration, then the tool.

## Gherkin: examples that run

Examples are written in Gherkin, a format anyone can read:

```gherkin
Feature: Convergent discount

  Scenario: Fiber customer adding a mobile line
    Given a customer with an active fiber subscription
    When they confirm the order for a mobile line
    Then the monthly fee applies the convergent discount
```

- **Given** — the starting state.
- **When** — the action under test.
- **Then** — the expected observable result.
- **Scenario Outline** — the same scenario with an examples table: several cases, one text.

## Step definitions: the glue

Each Gherkin step binds to code through a *step definition* (in Java, JavaScript, etc.):

```java
@When("they confirm the order for a mobile line")
public void theyConfirmTheOrderForAMobileLine() {
    serviceOrderPage.confirm();
}
```

Step code should be thin: delegate to page objects or API clients. If the logic lives in the steps, you end up with a hard-to-maintain framework wearing odd syntax.

## When BDD pays off (and when it's theater)

It pays off when:

- **Business genuinely participates** in writing or reviewing the examples: the Gherkin is the common language and the living documentation.
- Examples are defined **before** development (three amigos, [acceptance criteria](/strategy/acceptance-criteria-and-dor)): the scenario is the specification.

It's theater when nobody from business reads the Gherkin and it's just a syntax layer over the usual tests. In that case it adds maintenance (two levels: features and steps) without adding communication — a plain test framework is better.

## Minimal good practices

- **Declarative scenarios, not imperative ones**: "Given a registered user", not eight form-filling steps. The *how* lives in the steps.
- **One behavior per scenario**, with a clear Then.
- **Consistent vocabulary** (ubiquitous language): the same terms in Gherkin, code and conversations.
- Tags (`@smoke`, `@regression`) organize execution into suites.

::: tip Key idea
BDD is not about writing tests in "natural language": it's about discovering requirements through examples before building. If that conversation doesn't happen, Cucumber is just a more expensive way to write tests.
:::

## References

- [Cucumber documentation](https://cucumber.io/docs/)
- [Gherkin reference](https://cucumber.io/docs/gherkin/reference/)
