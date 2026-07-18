# JSON Schema validation in API tests

Validating that `name == "Fiber 1 Gbps"` confirms a value. Validating the **JSON Schema** confirms the whole contract: that the response has the structure, types, and required fields the API promises. It's the validation with the best effort-to-value ratio in an API test.

## Why

- It detects **contract breaking changes** (a field that disappears, a type that changes from `string` to `number`) even when the functional happy path keeps passing.
- It guarantees **consistency across endpoints**: same date format, same error body across the whole API.
- It's cheap: you write it once per endpoint and it validates dozens of properties on every run.

## How it's organized

- Schemas live as `.json` files in the project's resources, organized by API version → service.
- Those that apply to several endpoints (the standard error body, the pagination wrapper) go in a `generic/` directory and get **reused** — don't duplicate the error schema in every service.
- To create one: capture a real sample response and run it through a "JSON → JSON Schema" generator; then tune it by hand (especially the `required` list).

## Example

Response when creating a catalog product (a fiber plan):

```json
{
  "id": "prod-042",
  "name": "Fiber 1 Gbps",
  "downloadSpeedMbps": 1000,
  "monthlyPrice": 35.90
}
```

Its schema (`create-product.json`):

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "id":                { "type": "string" },
    "name":              { "type": "string" },
    "downloadSpeedMbps": { "type": "integer" },
    "monthlyPrice":      { "type": "number" }
  },
  "required": ["id", "name", "downloadSpeedMbps", "monthlyPrice"]
}
```

And a reusable generic schema, the standard error response (RFC 7807 style):

```json
{
  "status": 401,
  "title": "Something went wrong",
  "detail": "Authentication failed",
  "type": "SecurityError",
  "traceId": "00000000-0000-0000-0000-000000000000"
}
```

Its schema:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "status":  { "type": "integer" },
    "title":   { "type": "string" },
    "detail":  { "type": "string" },
    "type":    { "type": "string" },
    "traceId": { "type": "string" }
  },
  "required": ["status", "title", "detail", "type", "traceId"]
}
```

In the test (REST Assured ships the matcher; here it's wrapped in the framework's assertion facade):

```java
// status code + schema in a single call — the usual combo
TestCaseReport.assertResponseCodeAndBodySchema("Status and schema", response,
        HttpStatus.SC_CREATED, CATALOG_SCHEMA_PATH + "/create-product.json");
```

In JavaScript/TypeScript the equivalent is the `ajv` library; in Playwright it plugs into a custom `expect`.

## The nuances that make the difference

- **`required` is where the value is.** A schema without `required` validates almost anything. Consciously decide which fields are mandatory.
- **Validate the errors too.** The bodies of `400/401/403/404` have a contract just like the `200` ones — and they break more often, because nobody looks at them.
- **Beware of overly strict schemas**: if the API adds a new field (a backwards-compatible change), do you want your tests to fail? Decide your `additionalProperties` policy based on what "breaking the contract" means for your consumers.
- The schema **does not replace** functional assertions: it confirms the shape, not that the computed monthly price is correct.
