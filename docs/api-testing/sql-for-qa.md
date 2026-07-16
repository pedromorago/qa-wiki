# SQL for QA

The UI and the API tell you what the system **claims** to have done; the database tells you what it has **actually** done. A QA who can query the database can verify persistence, prepare test data and diagnose bugs without depending on anyone.

## The 20 % of SQL that solves 80 % of the job

You don't need to be a DBA. This covers almost all the day-to-day:

| I need to… | SQL pattern |
|---|---|
| Verify a record was created | `SELECT` with `WHERE` |
| Verify a state change | `SELECT status FROM … WHERE id = …` |
| Count how many there are | `COUNT(*)` with `GROUP BY` |
| Detect duplicates | `GROUP BY … HAVING COUNT(*) > 1` |
| Detect orphans (integrity) | `LEFT JOIN … WHERE child.id IS NULL` |
| Find data for a test | `SELECT … WHERE <criteria> LIMIT 5` |

## Examples over a minimal schema

With two example tables, `users` and `orders` (a user has many orders):

```sql
-- Was the user I registered from the UI actually created?
SELECT id, email, status, created_at
FROM users
WHERE email = 'test-2026-07@example.com';

-- Did the order move to 'shipped' after the full flow?
SELECT status FROM orders WHERE id = 10442;

-- Duplicates that validation should have prevented
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Orphan orders: they point to a user that no longer exists
SELECT o.id
FROM orders o
LEFT JOIN users u ON u.id = o.user_id
WHERE u.id IS NULL;

-- Test data: active users with pending orders
SELECT u.id, u.email
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.status = 'active' AND o.status = 'pending'
LIMIT 5;
```

## The NULL trap

`NULL` equals nothing, not even another `NULL`. Two consequences that produce false greens:

- `WHERE column = NULL` **never** returns anything: you write `WHERE column IS NULL`.
- `COUNT(column)` ignores `NULL`s; `COUNT(*)` counts every row. If you validate totals, choose deliberately.

## Safety rules in real environments

- **Read-only access** whenever possible. An `UPDATE` without a `WHERE` in a shared environment is a classic horror story for a reason.
- **`LIMIT` by default** on big tables: a heavy query on a shared environment can degrade performance for the whole team.
- **Careful with personal data**: the result of a query with real emails or names doesn't get pasted into a ticket or a chat. Anonymize, or reference by id.

## How it fits automation

In API tests, the most complete assertion validates both sides: the **response** (contract, status, body) and the **persistence** (what ended up in the database). It's also the setup-and-teardown tool: locating data that meets the test's conditions, and verifying the initial state before executing.

## Common mistakes

- **Validating only the response.** A 200 with a correct body doesn't guarantee it was persisted correctly (or that it wasn't persisted twice).
- **Tests that depend on live data.** If the test's query assumes "user 42 exists and has 3 orders", the test breaks the moment someone touches that data. Create or locate your data, don't assume it.
- **`SELECT *` on huge tables**, out of habit. Ask for the columns you need.
- **Copying queries without understanding the JOIN.** An `INNER JOIN` where a `LEFT JOIN` was needed hides exactly the rows you were looking for (the ones without a match).

::: tip Key idea
The API tells you what the system claims; the database, what it actually did. When the two versions don't match, there's a bug — and a good one.
:::

## References

- [SQLBolt](https://sqlbolt.com/) — the best interactive tutorial to get fluent with SELECT and JOINs.
- [PostgreSQL documentation — queries](https://www.postgresql.org/docs/current/queries.html)
