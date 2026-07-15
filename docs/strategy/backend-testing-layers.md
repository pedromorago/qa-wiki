# Backend testing layers, with examples

What gets tested at each layer when the system under test is a backend. To make it concrete, a running example: **a REST API for user management** in a SaaS — user CRUD authenticated with JWT, roles, input validation, and the business rule "duplicate emails are not allowed".

## Unit: the logic, in isolation

Each function/method is tested with **all dependencies mocked** (repository, external services):

- `validatePasswordStrength()` returns `false` for weak passwords.
- `UserService.createUser()` throws an error if the email already exists (mocked repository).
- `JWTUtils.decodeToken()` parses the token correctly.

It's the fastest and cheapest layer to maintain. Tools: JUnit, pytest, Jest/Vitest…

## Integration: real components interacting

Here there's already a **real database** (or a realistic one: in-memory H2/SQLite, or containers with Testcontainers):

- `POST /users` creates the user and **persists** it in the DB.
- `GET /users/{id}` returns what's in the DB.
- `PUT /users/{id}` updates **and records the change in the audit service**.

A tip I apply: include **OpenAPI contract validation** at this layer — it's cheap contract testing within your own team.

## API E2E: a consumer's complete flow

The whole stack up and running (auth, DB, services), and the test walks through a real business flow:

1. `POST /auth/login` → get the JWT.
2. With the token, `POST /users` with a valid payload.
3. Validate the response and **confirm persistence** with `GET /users/{id}`.
4. `PUT /users/{id}` and validate the new data.
5. `DELETE /users/{id}` and check that it no longer exists.

## Operational summary

| Layer | Goal | Typical tools | When it runs | Blocking? |
|---|---|---|---|---|
| Unit | Isolated functions, no DB or network | JUnit, pytest, Jest | Every commit/push | Yes, always |
| Integration | API ↔ DB, services ↔ queues, OpenAPI contract | Spring Test, Supertest, Testcontainers | Every pull request | Yes (contracts and DB) |
| API E2E | Business flows with the full stack | REST Assured, Postman/Newman, Karate | Main/staging and pre-release | Yes for release |

Two final tips I only remember too late when I fail to apply them:

- **Measure unit and integration coverage separately.** Mixing them produces an aggregate figure that gives false confidence.
- **Tag the tests** (`@unit`, `@integration`, `@e2e`) so each pipeline runs exactly its own subset.
