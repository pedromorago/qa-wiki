# Testing async APIs with Awaitility

Some operations aren't resolved by the API within the request itself: in a threat modeling platform, think of importing a large model, generating a project's risk report, or bulk deletions… The usual pattern is the **asynchronous operation**: the call responds instantly with an `operationId`, and the actual status is polled on another endpoint. How do you test that without `Thread.sleep`?

## The async pattern in the API

The request is flagged as asynchronous (a header like `X-Async: true`, or the endpoint is async by design) and the immediate response carries the operation's ID and a link to its status resource:

```json
{
  "operationId": "00000000-0000-0000-0000-000000000000",
  "_links": {
    "operation": {
      "href": "https://api.example.com/api/v2/async-operations/00000000-..."
    }
  }
}
```

## Why `Thread.sleep` is the wrong answer

- If you sleep 10 s and the operation takes 2, **you waste 8 seconds** on every test.
- If you sleep 10 s and the operation takes 12, **false red** — and a flaky test is born.
- The "right" duration doesn't exist: it varies by environment, load, and data.

What you want is **polling with a timeout**: ask every X until the condition is met or the deadline runs out.

## Awaitility

[Awaitility](https://github.com/awaitility/awaitility) is the standard Java library for this (`org.awaitility:awaitility`, `test` scope):

```java
public Boolean isOperationSuccess(String operationId) {
    Awaitility.await()
            .atMost(5, TimeUnit.SECONDS)       // max timeout → TimeoutException
            .pollInterval(1, TimeUnit.SECONDS) // checks the condition every second
            .until(() -> getOperationStatus(operationId).contains("finished"));

    return getOperationStatus(operationId).contains("success");
}
```

And the test stays declarative:

```java
String operationId = response.extract().body().path("operationId");
TestCaseReport.assertEquals("The model import finishes successfully",
        operationService.isOperationSuccess(operationId), true);
```

## The details that matter

- **Completion and outcome are two different things.** The example waits for the operation to be *done* ("finished") and **afterwards** checks whether it ended *well* ("success"). If you only wait for "success", a failed operation exhausts the timeout and the error you'll see is "timeout" instead of "the operation failed" — a much worse diagnosis.
- **Encapsulate the polling in a helper with a business name** (`isOperationSuccess`). Tests shouldn't know about `pollInterval`s.
- **Tune the timings per operation**, not globally: deleting a project takes 2 s, importing a large model or generating a risk report can take 2 min.
- The same concept exists in other stacks: `expect.poll` / `expect(...).toPass()` in Playwright, `cy.waitUntil` in Cypress, `tenacity` in Python.

::: warning The same logic inside the UI
Every "until X" wait with a timeout is this very same pattern. Whenever you see a fixed `sleep`/`waitForTimeout` in a test — API or UI — a flaky test is incubating.
:::
