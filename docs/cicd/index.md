# CI/CD and code quality

Testing doesn't live only in the test repository: it lives in the pipeline. Integrating tests into CI/CD, static analysis, and execution optimization.

- [Git basics for QA](/cicd/git-for-qa) — the daily flow with branches and PRs, and Git as an investigation tool: diff, blame and bisect.
- [Environment validations](/cicd/environment-validations) — which battery of tests runs at each stage (PR → integration → release) and why.
- [Static analysis](/cicd/static-analysis) — SonarCloud, quality gates, SonarLint, Checkstyle and ESLint, in the pipeline and in the IDE.
- [Test parallelization and sharding](/cicd/parallelization-and-sharding) — splitting the suite so the pipeline flies (without paying for more infrastructure).
