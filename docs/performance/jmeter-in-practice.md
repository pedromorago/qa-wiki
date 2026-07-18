# JMeter in practice

JMeter is the veteran of performance testing: a GUI to design test plans and a command line to actually run them. Before touching it, get the [fundamentals](/performance/performance-fundamentals) straight: the tool doesn't fix a badly designed test.

## The pieces of a test plan

A JMeter plan is a tree of elements:

| Element | What it does |
|---|---|
| **Test Plan** | The root: plan-wide variables |
| **Thread Group** | The load model: users (threads), ramp-up and duration |
| **Samplers** (HTTP Request…) | The requests being sent |
| **Config Elements** | Shared configuration: HTTP Header Manager, CSV Data Set Config |
| **Assertions** | Acceptance criteria for each response (content, duration) |
| **Post-Processors** (extractors) | Pull values from one response to use in the next |
| **Listeners** | Results visualization — for designing and debugging only |

## The workflow that works

1. **Design in the GUI** with a handful of threads: the request (e.g. a catalog query or a service order creation), its assertions (status, some content, max duration) and the extractors.
2. **Parameterize the data** with *CSV Data Set Config*: a hundred users with the same customer and the same catalog product test the cache, not the system.
3. **Correlate the dynamic parts**: tokens, session ids and generated values get extracted from responses (JSON/Regex Extractor) and reused (`${token}`) — the equivalent of request chaining in any API test.
4. **Run in the CLI**, never the GUI:

```bash
jmeter -n -t plan.jmx -l results.jtl -e -o report/
```

`-n` (no GUI), `-t` (the plan), `-l` (raw results) and `-e -o` generate the **HTML report** with percentiles, throughput and errors per sampler.

5. **Integrate into CI**: the same command runs in a pipeline; the report gets published as an artifact and the objectives (p95, errors) are checked against the `.jtl`.

## Common mistakes

- **Running the real load from the GUI** with listeners on: the GUI consumes so many resources you end up measuring JMeter, not your system.
- **Not correlating**: blindly replaying recorded requests with expired tokens produces mountains of 401s that look like "system errors".
- **Unrealistic ramp-up**: going from 0 to 500 users in one second isn't a load test, it's an attack.
- **Generating load from a single small machine**: if the generator saturates before the system does, JMeter has a distributed mode and you can also spread across CI.
- **Keeping the `.jmx` outside the repo**: it's XML, it gets versioned [like any other test code](/cicd/git-for-qa).

::: tip Key idea
JMeter's GUI is the drawing board; the CLI is the measuring instrument. Design with few threads and listeners, run with `-n`, and read percentiles in the HTML report — in that order.
:::

## References

- [JMeter user manual](https://jmeter.apache.org/usermanual/index.html)
- [JMeter — Best practices](https://jmeter.apache.org/usermanual/best-practices.html)
