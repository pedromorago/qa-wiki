# Configurar y organizar una suite de Playwright

Las decisiones de `playwright.config.ts`, la gestión de entornos y el sistema de tags que hace que una suite grande siga siendo manejable.

## Timeouts: ajústalos a tu aplicación

Los defaults de Playwright (30 s por test, 5 s por aserción) se quedan cortos en aplicaciones pesadas. En la nuestra:

```ts
export default defineConfig({
  timeout: 3 * 60 * 1000,             // test: 3 min
  expect: { timeout: 2 * 60 * 1000 }, // aserciones: 2 min
});
```

Con matiz: un timeout alto desbloquea, pero también puede **enmascarar problemas de rendimiento**. Si una pantalla necesita 90 segundos para cargar, el test no es el problema.

## Paralelización

```ts
fullyParallel: true,
workers: process.env.CI ? 2 : 4,   // menos workers en CI (máquinas más pequeñas)
```

Playwright paraleliza por fichero (los tests de un mismo fichero van en orden en el mismo worker). Requisito previo: [tests independientes con datos propios](/cicd/paralelizacion-y-sharding).

## Projects: navegadores y variantes

```ts
projects: [
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } },
  },
  {
    name: 'chrome',
    use: {
      ...devices['Desktop Chrome'],
      channel: 'chrome',        // Chrome "de verdad", no Chromium
      viewport: { width: 1920, height: 1080 },
      bypassCSP: true,          // apps con Content Security Policy estricta
    },
  },
],
```

Selección por CLI: `--project=firefox`. Viewport fijo = estabilidad visual. Y ojo: **cada motor se comporta distinto con certificados y localhost en Docker** — valida cada navegador en CI por separado; que funcione en Firefox no garantiza Chromium/WebKit.

## Variables de entorno

`.env` en la raíz (fuera de git), cargado desde el config con dotenv:

```ts
dotenv.config({ path: path.resolve(__dirname, '.env') });
```

```ini
BASE_URL=http://localhost:8080
API_TOKEN=<token-del-usuario-de-pruebas>
ADMIN_USER_NAME=<usuario>
ADMIN_USER_PASSWORD=<password>
```

- En local, cada persona apunta a su despliegue; en CI, las mismas variables se inyectan desde el pipeline (los secretos, como variables secretas del CI — nunca en el repo).
- Las constantes no sensibles (URLs por módulo, nombres de permisos) van en ficheros TS versionados — autocompletado y un solo punto de cambio.

## Organizar con metadata: las tres dimensiones

Cada test lleva tres tipos de metadata:

```ts
test('Try to get assets without permissions', {
  tag: ['@sanity', '@enterprise', '@community'],
}, async ({ page }) => {
  qase.id(1830);
  // ...
});
```

1. **Tipo de test**: `@smoke`, `@sanity`, `@regression` — decide en qué batería corre.
2. **ID del caso en el gestor** (Qase/TestRail…): **la primera sentencia del test**, para que el resultado se publique siempre.
3. **Edición del producto** (si aplica): `@enterprise`, `@community`, o ambos.

### Filtrado en ejecución

`--grep` con **lookaheads de regex** para combinar dimensiones con lógica AND:

```bash
# una dimensión
npx playwright test --grep "(?=.*@sanity)"

# AND de varias (tipo + edición), parametrizado desde el pipeline
npx playwright test --grep "(?=.*@$TEST_TYPE)(?=.*@$EDITION)"
```

Las variables vienen del entorno: el mismo comando sirve para cualquier combinación en cualquier pipeline.

### El detalle del skip

Si saltas un test, el `test.skip()` va **después** del `qase.id()` — si no, el gestor de casos no asocia el resultado y ese caso desaparece del radar del test run:

```ts
test('Delete pattern when the ref is duplicated', { tag: ['@regression'] }, async () => {
  qase.id(1043);
  test.skip(true, 'Pending to fix');
});
```

## Gotcha de fixtures que te encontrarás

`context` y `page` **no existen en `beforeAll`** (se crean por test). Si necesitas reutilizar una página entre tests — o grabar vídeo, que es opción del contexto — crea el contexto a mano:

```
Error: "context" and "page" fixtures are not supported in "beforeAll"
since they are created on a per-test basis.
```

```ts
test.beforeEach(async ({ browser }) => {
  context = await browser.newContext();   // aquí puedes pasar recordVideo, etc.
  page = await context.newPage();
});
test.afterEach(async () => { await context.close(); });
```
