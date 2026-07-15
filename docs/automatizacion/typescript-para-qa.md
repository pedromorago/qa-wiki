# TypeScript para QA

Por qué automatizo en TypeScript y no en JavaScript, y los estándares de código que aplico en el repositorio de tests.

## Por qué TypeScript

- **Tipado estático**: los errores aparecen mientras escribes, no en el minuto 12 de la ejecución en CI.
- **Mantenibilidad**: en un repo de tests grande, el compilador es tu primera suite de tests.
- **POM de verdad**: clases abstractas, interfaces y herencia estricta ([SOLID en el POM](/automatizacion/page-object-model)).
- **Tooling**: autocompletado e integración de primera con VS Code.
- Y una razón organizativa que no sale en los tutoriales: **usar el mismo lenguaje que tu equipo de frontend**. Si el producto es React+TS, automatizar en TS te da estándares compartidos y soporte de sus expertos. Pregunta a tu equipo qué usa antes de decidir tu stack.

Anécdota de estrategia: nuestra PoC de Playwright se hizo en JavaScript *a propósito* (minimizar variables al evaluar el framework), y el proyecto definitivo en TypeScript. PoC en el lenguaje conocido; producto en el lenguaje correcto.

## Convenciones de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clases | `PascalCase` | `LoginPage`, `CustomFieldList` |
| Métodos y variables | `camelCase` | `openMenu()`, `navigateToProjects()` |
| Ficheros | `kebab-case` | `custom-field.list.ts` |

## Tipado que se nota

Firmas explícitas con objetos tipados, defaults y opcionales:

```ts
async find(component: { referenceId: string; name: string }, exist: boolean = true)
```

Autocompletado, uso correcto forzado y errores en desarrollo. La meta a medio plazo: **cero `any`** — cada objeto del dominio con su interfaz propia. (Confesión: tras una migración siempre quedan `any` sueltos. Se eliminan por iteraciones, pero hay que ponerlo en el plan o no ocurre.)

## ESLint con las reglas de Playwright

Configuración flat combinando tres capas: JS recomendado + TypeScript + **`eslint-plugin-playwright`** (reglas específicas: misuse de await, aserciones mal usadas, globals de Playwright):

```js
// eslint.config.mjs
import pluginJs from "@eslint/js";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import pluginPlaywright from "eslint-plugin-playwright";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: { parser: parserTs },
    plugins: { "@typescript-eslint": pluginTs },
    rules: { ...pluginTs.configs.recommended.rules },
  },
  {
    files: ["tests/**/*.ts"],
    plugins: { playwright: pluginPlaywright },
    rules: { ...pluginPlaywright.configs.recommended.rules },
  },
];
```

Consejo aprendido por las malas: las reglas *type-aware* (`no-floating-promises` y compañía) exigen conectar el `tsconfig` (project service). Es tentador desactivarlas para arrancar rápido — pero `no-floating-promises` es justo la regla que caza el bug número uno de Playwright: **el `await` olvidado**. Conéctalas en cuanto puedas.

En CI, ESLint emite formato **checkstyle** para que el pipeline pinte los findings como informe del build:

```bash
npx eslint --format=checkstyle -o checkstyle-result.xml src
```

El repositorio de tests pasa además por [SonarCloud como cualquier otro repo](/cicd/analisis-estatico) — el código de tests también es código.

## El checklist del automatizador

Mi checklist antes de dar una automatización por terminada:

- [ ] Locators nativos (`getByRole`, `getByTestId`…), sin selectores frágiles
- [ ] Reutilizado lo existente: POM, servicios API, factorías de datos, helpers
- [ ] Test en la carpeta de su dominio, con su [metadata completa](/automatizacion/configurar-y-organizar-playwright) (tags + ID del gestor)
- [ ] Sin `waitForTimeout` — aserciones web-first con auto-retry
- [ ] Pipeline en verde: ejecución + ESLint + Sonar, sin regresiones en tests estables
- [ ] Estado de automatización actualizado en el gestor de casos
