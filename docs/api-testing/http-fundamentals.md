# HTTP Fundamentals

To test REST APIs you need to master HTTP: it's the language the API uses to tell you whether something went right or wrong, and quite often **the status code is itself the bug**.

## Anatomy of a request and a response

```
── Request ───────────────────────────────
POST /api/v1/service-orders HTTP/1.1     ← method + path
Host: api.example.com
Authorization: Bearer eyJhbGc...         ← headers
Content-Type: application/json

{ "customerId": "C-100", "productId": "fiber-1gbps" }    ← body

── Response ──────────────────────────────
HTTP/1.1 201 Created                     ← status code
Content-Type: application/json
Location: /api/v1/service-orders/42

{ "id": 42, "customerId": "C-100", "productId": "fiber-1gbps", "status": "created" }
```

## HTTP methods

| Method | Use | Idempotent?* | Has a body? |
|---|---|---|---|
| `GET` | Read a resource | Yes | No |
| `POST` | Create a resource / action | No | Yes |
| `PUT` | Replace an entire resource | Yes | Yes |
| `PATCH` | Partially modify | No (in general) | Yes |
| `DELETE` | Delete | Yes | Usually not |

\* **Idempotent** = running it N times produces the same state as running it once. Hugely important for testing: a repeated `PUT` must not duplicate anything; a repeated `POST` can create duplicates (does the API guard against that?).

## Status codes: the ones a QA cares about

### 2xx — Success
- **200 OK** — successful request with a response.
- **201 Created** — resource created (expect a `Location` header and/or the resource in the body).
- **204 No Content** — success with no response body (typical of `DELETE`).

### 4xx — Client error (this is where negative testing lives!)
- **400 Bad Request** — malformed request or invalid data.
- **401 Unauthorized** — not authenticated (token missing or invalid).
- **403 Forbidden** — authenticated but **without permission**. The 401/403 mix-up is a classic bug.
- **404 Not Found** — the resource doesn't exist. Careful: some APIs return 404 instead of 403 to avoid revealing that the resource exists — that's a design decision, and you need to know which one applies.
- **409 Conflict** — state conflict (e.g. creating a duplicate service order for a customer who already has that same service in progress).
- **422 Unprocessable Entity** — correct syntax but semantically invalid data.
- **429 Too Many Requests** — rate limiting.

### 5xx — Server error
- **500 Internal Server Error** — unhandled exception. **A 500 triggered by user input is always a bug**, no matter how absurd the input: the server must validate and respond with a 4xx.
- **502 / 503 / 504** — infrastructure problems (gateway, service down, timeout).

::: warning The "200 with an error inside" anti-pattern
Some APIs return `200 OK` with `{ "success": false, "error": "..." }` in the body. It's bad practice and a trap for testing: never validate only the status code, validate the body too.
:::

## Headers worth looking at

- `Content-Type` — body format (`application/json`). What happens if I send a different one?
- `Authorization` — credentials (`Bearer <token>`, `Basic ...`).
- `Location` — URL of the freshly created resource (on 201).
- `Cache-Control` / `ETag` — caching. A source of "stale data" bugs.
- `X-Request-Id` (or similar) — correlation with logs; gold for reporting API bugs.
