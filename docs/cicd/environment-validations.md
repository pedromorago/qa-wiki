# Environment validations in CI/CD

Throughout the lifecycle, several "versions" of the product coexist (feature branch, integration branch, release candidate, production, LTS…) and **not all of them need the same battery of tests or the same frequency**. Designing this well is designing your continuous testing strategy.

## The principle

> The closer to the developer, the faster and narrower; the closer to the customer, the slower and wider.

- **On the PR**, feedback speed comes first: backend regression (cheap and stable, via API) + frontend **sanity** only. Running a full matrix on every PR would be slow and wildly expensive.
- **On the integration branch**, **scheduled** execution (e.g. daily or twice a day, not per commit): it amortizes the cost and catches integration regressions within hours. All variants are covered here.
- **On the release**, **exhaustive, multi-matrix** validation: it's the last safety net before customers, and the cost of an escape is at its maximum.

## The matrix (real example, abstracted)

| Stage | Tests | Trigger | Editions | Databases |
|---|---|---|---|---|
| **Pull request** | Backend regression + frontend sanity | On opening the PR | Main one only | Main one only |
| **Integration (develop)** | Full BE+FE regression + cross-functionalities suite | Scheduled, 1-2×/day | **All** (enterprise, professional, community…) | Main, restored **and empty** |
| **Release (RC)** | Full BE+FE regression + cross-functionalities + addons | On merge to the release branch | All | **All supported versions** (e.g. Postgres 15 and 13) |
| **Production mirror** | Full regression | On demand | All | Restored and empty |
| **LTS** | Full regression | On demand (patches) | All | — |

Dimensions worth identifying in any product:

- **Editions/commercial variants** — each one enables different features; they're validated separately.
- **Supported DB versions** — the release is validated against every version customers run, not just the latest.
- **Cross-functionalities** — cross-cutting concerns that belong to no single domain (licensing, session expiration, exporting a project's reports…): they deserve their own suite.
- **Addons and integrations** with external services.

## Two database states

A cheap and surprisingly effective practice: testing against a **restored DB** (realistic migrated data — it simulates the long-time customer and catches migration issues) **and an empty DB** (clean install — it simulates the new customer). Many bugs only exist in one of the two worlds.

Operationally: the dumps are **regenerated automatically on every deployment** of the reference environment and published with versioning (an S3-style bucket). Tests always start from a known state, and the dataset never drifts out of sync with the schema.

## The release cycle from QA's perspective

1. **Release Candidate**: validated features are packaged into an RC that gets deployed to its own environment and receives the full regression. Strict rule: **once the RC exists, only critical bug fixes go in** — feature freeze.
2. **Production**: a **mirror environment** is kept with the exact production version, to reproduce and validate any issue or fix against what the customer actually has.
3. **LTS**: extended-support versions live in their own dedicated environment where only patches and security fixes are validated.

## Custom on-demand pipelines

Besides the automatic ones, four parameterizable pipelines that anyone can launch:

- `backend-all-domains` / `backend-one-domain`
- `frontend-all-domains` / `frontend-one-domain`

Typical parameters: browser, suite/domain, product edition and the **branch of the test repository**. They let you reproduce "just the X suite against branch Y" without waiting for the scheduled run — and validate your new tests before asking for review.

::: tip The design question
For every suite and every stage: *what decision gets made with this result?* If a failure here blocks nothing and informs no one, that suite is running in the wrong place.
:::
