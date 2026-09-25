# CI/CD and code quality

Testing doesn't live only in the test repository: it lives in the pipeline. Integrating tests into CI/CD, static analysis, and execution optimization.

- [Git basics for QA](/cicd/git-for-qa) — the daily flow with branches and PRs, and Git as an investigation tool: diff, blame and bisect.
- [Environment validations](/cicd/environment-validations) — which battery of tests runs at each stage (PR → integration → release) and why.
- [Jenkins and GitLab CI](/cicd/jenkins-and-gitlab-ci) — the equivalence dictionary between pipeline tools and the essentials of each.
- [Static analysis](/cicd/static-analysis) — SonarCloud, quality gates, SonarLint, Checkstyle and ESLint, in the pipeline and in the IDE.
- [Test parallelization and sharding](/cicd/parallelization-and-sharding) — splitting the suite so the pipeline flies (without paying for more infrastructure).
- [Docker for QA](/cicd/docker-for-qa) — reproducible, disposable environments: images, Compose and what a QA uses them for.
- [AWS for QA](/cicd/aws-for-qa) — S3, CloudWatch, RDS and the autonomy to find logs, data and artifacts in the cloud.
