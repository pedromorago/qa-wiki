# Playwright: primeros pasos

Lo esencial para arrancar con Playwright en un proyecto serio: estructura, primer test y — lo más importante — cómo debuggear.

## Instalación y arranque

```bash
npm init playwright@latest   # proyecto nuevo
npx playwright install       # descargar los navegadores
npx playwright test          # ejecutar todo
npx playwright test src/tests/usuarios/crear-usuario.spec.ts   # un spec concreto
```

En un proyecto real hay un paso previo que se olvida en los tutoriales: **preparar el acceso por API** de la aplicación bajo prueba (activarla, generar un token para el usuario de pruebas), porque los tests bien hechos preparan sus datos vía API antes de tocar la UI.

## Estructura de proyecto que me funciona

| Carpeta | Contenido | Regla |
|---|---|---|
| `src/tests/` | Specs, organizados **por dominio funcional** | Cada test en la carpeta de su dominio |
| `src/pages/` | Page Objects (una clase por página/modal/lista) | Revisar lo existente antes de crear métodos nuevos |
| `src/api/` | Servicios API para preparar datos | Ídem: mira si ya existe el servicio |
| `src/data/` | Factorías de datos mock tipadas | Reutiliza las interfaces |
| `src/files/` | Recursos estáticos (imágenes, XML…) | |
| `src/helpers/` | Utilidades transversales (p. ej. login con distintos usuarios) | Helper solo si Playwright no lo trae y se usa en varios tests |

## El primer test (y la grabadora)

La extensión oficial de VS Code (`ms-playwright.playwright`) trae dos funciones que uso constantemente:

- **Record new**: abre un navegador y escribe el test según interactúas. Como *borrador*, no como test final:

```ts
import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByLabel('Email or username').fill('user@example.com');
  await page.getByLabel('Password').fill('<password>');
  await page.getByTestId('submit-button').click();
});
```

- **Pick locator**: hover sobre cualquier elemento y te enseña el locator que Playwright sugiere. Salvavidas cuando un elemento se resiste.

El flujo maduro: grabar para **descubrir selectores y acciones**, y luego encapsular eso en el [Page Object Model](/es/automation/page-object-model) con locators nativos (`getByRole`, `getByLabel`, `getByTestId`…), que son los más resilientes.

## Debuggear: la parte que te hace rápido

De menos a más interactivo:

1. **Reporte HTML** — tras cada ejecución: `npx playwright show-report`. En CI se publica como artefacto del pipeline y te lo descargas.
2. **Trace viewer** — la joya de Playwright. El reporte incluye trazas (`.zip`); las reproduces en local **exactamente como ocurrieron en CI**:

   ```bash
   npx playwright show-trace path/to/trace.zip
   ```

   Snapshot del DOM antes/después de cada acción, consola, red, código. Es la forma estándar de responder a "en CI falla y en local no".
3. **UI mode** — `npx playwright test --ui` (filtrable: `npx playwright test tests/usuarios --ui`). *Time travel* por cada acción, watch mode, elección de navegador. Para desarrollar tests, imbatible.

::: warning No midas tiempos en UI mode
El UI mode es notablemente más lento que la ejecución por consola (en una medición interna: 54,9 s vs 30,5 s la misma suite). Para comparar rendimiento, siempre consola.
:::
