# Static analysis: SonarCloud, Checkstyle and ESLint

Static analysis examines code **without executing it**, against a set of rules. It's the cheapest quality gate there is: it catches problems while they still cost pennies. How to set up a complete setup — pipeline + IDE — for Java and for Node/TypeScript.

## SonarCloud: code health

It detects problems along three axes: **maintainability** (code smells, duplication, complexity), **reliability** (potential bugs) and **security** (vulnerabilities and hotspots). The philosophy: analyze **every pull request**, so new code arrives clean.

### The three configuration concepts that matter

- **Quality gate**: the threshold that marks the analysis as passed/failed (minimum coverage, maximum duplication, new issues). It's what turns the analysis into a **blocking gate** in the pipeline.
- **Different quality gates per repo type**: you can't demand product-repo coverage from a *test* repository (tests don't have tests). Solution: a dedicated quality gate with adapted thresholds — otherwise the automation repo's scan will fail forever.
- **Clean as You Code**: in projects with history, analyze **only the new code**. You demand cleanliness in what's touched today without the accumulated debt blocking every PR.

### In the pipeline (Bitbucket Pipelines)

Java/Maven project with JaCoCo coverage:

```yaml
image: maven:3.8.7-openjdk-18

clone:
  depth: full          # Sonar needs the full history to attribute issues

definitions:
  caches:
    sonar: ~/.sonar/cache
  steps:
    - step: &build-sonarcloud
        name: Build and analyze on SonarCloud
        caches: [maven, sonar]
        script:
          - mvn -B org.jacoco:jacoco-maven-plugin:prepare-agent compile
              org.sonarsource.scanner.maven:sonar-maven-plugin:sonar

pipelines:
  pull-requests:
    '**':
      - step: *build-sonarcloud
```

Node/TS project with the official pipe and **differential PR analysis** (Sonar decorates the pull request itself):

```yaml
- step: &sonarcloud-pr
    name: SonarCloud
    caches: [sonar]
    script:
      - pipe: sonarsource/sonarcloud-scan:3.1.0
        variables:
          SONAR_TOKEN: ${SONAR_TOKEN}   # SECRET CI variable, never in the repo
          EXTRA_ARGS: '-Dsonar.pullrequest.key=${BITBUCKET_PR_ID}
                       -Dsonar.pullrequest.branch=${BITBUCKET_BRANCH}
                       -Dsonar.pullrequest.base=${BITBUCKET_PR_DESTINATION_BRANCH}'
```

### In the IDE: SonarLint in connected mode

SonarLint runs the rules locally as you type. The key is **connected mode**: you link the local project to the remote one and it **downloads the ruleset and quality profile from the server**. Developer and pipeline apply exactly the same rules — no more "that warning didn't show up in my IDE".

## Checkstyle (Java): the shape of the code

Complementary to Sonar: Checkstyle watches the **shape** (imports, indentation, naming, javadoc); Sonar also watches the **health**. Details of a mature setup:

- Start from a public standard (Google Checks) and derive your **own ruleset in XML, versioned in the repo** — e.g. a relaxed variant for test repositories.
- In automation repos: enable scanning of **test sources** (`includeTestSourceDirectory` in Gradle; "including tests" in the IDE plugin) — all your code lives in `src/test`.
- Align the **IDE's auto-formatting** with the rules (import the Checkstyle config as a Code Style Scheme): automatic formatting produces code that already passes.

```groovy
plugins {
    id 'java'
    id 'checkstyle'
}
checkstyle {
    toolVersion = '10.12.4'
    configFile = file('qa-custom-checkstyle.xml')
}
```

In the pipeline, `mvn checkstyle:check` (or `./gradlew checkstyleTest`) + the `atlassian/checkstyle-report` pipe, which turns the XML into **annotations on the PR diff** (Code Insights).

## ESLint (Node/TS): the same role, plus an integration trick

In the JS/TS ecosystem, Checkstyle's role is played by ESLint (config versioned in the repo — works with any IDE). The elegant trick for CI:

```bash
npx eslint --format=checkstyle -o checkstyle-result.xml src
```

ESLint **emits XML in Checkstyle format**, so the same reporting pipe works for Java and for Node — a single review experience across the PRs of every repo.

Daily usage: `npx eslint src`, `npx eslint --fix path` to auto-fix. With Playwright, add [`eslint-plugin-playwright`](/automation/typescript-for-qa).

## The full picture

| When | What runs | What for |
|---|---|---|
| While you type | Connected SonarLint + Checkstyle/ESLint plugin | Feedback at zero cost |
| On every PR | Sonar (differential) + Checkstyle/ESLint as Code Insights | Blocking quality gate |
| On every merge to develop | Same, on the branch | Catch what slipped through |
