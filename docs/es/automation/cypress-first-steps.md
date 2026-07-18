# Cypress: primeros pasos

Cypress ejecuta los tests **dentro del navegador**, junto a la aplicación ([su arquitectura explica sus fortalezas y límites](/es/automation/e2e-tools-landscape)): feedback visual inmediato, debugging excelente y una API que se lee sola. Es una de las herramientas E2E más extendidas y con la que más años he trabajado.

## Instalación y arranque

```bash
npm install -D cypress
npx cypress open   # el runner interactivo: elegir navegador y ver los tests correr
npx cypress run    # modo headless: el de la pipeline
```

Estructura que genera:

```
cypress/
├── e2e/              # los tests: *.cy.ts
├── fixtures/         # datos de prueba en JSON
└── support/
    ├── commands.ts   # custom commands
    └── e2e.ts        # hooks globales
cypress.config.ts     # configuración (baseUrl, timeouts, retries…)
```

Lo primero que se configura siempre: el `baseUrl` en `cypress.config.ts`, para que los tests hagan `cy.visit('/catalogo')` y no URLs absolutas.

## El primer test

```js
describe('Catálogo de productos', () => {
  it('muestra el detalle de la fibra 1 Gbps', () => {
    cy.visit('/catalogo');
    cy.contains('Fibra 1 Gbps').click();
    cy.url().should('include', '/productos/fiber-1gbps');
    cy.get('[data-cy=monthly-price]').should('be.visible');
  });
});
```

Dos cosas que ya se ven aquí: los comandos se **encadenan** y las aserciones van con `should`.

## Los comandos esenciales

| Comando | Qué hace |
|---|---|
| `cy.visit('/ruta')` | Navegar (relativa al baseUrl) |
| `cy.get('[data-cy=…]')` | Seleccionar elementos |
| `cy.contains('texto')` | Seleccionar por texto visible |
| `.click()` / `.type('…')` / `.select('…')` | Interactuar |
| `.should('be.visible')` / `.should('contain', '…')` | Aseverar (con reintento automático) |
| `cy.intercept(…)` | Espiar o simular peticiones de red |

## La idea que hay que entender: retry-ability

Cypress **reintenta automáticamente** los `cy.get` y los `should` hasta que se cumplen o vence el timeout (4 s por defecto). Por eso casi nunca necesitas esperas manuales: `cy.get('[data-cy=order-status]').should('contain', 'Activo')` esperará sola a que el estado llegue.

La contrapartida: los comandos **no son promesas normales**. No se hace `await cy.get(...)` ni se guarda el resultado en una variable; se encadena o se usa `.then()`. Es la fuente número uno de confusión al empezar.

## Selectores con criterio

El selector recomendado es un atributo dedicado (`data-cy`), que no cambia cuando cambian estilos o textos:

```html
<button data-cy="confirm-order">Confirmar pedido</button>
```

```js
cy.get('[data-cy=confirm-order]').click();
```

Los selectores por clase CSS o por estructura (`div > ul li:nth-child(3)`) son los que convierten una suite en un castillo de naipes.

## Errores comunes

- **`cy.wait(3000)` fijos.** Si necesitas esperar, espera por algo concreto: una aserción o un alias de red (lo vemos en [patrones](/es/automation/cypress-patterns)).
- **Tratar los comandos como código secuencial normal**: mezclar variables y `cy.*` sin `.then()` produce tests que "pasan" sin probar nada.
- **Tests dependientes entre sí** (el test B usa lo que creó el test A): cada test debe preparar su propio estado.
- **Ignorar el modo interactivo.** `cypress open` con time-travel por cada comando es la mejor herramienta de debugging E2E que existe; úsala antes de pelearte con logs.

::: tip Idea clave
La curva de Cypress es corta porque la API se lee sola, pero el modelo mental (encadenamiento + reintento automático) es distinto al de un script normal. Interiorízalo primero y la herramienta juega a tu favor.
:::

## Referencias

- [Documentación de Cypress](https://docs.cypress.io/)
- [Cypress — Introduction to Cypress (el modelo mental)](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress)
