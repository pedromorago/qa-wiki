# Jenkins and GitLab CI

Pipeline concepts are the same in every tool; what changes is the vocabulary and where things are configured. If you already know one (Bitbucket Pipelines, GitHub Actions), learning Jenkins or GitLab CI is mostly **translating terms**.

## The equivalence dictionary

| Concept | Jenkins | GitLab CI | GitHub Actions / Bitbucket |
|---|---|---|---|
| Definition | `Jenkinsfile` (in the repo) | `.gitlab-ci.yml` | `.github/workflows/*.yml` / `bitbucket-pipelines.yml` |
| Unit of work | stage / step | stage / job | job / step |
| Who executes | agent (node) | runner | runner |
| Saved outputs | artifacts | artifacts | artifacts |
| When it fires | triggers (webhook, cron…) | rules / only | on: push, pull_request… |
| Secrets | Credentials | CI/CD Variables (masked) | Secrets / protected variables |

## Jenkins essentials

The elder statesman: a (often self-managed) server with a huge plugin ecosystem. The pipeline is defined in a declarative `Jenkinsfile` versioned in the repo:

```groovy
pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'npm ci && npm test'
      }
    }
  }
  post {
    always {
      junit 'reports/**/*.xml'   // publishes test results
    }
  }
}
```

What's worth knowing as a QA: **agents** (where each stage runs — it matters for browsers and resources), the **`post`** block (publish reports even when tests fail) and the fact that plugin flexibility is also plugin maintenance.

## GitLab CI essentials

Built into GitLab, 100 % YAML configuration in `.gitlab-ci.yml`:

```yaml
stages: [test]

e2e:
  stage: test
  image: mcr.microsoft.com/playwright:v1.54.0
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths: [playwright-report/]
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

The useful pieces: **`image`** (each job runs in a [Docker container](/cicd/docker-for-qa) — the test environment is declared), **`artifacts.when: always`** (the report is kept on failure too, which is when you need it most) and **`rules`** (what runs in which context, the basis of [environment validations](/cicd/environment-validations)).

## What doesn't change across tools

- Tests are organized in stages of increasing confidence ([environment validations](/cicd/environment-validations)).
- The long suite gets split ([parallelization and sharding](/cicd/parallelization-and-sharding)); both GitLab (`parallel`) and Jenkins support it.
- Reports are published as artifacts **always**, not only on green.
- Secrets live in the tool's manager, never in the YAML.

## Common mistakes

- **Decorative pipelines**: if red doesn't block the merge, the pipeline is an ornament.
- **Not saving artifacts on failure** — the very run you need to investigate is the one that leaves no trace.
- **Copying YAML without understanding the triggers**: you end up running the full suite on every push of every branch, or worse, running nothing where it matters.

::: tip Key idea
Learn the concepts (stages, runners, artifacts, triggers, secrets) and the tools become interchangeable. The QA question is always the same: what runs, when, and what happens when it fails?
:::

## References

- [Jenkins Pipeline documentation](https://www.jenkins.io/doc/book/pipeline/)
- [GitLab CI/CD documentation](https://docs.gitlab.com/ee/ci/)
