# BDD con Cucumber

**BDD** (Behavior-Driven Development) es una práctica de colaboración: negocio, desarrollo y QA definen el comportamiento esperado **con ejemplos concretos antes de construir**. Cucumber es la herramienta que convierte esos ejemplos en tests ejecutables. El orden importa: primero la colaboración, después la herramienta.

## Gherkin: ejemplos que se ejecutan

Los ejemplos se escriben en Gherkin, un formato legible por cualquiera:

```gherkin
Característica: Descuento por volumen

  Escenario: Pedido que supera el umbral de descuento
    Dado un cliente con 3 artículos de 40 € en el carrito
    Cuando confirma el pedido
    Entonces el total aplicará un descuento del 10 %
```

- **Dado** (Given) — el estado de partida.
- **Cuando** (When) — la acción que se prueba.
- **Entonces** (Then) — el resultado observable esperado.
- **Esquema del escenario** (Scenario Outline) — el mismo escenario con tabla de ejemplos: varios casos, un solo texto.

## Step definitions: el pegamento

Cada paso de Gherkin se une a código mediante una *step definition* (en Java, JavaScript, etc.):

```java
@Cuando("confirma el pedido")
public void confirmaElPedido() {
    checkoutPage.confirm();
}
```

El código de los steps debe ser fino: delega en page objects o clientes de API. Si la lógica vive en los steps, tienes un framework difícil de mantener con sintaxis rara.

## Cuándo aporta BDD (y cuándo es teatro)

Aporta cuando:

- **Negocio participa de verdad** en escribir o revisar los ejemplos: el Gherkin es el lenguaje común y la documentación viva.
- Los ejemplos se definen **antes** de desarrollar (three amigos, [criterios de aceptación](/es/strategy/acceptance-criteria-and-dor)): el escenario es la especificación.

Es teatro cuando nadie de negocio lee el Gherkin y solo es una capa de sintaxis sobre los tests de siempre. En ese caso añade mantenimiento (dos niveles: features y steps) sin añadir comunicación — mejor un framework de tests directo.

## Buenas prácticas mínimas

- **Escenarios declarativos, no imperativos**: "Dado un usuario registrado" y no ocho pasos de rellenar formularios. El *cómo* vive en los steps.
- **Un comportamiento por escenario**, con un Entonces claro.
- **Vocabulario consistente** (lenguaje ubicuo): mismos términos en Gherkin, código y conversaciones.
- Los tags (`@smoke`, `@regression`) organizan la ejecución por suites.

::: tip Idea clave
BDD no va de escribir tests en "lenguaje natural": va de descubrir los requisitos con ejemplos antes de construir. Si esa conversación no ocurre, Cucumber solo es una forma más cara de escribir tests.
:::

## Referencias

- [Documentación de Cucumber](https://cucumber.io/docs/)
- [Referencia de Gherkin](https://cucumber.io/docs/gherkin/reference/)
