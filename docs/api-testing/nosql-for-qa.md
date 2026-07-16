# NoSQL for QA

If you already know [SQL](/api-testing/sql-for-qa), the jump to NoSQL isn't about learning another language: it's about learning **which guarantees disappear** and what you must validate because of it. I use MongoDB as the example since it's the most widespread document database.

## What changes compared to relational

| | Relational (SQL) | Document (MongoDB) |
|---|---|---|
| Unit of data | Row in a table | JSON document in a collection |
| Schema | Fixed, enforced by the database | Flexible: each document can have different fields |
| Relationships | JOINs between tables | Nested documents or references (no classic JOIN) |
| Consistency | Strong by default | Depends on configuration; often **eventual** |

The last two rows are the ones that change a QA's job.

## The day-to-day queries

Direct equivalences with what you already do in SQL:

| In SQL | In MongoDB |
|---|---|
| `SELECT * FROM users WHERE email = '…'` | `db.users.find({ email: '…' })` |
| `SELECT status FROM orders WHERE id = …` | `db.orders.find({ _id: … }, { status: 1 })` |
| `SELECT COUNT(*) …` | `db.orders.countDocuments({ status: 'pending' })` |
| `GROUP BY … HAVING COUNT(*) > 1` | `db.users.aggregate([{ $group: { _id: '$email', n: { $sum: 1 } } }, { $match: { n: { $gt: 1 } } }])` |

```js
// Was the order persisted with the expected structure?
db.orders.find({ orderId: 'ORD-10442' })

// Duplicates that validation should have prevented
db.users.aggregate([
  { $group: { _id: '$email', n: { $sum: 1 } } },
  { $match: { n: { $gt: 1 } } }
])
```

## What to validate (precisely because there's no schema)

- **The implicit schema.** The database accepts any document, so a misspelled field (`satus` instead of `status`) **doesn't fail on write: it fails on read**, in another system, weeks later. Verifying the structure of persisted documents is the test's job, not the database's.
- **Missing fields vs. null fields.** In Mongo they're different things (`{ field: null }` exists; a document without the field doesn't). Queries like `{ field: null }` match **both** — choose assertions deliberately (`$exists`).
- **Eventual consistency.** In distributed architectures, what you just wrote may take time to become visible. An immediate `find` that doesn't return the document isn't always a bug: validate with [active waiting](/api-testing/async-apis-with-awaitility), not with `sleep`.

## The rest of the NoSQL map, one line each

- **Key-value (Redis)** — caches and sessions; in tests, the usual cause of "I deleted it from the database but I still see it".
- **Columnar (Cassandra)** — time series and huge volumes, per-query configurable consistency.
- **Graph (Neo4j)** — relationships as the primary data; useful to know they exist.

## Common mistakes

- **Validating with a bare `findOne`** and trusting whatever document comes first: filter by the full key of the data you created.
- **Assuming immediate consistency** in distributed systems: active waits, not instant reads.
- **Ignoring "old" documents.** Without forced schema migrations, different document versions coexist in the same collection; tests must account for that.

::: tip Key idea
In SQL the database defends the schema for you; in NoSQL the schema is a promise made by the code. And promises made by code are exactly what a QA is in the business of verifying.
:::

## References

- [MongoDB Manual — CRUD](https://www.mongodb.com/docs/manual/crud/)
- [MongoDB Manual — Aggregations](https://www.mongodb.com/docs/manual/aggregation/)
