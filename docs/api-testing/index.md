# API Testing

Testing below the interface: faster, more stable, and closer to the business logic than UI testing.

## Fundamentals

- [HTTP fundamentals](/api-testing/http-fundamentals) — methods, status codes, headers: the language of APIs.
- [What to test in an API](/api-testing/what-to-test-in-an-api) — checklist: contract, data, errors, security, and idempotency.

## API automation

- [Architecture of an API testing framework](/api-testing/api-framework-architecture) — layers, service objects, and organization (Java + REST Assured + JUnit 5).
- [Anatomy of an API test](/api-testing/anatomy-of-an-api-test) — Given-When-Then, the per-endpoint case matrix, and assertions.
- [JSON Schema validation](/api-testing/json-schema-validation) — validate the contract, not just the values.
- [Test data and authentication](/api-testing/test-data-and-authentication) — builders with random data, ephemeral users, and least privilege.
- [Async APIs with Awaitility](/api-testing/async-apis-with-awaitility) — polling with a timeout instead of sleeps.

## Tools

- [VS Code REST Client](/api-testing/rest-client-vscode) — testing APIs with `.http` files versioned in the repo.
- [SQL for QA](/api-testing/sql-for-qa) — the 20 % of SQL that solves 80 % of the job: verifying persistence, preparing data and spotting inconsistencies.
- [Postman and SoapUI](/api-testing/postman-and-soapui) — testing APIs without a framework: collections with assertions, and SOAP with its WSDL contract.
- [NoSQL for QA](/api-testing/nosql-for-qa) — which guarantees disappear without a fixed schema and what to validate because of it, with MongoDB as the example.
