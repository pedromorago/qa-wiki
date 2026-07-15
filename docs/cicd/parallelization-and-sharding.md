# Test parallelization and sharding

As the E2E suite grows, pipeline time becomes the team's bottleneck: nobody wants to wait 40 minutes to find out whether their PR breaks something. The solution is to run in parallel — and doing it **well** is a more interesting problem than it looks.

## Two levels of parallelism

1. **Workers within one machine** — Playwright, for instance, runs N tests at a time on the same machine (`workers` in the config). Cheap, but limited by the machine's CPU/RAM.
2. **Sharding across machines** — splitting the suite across M CI machines running simultaneously (`--shard=1/4`, `--shard=2/4`…). It scales further, but every extra machine costs money.

Both combine: 4 shards × 4 workers = 16 simultaneous tests.

## The real problem: the split

Total pipeline time isn't the average of the shards, it's **the slowest shard** (*makespan*). A naive split (same number of tests per shard) produces unbalanced shards, because tests don't take the same time: one takes 8 seconds and another 4 minutes.

```
Naive split (by test count):               Split by duration:
Shard 1: ████████████████████ 22 min       Shard 1: ████████████ 13 min
Shard 2: ████████ 9 min                    Shard 2: ███████████▌ 12.5 min
Shard 3: ██████ 7 min                      Shard 3: ████████████ 13 min
                 ⌛ total: 22 min                        ⌛ total: 13 min
```

Same hardware, same tests: **9 minutes less per run**, just by splitting better.

## How to split better

- **Greedy by duration (LPT)**: sort the tests from longest to shortest and assign each one to the least loaded shard. Simple and very effective.
- **Exact optimization**: the optimal split is a *bin packing / makespan minimization* problem that can be modeled as **mixed-integer linear programming (MILP)**. I did this in Python for my team's E2E suite: ~40% less validation time in CI/CD **without adding infrastructure**. That experience gave birth to my project [CI Shard Advisor](https://github.com/pedro-morago/ci-shard-advisor).
- **Real-world constraints**: tests that can't run in parallel (they share data), expensive setups worth grouping in the same shard, and durations that change — the split must be recomputed periodically with fresh data from previous runs.

## Prerequisite: independent tests

None of this works if tests depend on each other. To be able to parallelize:

- **Every test creates (or gets injected) its own data** — never rely on what another test left behind.
- **Isolated users/accounts per test or per worker** — two tests logged in with the same user at once = false reds.
- **No implicit ordering**: if `test B` only passes after `test A`, those aren't two tests, they're one badly split in half.
- **Cleanup**: ideally via API in the teardown, not through the UI.

::: warning The symptom
If your suite passes sequentially and fails in parallel, you don't have a parallelization problem: you have coupled tests, and parallelization has merely exposed them.
:::

## Checklist for speeding up an E2E pipeline

1. Measure first: duration per test and per shard (Playwright/JUnit reporters give it to you for free).
2. Eliminate the top offenders: can that 5-minute test move down to the API layer?
3. Balance shards by duration, not by test count.
4. Review the balance periodically: today's suite isn't the one from 3 months ago.
5. Only then consider adding machines.
