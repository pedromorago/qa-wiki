# Jenkins y GitLab CI

Los conceptos de una pipeline son los mismos en todas las herramientas; lo que cambia es el vocabulario y dónde se configura. Si ya conoces una (Bitbucket Pipelines, GitHub Actions), aprender Jenkins o GitLab CI es sobre todo **traducir términos**.

## El diccionario de equivalencias

| Concepto | Jenkins | GitLab CI | GitHub Actions / Bitbucket |
|---|---|---|---|
| Definición | `Jenkinsfile` (en el repo) | `.gitlab-ci.yml` | `.github/workflows/*.yml` / `bitbucket-pipelines.yml` |
| Unidad de trabajo | stage / step | stage / job | job / step |
| Quién ejecuta | agente (nodo) | runner | runner |
| Resultados que se guardan | artifacts | artifacts | artifacts |
| Cuándo se dispara | triggers (webhook, cron…) | rules / only | on: push, pull_request… |
| Secretos | Credentials | CI/CD Variables (masked) | Secrets / variables protegidas |

## Jenkins en lo esencial

El decano: un servidor (a menudo autogestionado) con un ecosistema de plugins enorme. La pipeline se define en un `Jenkinsfile` declarativo versionado en el repo:

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
      junit 'reports/**/*.xml'   // publica resultados de tests
    }
  }
}
```

Lo que conviene saber como QA: los **agentes** (dónde corre cada stage — importa para navegadores y recursos), el bloque **`post`** (publicar reports aunque los tests fallen) y que la flexibilidad de los plugins es también su mantenimiento.

## GitLab CI en lo esencial

Integrado en GitLab, configuración 100 % YAML en `.gitlab-ci.yml`:

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

Las piezas útiles: **`image`** (cada job corre en un [contenedor Docker](/es/cicd/docker-for-qa) — el entorno del test va declarado), **`artifacts.when: always`** (el report se guarda también cuando falla, que es cuando más lo necesitas) y **`rules`** (qué corre en cada contexto, la base de las [validaciones por entorno](/es/cicd/environment-validations)).

## Lo que no cambia de herramienta

- Los tests se organizan por etapas de confianza creciente ([validaciones por entorno](/es/cicd/environment-validations)).
- La suite larga se reparte ([paralelización y sharding](/es/cicd/parallelization-and-sharding)); tanto GitLab (`parallel`) como Jenkins lo soportan.
- Los reports se publican como artefactos **siempre**, no solo en verde.
- Los secretos van en el gestor de la herramienta, nunca en el YAML.

## Errores comunes

- **Pipelines decorativas**: si el rojo no bloquea el merge, la pipeline es un adorno.
- **No guardar artefactos en fallo** — justo la ejecución que necesitas investigar es la que no deja rastro.
- **Copiar YAML sin entender los triggers**: acabas ejecutando la suite completa en cada push de cada rama, o peor, no ejecutando nada donde importa.

::: tip Idea clave
Aprende los conceptos (stages, runners, artefactos, triggers, secretos) y las herramientas se vuelven intercambiables. La pregunta de QA es siempre la misma: ¿qué se ejecuta, cuándo, y qué pasa cuando falla?
:::

## Referencias

- [Documentación de Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [Documentación de GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
