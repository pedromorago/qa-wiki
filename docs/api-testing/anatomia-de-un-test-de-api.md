# Anatomía de un test de API

Cómo escribo un test de API automatizado, del nombre a las aserciones. Ejemplos en Java + JUnit 5 + REST Assured, pero la estructura es agnóstica del stack.

## El nombre cuenta la historia

Convención **Given-When-Then** en el nombre del método + descripción en lenguaje natural en `@DisplayName`:

```java
@DisplayName("Create Product - valid. Product with all fields filled.")
@Test
void givenValidUser_WhenCreateProductWithAllFields_ThenCreateSuccess() {
```

`givenNoPermissionUser_WhenDeleteOrder_ThenOperationForbidden` se lee como la especificación del caso. Los nombres largos y descriptivos en tests son un *feature*: nadie los teclea (los ejecuta el runner) y todos los leen (en cada fallo).

## Cuerpo en tres bloques

```java
@Test
void givenValidUser_WhenCreateProductWithAllFields_ThenCreateSuccess() {
    // given - preparar datos
    ProductsService productsService = new ProductsService(productUser.getToken());
    JSONObject productData = ProductsService.fillProductWithAllFields();
    String name = productData.getString("name");

    // when - hacer la petición
    ValidatableResponse response = productsService.createProduct(productData);

    // then - validar la respuesta
    TestCaseReport.assertResponseCodeAndBodySchema("Status y schema", response,
            HttpStatus.SC_OK, PRODUCTS_SCHEMA_PATH + "/create-product.json");
    TestCaseReport.assertPropertyIsNotNull("", response, "id");
    TestCaseReport.assertBodyContainsProperty("", response, "name", name);
}
```

Reglas que sigo:

- **Todas** las validaciones viven en el bloque *then*.
- Códigos de estado con constantes (`HttpStatus.SC_OK`), nunca números mágicos.
- El test habla con **service objects**, jamás construye URLs ni requests a mano ([por qué](/api-testing/arquitectura-framework-api)).

## La matriz de casos por endpoint

Los casos se derivan de la **especificación** (contrato primero), no del código. Para cada endpoint nuevo, esta es mi checklist mínima:

| Caso | Qué se prueba |
|---|---|
| **200/201 happy path** | La operación correcta con un usuario con **los permisos justos** (no un admin). En listados: combinaciones de `page`, `size`, filtros y `sort`. |
| **400 Bad Request** | Parámetro con formato inválido; body al que le faltan campos obligatorios. |
| **401 Unauthorized** | Token inválido o ausente. |
| **403 Forbidden** | Usuario creado ex profeso **sin** el permiso necesario. |
| **404 Not Found** | ID inexistente… y el matiz importante: ID que **existe pero pertenece a otro usuario**. |

::: tip 403 vs 404: decisión de seguridad
Si un usuario pide un objeto sobre el que no tiene acceso, muchas APIs responden `404` en vez de `403` deliberadamente: un `403` confirmaría que el objeto existe. Hay que saber cuál es la política de tu API y probarla — es autorización a nivel de objeto, el bug clásico ([IDOR](/glosario)). 
:::

## Qué valido en cada respuesta

Mi mínimo obligatorio para cualquier respuesta:

1. **Código de estado**
2. **JSON Schema** del body ([artículo propio](/api-testing/validacion-json-schema))
3. **Atributos principales** del body
4. Headers y parámetros, si aplican

Para los mensajes de error, un patrón que evita tests frágiles: la API define mensajes estandarizados con placeholders (`Property [%s] with value [%s] is invalid`), y el framework los replica en un **enum reutilizable** en lugar de repetir strings por todo el código. Si cambia la redacción del mensaje, se cambia en un sitio.

```java
String expected = String.format(AssertionErrors.PROPERTY_WITH_VALUE.message, "name", "");
TestCaseReport.assertBodyContainsValue("", response, expected);
```

## Trazabilidad con el gestor de casos

Cada test automatizado tiene su entrada en el gestor de casos de prueba (Qase, TestRail, Xray…), enlazada desde el código con una anotación:

```java
@QaseId(1234)
@DisplayName("Products - BE - Create - valid. All fields filled.")
@Test
void givenValidUser_WhenCreateProduct_ThenCreateSuccess() { ... }
```

La parte tediosa (crear el caso en el gestor y copiar el ID al código) se puede automatizar: un script recorre los tests con ID placeholder, crea los casos vía la API del gestor usando el `@DisplayName` como título, y reescribe los placeholders con los IDs reales. **La anotación funciona como contrato de trazabilidad bidireccional** entre código y gestor.

## Gotcha clásico de REST Assured

Si reutilizas la misma instancia de service object para dos llamadas (un GET con query params y luego un POST con body), puedes llevarte un:

```
java.lang.IllegalStateException: You can either send form parameters OR body content in POST, not both!
```

La `RequestSpecification` **retiene los query params entre peticiones**. Solución: limpiar los parámetros entre llamadas (vía `FilterableRequestSpecification#removeParam`) o construir una specification nueva por petición. Lección general: si compartes estado entre requests, gestiónalo explícitamente.
