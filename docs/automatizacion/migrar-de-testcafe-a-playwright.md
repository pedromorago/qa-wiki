# Migrar de TestCafe a Playwright: caso real

Participé en la migración completa de una suite E2E de TestCafe (3+ años de historia, ~383 tests) a Playwright con TypeScript. Esto es lo que aprendí — los números, el método y las trampas.

## Por qué migramos

- **Tiempo de ejecución**: la ejecución en TestCafe era esencialmente secuencial; con la suite creciendo, el CI se convirtió en cuello de botella.
- **Cookies y llamadas API**: preparar datos vía API dentro de los tests (necesitando el token de sesión) era una pelea constante con los métodos nativos de TestCafe.
- **Flakiness**, especialmente en los tests que actuaban sobre un **iframe** (un editor visual embebido — nuestro peor caso).

## La PoC: valida el framework contra tus peores tests

En lugar de migrar los tests fáciles para lucir una PoC bonita, elegimos deliberadamente **los tests más flaky y los del iframe** (~21 tests de todos los dominios). Si Playwright sobrevivía a eso, sobreviviría a todo.

Resultados medidos (misma suite, Firefox):

| Suite | TestCafe (secuencial) | Playwright (consola, paralelo) |
|---|---|---|
| Dominio A — 6 tests | 2 min 56 s (con 2/6 fallando) | **30,5 s (6/6 en verde)** |
| Suite B — 2 tests | 1 min 20 s | **24,2 s** |

**~5-6× más rápido y más estable**: tests que fallaban en TestCafe pasaron en Playwright. Además la PoC validó lo crítico: iframes (`FrameLocator`), obtención del token de sesión desde las cookies del contexto (trivial en Playwright), tags, reporte HTML, paralelización y ejecución en Docker con la imagen oficial.

Detalle de método: la PoC se hizo **en JavaScript** (nuestro lenguaje de entonces — así evaluábamos el framework, no el lenguaje) y el proyecto definitivo en **TypeScript**.

## Estimar la migración con datos, no con fe

La parte que más veces he visto hacer mal. Nuestro método:

1. **Inventario**: todos los tests por dominio y tipo (sanity/regression/key workflow) → 383 totales, 362 pendientes tras la PoC.
2. **Velocidad real medida en la PoC**: un QA senior migró **6 tests/día** (incluyendo curva de aprendizaje JS→TS).
3. **Plan**: 4 QA × ~6 tests/día ≈ 16 días por persona (~3 semanas) — declarado explícitamente como escenario optimista, con los riesgos listados: curva de aprendizaje, elementos difíciles de localizar, prioridades de los squads, releases y reviews.

Dos reglas de higiene que funcionaron muy bien:

- **Empezar por la sanity**: cobertura de lo core cuanto antes; la regresión larga después.
- **Borrar cada fichero TestCafe en cuanto su contenido está migrado.** En un repo mixto, el código zombi confunde y duplica mantenimiento; el progreso además queda visible.

## La mecánica de la migración

**Tests**: el cambio principal es instanciar los page objects con `page`:

```js
// TestCafe
await mainMenuTasks.goTo('AUDIT-LOG');
await auditLogQuestions.validateTitleExists();
```

```ts
// Playwright
const mainMenu = new MainMenu(page);
await mainMenu.goTo('AUDIT-LOG');
const auditLog = new AuditLog(page);
await auditLog.validateTitleExists();
```

**POM**: de las tres carpetas por página (UI/Tasks/Questions) a [una clase por página](/automatizacion/page-object-model); el objeto global `t` de TestCafe desaparece en favor de métodos sobre locators tipados.

**Aserciones** — la trampa sutil que explica el "flakiness residual" tras migrar:

```ts
// ❌ patrón migrado literal: NO reintenta
await expect(this.success.innerText()).resolves.toBe(msg);
expect(await locator.isVisible()).toBe(true);

// ✅ aserciones web-first: reintentan hasta el timeout
await expect(this.success).toHaveText(msg);
await expect(locator).toBeVisible();
```

**Servicios API y datos**: mismas clases en `.ts`, token de sesión desde las cookies del contexto (`getAccessToken(page)`), y los datos mock convertidos a **factorías tipadas** con generación aleatoria.

**Mínimo privilegio de serie**: cada entidad se testea con un usuario que tiene solo el permiso de esa acción (no el admin). Truco: la spec OpenAPI del backend te dice qué permiso exige cada endpoint.

## Lecciones

1. PoC contra tus peores tests, no contra los más bonitos.
2. Mide tu velocidad de migración antes de comprometer un plan — y lista los riesgos.
3. PoC en el lenguaje conocido, producto en el lenguaje correcto.
4. Alinearse con el stack del equipo de frontend (TypeScript) trajo estándares y soporte gratis.
5. Guías cortas de "cómo migrar X" (tests, POM, API, datos) permitieron paralelizar entre 4 personas sin pisarnos.
6. Las aserciones web-first son la mitad de la estabilidad que ganas con Playwright — úsalas desde el primer test migrado.
