# Cypress: patrones que funcionan

Con [los primeros pasos](/es/automation/cypress-first-steps) se escribe un test; con estos patrones se mantiene una suite. Son los que marcan la diferencia entre una suite estable y una que "falla a veces".

## Custom commands: el login una sola vez

Los flujos repetidos se convierten en comandos propios en `support/commands.ts`. El caso universal es el login, y con `cy.session` la sesión se **cachea entre tests**: el login real ocurre una vez, no en cada test.

```js
Cypress.Commands.add('login', (user = 'agente-comercial') => {
  cy.session(user, () => {
    cy.visit('/login');
    cy.get('[data-cy=email]').type(Cypress.env(`${user}_email`));
    cy.get('[data-cy=password]').type(Cypress.env(`${user}_password`), { log: false });
    cy.get('[data-cy=submit]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

```js
beforeEach(() => cy.login());
```

Solo con esto, una suite lenta puede recortar minutos enteros.

## cy.intercept: el superpoder de la red

`cy.intercept` observa o sustituye las peticiones que hace la aplicación. Sus tres usos:

**1. Esperar por la red en vez de por tiempo** (adiós `cy.wait(3000)`):

```js
cy.intercept('GET', '/api/catalog/products').as('getCatalog');
cy.visit('/catalogo');
cy.wait('@getCatalog');                 // espera exactamente a esa respuesta
cy.contains('Fibra 1 Gbps');
```

**2. Simular respuestas** con un fixture (el frontend se prueba sin depender del backend):

```js
cy.intercept('GET', '/api/service-orders*', { fixture: 'pedidos-en-provisioning.json' });
```

**3. Forzar los casos difíciles** que en un entorno real cuesta provocar:

```js
cy.intercept('POST', '/api/service-orders', { statusCode: 500 }).as('orderFails');
cy.get('[data-cy=confirm-order]').click();
cy.contains('No se pudo crear el pedido');   // ¿la UI gestiona bien el error?
```

La regla de equilibrio: simular la red prueba el frontend **aislado**; los flujos críticos (contratar un servicio de verdad) necesitan también tests contra el backend real. Ambos tipos, con intención — es la [pirámide](/es/fundamentals/the-testing-pyramid) aplicada dentro del E2E.

## Organización que escala

- **Un spec por flujo de negocio** (`contratacion.cy.ts`, `catalogo.cy.ts`), no por página.
- **Estado por API, verificación por UI**: el cliente y el pedido de partida se crean por API (más rápido y estable) y la UI se usa para lo que se está probando de verdad.
- **¿Page objects?** En Cypress el POM clásico pesa menos que en Selenium: la combinación de `data-cy` + custom commands cubre la mayoría de la reutilización. Para pantallas complejas (un configurador de tarifas), [un page object](/es/automation/page-object-model) sigue siendo razonable.
- **Retries en CI**: `retries: { runMode: 2 }` en la config da margen frente a inestabilidad de entorno — pero un test que necesita retries siempre está pidiendo una investigación, no un tercer intento.

## En la pipeline

```bash
npx cypress run --browser chrome --spec "cypress/e2e/contratacion/**"
```

- Vídeos y screenshots de los fallos quedan en `cypress/videos` y `cypress/screenshots`: publícalos como artefacto **siempre**, [también en rojo](/es/cicd/jenkins-and-gitlab-ci).
- La suite larga se reparte entre contenedores por specs: el criterio está en [paralelización y sharding](/es/cicd/parallelization-and-sharding).

## Errores comunes

- **Stubbearlo todo.** Una suite que solo habla con mocks aprueba aunque el backend esté roto; reserva un subconjunto E2E real para los flujos de negocio críticos.
- **No usar `cy.session`** y pagar un login completo por test.
- **Aserciones débiles** (`should('exist')` donde tocaba verificar contenido): el test pasa, el bug también.
- **Un solo spec gigante**: imposible de paralelizar y de leer.

::: tip Idea clave
Los tres multiplicadores de una suite Cypress sana: sesión cacheada con `cy.session`, red controlada con `cy.intercept`, y estado preparado por API. Todo lo demás es escribir buenos casos de prueba.
:::

## Referencias

- [Cypress — Best practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress — cy.intercept](https://docs.cypress.io/api/commands/intercept)
- [Cypress — cy.session](https://docs.cypress.io/api/commands/session)
