# Karate: API testing con sintaxis BDD

**Karate** es un framework de API testing que usa la sintaxis de Gherkin pero con un giro: **no hay step definitions que escribir**. Los pasos HTTP y las aserciones ya vienen definidos por el lenguaje del framework, así que el archivo `.feature` es el test completo.

## Cómo se ve un test

```gherkin
Feature: API de usuarios

  Background:
    * url baseUrl

  Scenario: Crear un usuario y verificar la respuesta
    Given path 'users'
    And request { name: 'Ana', email: 'ana@example.com' }
    When method post
    Then status 201
    And match response == { id: '#number', name: 'Ana', email: 'ana@example.com' }

  Scenario: El usuario creado aparece en el listado
    Given path 'users'
    When method get
    Then status 200
    And match response[*].email contains 'ana@example.com'
```

Lo distintivo está en `match`: un lenguaje de aserciones que entiende JSON de forma nativa, con marcadores como `#number`, `#string`, `#uuid` o `#notnull` para validar estructura sin fijar valores exactos — una forma ligera de [validación de esquema](/es/api-testing/json-schema-validation).

## Qué trae de serie

- **HTTP completo**: paths, headers, params, autenticación, ficheros.
- **JSON y XML como ciudadanos de primera**: se escriben tal cual en el test, sin escapado ni builders.
- **Data-driven**: `Scenario Outline` con tablas, o leyendo datos de ficheros JSON/CSV.
- **Reutilización**: features que llaman a otras features (por ejemplo, un login compartido).
- Extras del mismo framework: **mocks de API** (dobles para integración) y hasta pruebas de rendimiento sobre los mismos features (con Gatling).

## Karate o REST Assured

| | Karate | REST Assured (+ JUnit) |
|---|---|---|
| El test es | Un `.feature` autocontenido | Código Java |
| Curva de entrada | Baja: productivo en horas | Media: requiere el ecosistema Java |
| Lógica compleja | Posible (JS embebido) pero se ensucia rápido | Natural: es código |
| Encaja cuando | El equipo mezcla perfiles y prima la legibilidad | La suite es grande y vive como [un proyecto de software](/es/api-testing/api-framework-architecture) |

Mi criterio: Karate brilla para cubrir APIs rápido con tests legibles por todo el equipo; cuando la suite crece en lógica (datos dinámicos complejos, helpers, tipado), un framework en código escala mejor.

## Errores comunes

- **Meter lógica compleja en los features** con JavaScript embebido: cuando un feature parece un programa, tocaba framework de código.
- **Fijar valores que no controlas** (ids, fechas) en `match` en vez de usar marcadores `#…`.
- **No usar `Background`/features compartidas** y repetir el setup en cada escenario.

::: tip Idea clave
Karate elimina la capa que hace pesado a Cucumber (las step definitions) a cambio de un lenguaje propio. Para API testing legible y rápido de escribir es una gran opción; solo vigila el momento en que tus features empiezan a ser programas.
:::

## Referencias

- [Karate — documentación oficial](https://github.com/karatelabs/karate)
