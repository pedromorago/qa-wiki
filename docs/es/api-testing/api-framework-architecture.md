# Arquitectura de un framework de API testing

Notas sobre cómo se estructura un framework de automatización de APIs en **Java + JUnit 5 + REST Assured**, basadas en el framework con el que trabajo a diario. Los principios aplican igual con otros stacks (pytest + requests, Playwright API testing…).

## El objetivo: que el tester solo escriba tests

Un framework de testing es un producto interno. Su misión es dar un **esqueleto funcional** para que quien escribe tests se concentre en definir servicios y casos, no en resolver autenticación, reporting o ejecución en CI cada vez. Principios de diseño:

- **Escalable**: un único framework que sirva a varios equipos, sin duplicar esfuerzo.
- **Mantenible**: pensado a largo plazo; que un cambio en la API no obligue a reescribir mil tests.
- **Integrado en el ecosistema** (cultura DevOps): pipelines, gestor de casos, tracker y repositorio hablan entre sí a través del framework.

## Las tres capas

```
┌──────────────────────────────────────────────┐
│  Capa de casos de prueba                     │  ← QUÉ se valida
│  (escenarios que validan features)           │
├──────────────────────────────────────────────┤
│  Capa de service objects                     │  ← CÓMO se habla con la API
│  (un objeto por servicio/endpoint)           │
├──────────────────────────────────────────────┤
│  Capa de infraestructura                     │  ← DÓNDE y CON QUÉ
│  (librerías, CI/CD, reporting, logs)         │
└──────────────────────────────────────────────┘
```

La pieza clave es el **service object**: el equivalente al Page Object de UI, pero para API. Cada servicio encapsula *todas* las interacciones con su endpoint. Si el endpoint cambia, cambia su service object — **los tests no se enteran**.

```java
public class UsersService extends ServiceBase {
    public ValidatableResponse createUser(Object body) { ... }
    public ValidatableResponse getUser(String userId) { ... }
    public ValidatableResponse deleteUser(String userId) { ... }
}
```

Todos los servicios heredan de un `ServiceBase` que concentra lo común (autenticación, construcción de la request, métodos HTTP). Heredar de una base común no es solo ahorrar código: **fuerza** a que todo el mundo autentique y construya requests de la misma manera.

## Organización del proyecto

```
src/test/java/
├── cases/       # tests, organizados por versión de API → dominio → feature
│   └── v2/catalog/products/CreateProductTest.java
├── suites/      # suites JUnit por dominio
├── services/    # service objects (mismo criterio de organización)
├── model/       # POJOs de request/response
└── helpers/     # utilidades: datos aleatorios, creación de usuarios…
src/test/resources/
├── env/         # un directorio de config por entorno
│   └── local/config.properties
└── schemas/     # JSON Schemas por versión → servicio (+ genéricos reutilizables)
```

Dos detalles que me parecen muy acertados:

- **Multi-entorno por properties**: cada entorno tiene su `config.properties` (base URL, credenciales de administración, flags). El test se apunta a uno vía variable de entorno, sin tocar código:

  ```bash
  ENV_PATH=local TEST_SUITE=V2Catalog ./gradlew :test --tests $TEST_SUITE
  ```

- **Suites por dominio de producto**: en el día a día no se lanzan tests sueltos sino suites (`@Suite` + `@SelectPackages("cases.v2.catalog")`), que es exactamente como se organizan los pipelines. Suite = paquete = dominio: la misma unidad en código, ejecución y CI.

## Jerarquía de clases de test

Tres niveles de herencia que equilibran reutilización y rendimiento:

1. **`TestBase`** — global: ciclo de vida, logging, reporting (con un `TestWatcher` de JUnit 5).
2. **`<Dominio>TestBase`** — por dominio: declara los usuarios/datos compartidos como `protected static final`, de modo que se crean **una sola vez** para todas las clases del dominio.
3. **La clase de test concreta** — solo casos.

## Ciclo de vida con JUnit 5

Orden: `@BeforeAll` → (`@BeforeEach` → test → `@AfterEach`) × N → `@AfterAll`.

- `@BeforeAll` / `@AfterAll` deben ser `static` (JUnit crea una instancia nueva por test).
- `@BeforeAll`: crear los usuarios/datos compartidos del test.
- `@BeforeEach`: resetear estado si el test lo necesita limpio.
- Los hooks existen para **eliminar duplicación**, no para esconder lógica: si un hook hace algo que afecta al resultado del test, probablemente debería estar en el test.

::: tip Los tests deben ser atómicos
Regla previa a todo lo demás: cada test debe poder ejecutarse solo y en cualquier orden. Las suites agrupan, no encadenan.
:::

## Una fachada de aserciones propia

Todas las aserciones pasan por una clase utilitaria propia (p. ej. `TestCaseReport.assertResponseCode(...)`) en vez de llamar a JUnit/AssertJ directamente. Cada assert, además de validar, **escribe en el log y en el reporte HTML**. Tres ventajas:

1. Mensajes homogéneos en toda la suite.
2. Cada validación queda trazada en el reporte (no solo el fallo final).
3. Si mañana cambias de librería de aserciones, tocas una clase, no mil tests.
