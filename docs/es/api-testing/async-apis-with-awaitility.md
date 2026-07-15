# Testing de APIs asíncronas con Awaitility

Hay operaciones que la API no resuelve en la propia petición: importaciones, generación de informes, borrados masivos… El patrón habitual es la **operación asíncrona**: la llamada responde al instante con un `operationId`, y el estado real se consulta en otro endpoint. ¿Cómo se testea eso sin `Thread.sleep`?

## El patrón async en la API

La petición se marca como asíncrona (una cabecera tipo `X-Async: true`, o el endpoint lo es por diseño) y la respuesta inmediata trae el ID de la operación y un enlace a su recurso de estado:

```json
{
  "operationId": "00000000-0000-0000-0000-000000000000",
  "_links": {
    "operation": {
      "href": "https://api.example.com/api/v2/async-operations/00000000-..."
    }
  }
}
```

## Por qué `Thread.sleep` es la respuesta incorrecta

- Si duermes 10 s y la operación tarda 2, **desperdicias 8 segundos** en cada test.
- Si duermes 10 s y la operación tarda 12, **falso rojo** — y nace un flaky.
- El tiempo "correcto" no existe: varía por entorno, carga y datos.

Lo que quieres es **polling con timeout**: pregunta cada X hasta que se cumpla la condición o se agote el plazo.

## Awaitility

[Awaitility](https://github.com/awaitility/awaitility) es la librería estándar en Java para esto (`org.awaitility:awaitility`, scope `test`):

```java
public Boolean isOperationSuccess(String operationId) {
    Awaitility.await()
            .atMost(5, TimeUnit.SECONDS)       // timeout máximo → TimeoutException
            .pollInterval(1, TimeUnit.SECONDS) // consulta la condición cada segundo
            .until(() -> getOperationStatus(operationId).contains("finished"));

    return getOperationStatus(operationId).contains("success");
}
```

Y el test queda declarativo:

```java
String operationId = response.extract().body().path("operationId");
TestCaseReport.assertEquals("La operación termina con éxito",
        operationService.isOperationSuccess(operationId), true);
```

## Los detalles que importan

- **Completitud y resultado son dos cosas distintas.** El ejemplo espera a que la operación esté *terminada* ("finished") y **después** comprueba si terminó *bien* ("success"). Si solo esperas "success", una operación fallida agota el timeout y el error que verás será "timeout" en vez de "la operación falló" — diagnóstico mucho peor.
- **Encapsula el polling en un helper con nombre de negocio** (`isOperationSuccess`). Los tests no deberían saber de `pollInterval`s.
- **Ajusta los tiempos por operación**, no globales: un borrado tarda 2 s, una importación 2 min.
- El mismo concepto existe en otros stacks: `expect.poll` / `expect(...).toPass()` en Playwright, `cy.waitUntil` en Cypress, `tenacity` en Python.

::: warning La misma lógica dentro de la UI
Toda espera de "hasta que X" con timeout es este mismo patrón. Cada vez que veas un `sleep`/`waitForTimeout` fijo en un test — de API o de UI — hay un flaky en incubación.
:::
