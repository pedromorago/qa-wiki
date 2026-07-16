# Performance testing fundamentals

A performance test without a defined objective only produces pretty charts. Before opening any tool you need to know **what question you want answered**: does it survive the Black Friday peak? How many users before it degrades? Are there memory leaks after hours of use?

## The test types (and the question each one answers)

| Type | What the load looks like | Question it answers |
|---|---|---|
| **Load** | The expected production load, sustained | Do we meet the targets under normal traffic? |
| **Stress** | Growing until it breaks | Where is the limit and how does it fail when reached? |
| **Spike** | Sudden surge and drop | Do we survive a sudden avalanche? |
| **Soak** | Moderate, for hours | Is there degradation over time (leaks, growing queues)? |

## The metrics that matter

- **Latency by percentiles**: p50 (median), p95, p99. **The average lies**: a 200 ms average can hide a 4-second p99, and that p99 is the experience of your unluckiest 1 % of users — which in a large system is thousands of people.
- **Throughput**: requests per second the system actually processes (not the ones you throw at it).
- **Error rate**: performance with errors doesn't count. A "fast" system returning 500s isn't fast: it's broken.
- **Resource saturation**: CPU, memory, database connections — they explain the *why* behind the other three.

The classic signal: as load grows, throughput rises up to a point and flattens, while latency shoots up. That knee is the system's real capacity.

## How to design a test that means something

1. **Measurable objectives before starting**: "p95 < 500 ms and errors < 0.1 % with 200 concurrent users". No objective, no verdict.
2. **A realistic load model**: an operation mix like production's (80 % reads, 20 % writes?), gradual ramp-up, varied data. A hundred users hitting the same cached request prove nothing.
3. **A representative environment**: results scale poorly between environments; if you test on one 4× smaller, document the difference and don't extrapolate cheerfully.
4. **One change per iteration**: measure, change one thing, measure again. Like any experiment.

## The tools

- **[JMeter](/performance/jmeter-in-practice)** — the Apache veteran: GUI to design, CLI to run, huge ecosystem. The de facto standard in many companies.
- **k6** — code-first in JavaScript, built for CI and developers; `thresholds` as a pipeline gate are elegant.
- **Gatling** — code-first in the JVM ecosystem, with very good reports.

The tool matters less than the load model and the metrics: the four concepts above apply the same in all three.

## Common mistakes

- **Testing without an objective** and deciding afterwards whether the result "looks fine".
- **Looking only at the average** — the high percentiles are where the real pain lives.
- **Generating load from your laptop** against a remote environment: you end up measuring your wifi.
- **Ignoring warm-up**: the first minutes (cold caches, JIT) aren't representative.
- **Not repeating the test**: a single run is an anecdote, not a data point.

::: tip Key idea
A performance test is an experiment: a hypothesis (the objective), controlled conditions (environment and load model) and honest measurement (percentiles, not averages). If any of the three legs is missing, it's theater with charts.
:::

## References

- [JMeter documentation](https://jmeter.apache.org/usermanual/index.html)
- [k6 documentation](https://grafana.com/docs/k6/latest/)
