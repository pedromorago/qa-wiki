# What to test in an API

A checklist of the dimensions I go through when testing an endpoint. Not all of them apply every time, but running through the list prevents gaps.

## 1. The contract

- Is the status code correct for each scenario (success, not found, invalid…)?
- Does the response structure match the documentation (OpenAPI/Swagger)? Fields, types, nesting.
- Are the required fields always present? Are optional ones omitted or returned as `null` consistently?
- Consistent formats? Dates (ISO 8601), currencies, IDs.

## 2. Data and validations (negative testing)

This is where [partitions and boundary values](/fundamentals/test-case-design) apply, just like in the UI:

- Required fields missing, empty, `null`.
- Wrong types: a string where a number goes, an array where an object goes.
- Boundary values: extremely long strings, negative numbers, zero, decimals where integers are expected.
- Special characters, emojis, HTML/SQL in text fields (`<script>`, `' OR 1=1 --`).
- Malformed JSON and an incorrect `Content-Type`.
- Unexpected extra fields in the body (e.g. sending `status: "active"` or `monthlyPrice: 0` when creating a service order): does it ignore them or persist them? (*mass assignment*).

**Golden rule**: no input should ever produce a `500`. Invalid input → `4xx` with a useful error message (but one that doesn't leak stack traces or internal details).

## 3. Authentication and authorization

- No token → `401`.
- Expired or tampered token → `401`.
- Valid token but a user **without permission** → `403`.
- The classic of classics: **IDOR** — with customer A's token, request `GET /customers/B/service-orders`. Can I see another customer's orders?

## 4. Behavior and state

- Does the operation actually persist? After a `POST`, do the `GET` and verify.
- Idempotency: repeat the same `PUT`/`DELETE`. Does the second `DELETE` return `404` or `204`? Is that what's expected?
- Duplicate `POST` (double click, network retry): does it create two service orders?
- Concurrency: two simultaneous updates on the same resource. Who wins? Is there version control (ETag / `version`)?

## 5. Listings: pagination, filters, and sorting

- Page out of range, `page=0`, `page=-1`, a gigantic `pageSize`.
- Does the total (`totalCount`) match the actual items?
- Combined filters and filters with values that yield no results.
- Stable ordering: do two identical requests return the same order?

## 6. The non-functional bits I can actually touch

- Reasonable response time (and consistent across calls).
- Rate limiting: does it respond with `429` when exceeded? With a `Retry-After` header?
- Large payload: is there a body size limit? What does it return when exceeded?

::: tip How I organize it
For each endpoint I put together a quick table: rows = scenarios (happy path + negatives + permissions), columns = expected code, expected body, expected side effect. That table then becomes the seed for the automated API tests.
:::
