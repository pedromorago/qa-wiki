# Page Object Model en Playwright

El POM es el patrón que separa **qué hace el test** (lenguaje de negocio) de **cómo se hace en la UI** (selectores y clics). Aquí, las decisiones de diseño que mejor nos han funcionado — incluida alguna contraintuitiva.

## Una clase por página (no tres)

Vengo de un proyecto donde el POM estaba dividido en tres carpetas por página — `UI` (selectores), `Tasks` (acciones), `Questions` (aserciones), estilo Screenplay. Al crecer el proyecto, esa separación multiplicaba ficheros y fricción.

La decisión al migrar: **una única clase por página/modal/lista** que consolida selectores + acciones + aserciones. Para no perder legibilidad en clases largas, regiones plegables del editor:

```ts
// #region Selectors ... // #endregion
// #region Actions ...   // #endregion
// #region Assertions ... // #endregion
```

## `page` por constructor, no por método

Dos opciones para inyectar el `page`:

```ts
// A: por método — explícito pero repetitivo y propenso a pasar el page equivocado
await userFormTasks.fillForm(page, userData);

// B: por constructor — limpio, OOP, y CADA TEST CREA SU PROPIA INSTANCIA
const userForm = new UserFormPage(page);
await userForm.fillForm(userData);
```

Elegimos B. El motivo decisivo no es la estética: con una instancia por test, el POM queda **aislado en ejecución paralela** — sin estado compartido entre workers.

## Locators como propiedades, inicializados en el constructor

```ts
import { Page, Locator } from '@playwright/test';

export class EditorPage {
  // #region Selectors
  private editorFrame: Locator;
  private save: Locator;

  constructor(private page: Page) {
    this.editorFrame = this.page.locator('#editor-iframe');
    this.save = this.page.getByTestId('btn-save');
  }
  // #endregion

  // #region Actions
  async saveChanges(): Promise<void> {
    await this.save.click();
  }
  // #endregion
}
```

Todo locator centralizado y tipado (`Locator`/`FrameLocator` — los iframes se tratan como una propiedad más). Prioridad a los locators user-facing: `getByRole`, `getByText`, `getByLabel`, `getByTestId`.

### Locators dinámicos parametrizados

Cuando hay N elementos similares (filas de tabla), el locator se genera con una función que recibe el dato — apunta al elemento exacto sin importar su posición en el DOM:

```ts
private readonly list: { row: (data: string) => Locator };

constructor(private readonly page: Page) {
  this.list = { row: (data: string) => this.page.getByTestId(`row-${data}`) };
}

async validateRow(name: string): Promise<void> {
  await expect(this.list.row(name)).toBeVisible();
}
```

Y de paso, la regla anti-flaky más rentable: **aserciones web-first** (`await expect(locator).toBeVisible()`), que reintentan solas, en vez de evaluar booleanos (`expect(await locator.isVisible()).toBe(true)`), que no reintentan.

## SOLID aplicado: el caso de los diálogos

El anti-patrón que refactorizamos: una clase `Dialog` monolítica con decenas de locators de diálogos distintos y un `validateFields(tipo, ventana, …)` con un switch gigante. Cualquier cambio en un diálogo afectaba a toda la clase (violación de SRP).

El refactor: **clase base con lo común + una subclase por diálogo**:

```ts
// base/Dialog.ts — solo lo común a todos los diálogos
export class Dialog {
  protected readonly title: Locator;
  protected readonly confirm: Locator;

  constructor(protected page: Page) {
    this.title = page.locator('.dialog__title');
    this.confirm = page.getByTestId('primary-btn');
  }
}

// dialogs/DeleteDialog.ts — lo específico
export class DeleteDialog extends Dialog {
  async validateDeleteMessage(): Promise<void> {
    await expect(this.page.locator('.dialog-message'))
      .toHaveText('Are you sure you want to delete this item?');
  }
}
```

Añadir un diálogo nuevo = añadir una subclase, **sin tocar la base** (OCP). TypeScript lo habilita con clases abstractas y herencia — una de las razones para [automatizar en TS](/es/automation/typescript-for-qa).

## Dos patrones satélite

- **Objeto de "copies"**: los textos de la UI (títulos, labels de botones) centralizados en un objeto compartido — `getByRole('button', { name: copies.actions.import })`. Un cambio de texto se arregla en un sitio.
- **Composición**: un page object puede contener otros (`this.details = new UserFormPage(page)`), y un test compone varios (menú + página + diálogo). Componer > heredar, salvo para lo genuinamente común.
