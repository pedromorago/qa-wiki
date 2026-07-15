# Análisis estático: SonarCloud, Checkstyle y ESLint

El análisis estático examina el código **sin ejecutarlo** contra un conjunto de reglas. Es la puerta de calidad más barata que existe: detecta problemas cuando aún cuestan céntimos. Cómo se monta un setup completo — pipeline + IDE — para Java y para Node/TypeScript.

## SonarCloud: la salud del código

Detecta problemas en tres ejes: **mantenibilidad** (code smells, duplicación, complejidad), **fiabilidad** (bugs potenciales) y **seguridad** (vulnerabilidades y hotspots). La filosofía: analizar **cada pull request**, para que el código nuevo llegue limpio.

### Los tres conceptos de configuración que importan

- **Quality gate**: el umbral que marca el análisis como passed/failed (cobertura mínima, duplicación máxima, issues nuevos). Es lo que convierte el análisis en **puerta bloqueante** del pipeline.
- **Quality gates distintos por tipo de repo**: a un repositorio de *tests* no puedes exigirle la cobertura de un repo de producto (los tests no tienen tests). Solución: un quality gate específico con umbrales adaptados — si no, el escaneo del repo de automatización fallará eternamente.
- **Clean as You Code**: en proyectos con historia, analizar **solo el código nuevo**. Exiges limpieza en lo que se toca hoy sin que la deuda acumulada bloquee todas las PRs.

### En el pipeline (Bitbucket Pipelines)

Proyecto Java/Maven con cobertura JaCoCo:

```yaml
image: maven:3.8.7-openjdk-18

clone:
  depth: full          # Sonar necesita el historial completo para atribuir issues

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

Proyecto Node/TS con el pipe oficial y **análisis diferencial de PR** (Sonar decora la propia pull request):

```yaml
- step: &sonarcloud-pr
    name: SonarCloud
    caches: [sonar]
    script:
      - pipe: sonarsource/sonarcloud-scan:3.1.0
        variables:
          SONAR_TOKEN: ${SONAR_TOKEN}   # variable SECRETA del CI, jamás en el repo
          EXTRA_ARGS: '-Dsonar.pullrequest.key=${BITBUCKET_PR_ID}
                       -Dsonar.pullrequest.branch=${BITBUCKET_BRANCH}
                       -Dsonar.pullrequest.base=${BITBUCKET_PR_DESTINATION_BRANCH}'
```

### En el IDE: SonarLint en modo conectado

SonarLint ejecuta las reglas en local mientras escribes. La clave es el **modo conectado**: vinculas el proyecto local con el remoto y se **descarga el ruleset y el quality profile del servidor**. Desarrollador y pipeline aplican exactamente las mismas reglas — se acabó el "en mi IDE no salía ese warning".

## Checkstyle (Java): la forma del código

Complementario a Sonar: Checkstyle vigila la **forma** (imports, indentación, naming, javadoc); Sonar además la **salud**. Detalles de un setup maduro:

- Partir de un estándar público (Google Checks) y derivar un **ruleset propio en XML versionado en el repo** — p. ej. una variante relajada para repositorios de tests.
- En repos de automatización: activar el escaneo de **test sources** (`includeTestSourceDirectory` en Gradle; "including tests" en el plugin del IDE) — todo tu código vive en `src/test`.
- Alinear el **autoformateo del IDE** con las reglas (importar la config de Checkstyle como Code Style Scheme): el formateo automático produce código que ya pasa.

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

En pipeline, `mvn checkstyle:check` (o `./gradlew checkstyleTest`) + el pipe `atlassian/checkstyle-report`, que convierte el XML en **anotaciones sobre el diff de la PR** (Code Insights).

## ESLint (Node/TS): el mismo rol, y un truco de integración

En el ecosistema JS/TS el rol de Checkstyle lo cumple ESLint (config versionada en el repo — vale para cualquier IDE). El truco elegante para CI:

```bash
npx eslint --format=checkstyle -o checkstyle-result.xml src
```

ESLint **emite XML en formato Checkstyle**, así el mismo pipe de reporte sirve para Java y para Node — una única experiencia de revisión en las PRs de todos los repos.

Uso diario: `npx eslint src`, `npx eslint --fix ruta` para autocorregir. Con Playwright, añade [`eslint-plugin-playwright`](/automatizacion/typescript-para-qa).

## El cuadro completo

| Cuándo | Qué corre | Para qué |
|---|---|---|
| Mientras escribes | SonarLint conectado + plugin Checkstyle/ESLint | Feedback a coste cero |
| En cada PR | Sonar (diferencial) + Checkstyle/ESLint como Code Insights | Puerta de calidad bloqueante |
| En cada merge a develop | Ídem sobre la rama | Detectar lo que se coló |
