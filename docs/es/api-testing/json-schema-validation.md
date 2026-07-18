# Validación de JSON Schema en tests de API

Validar que `name == "Fibra 1 Gbps"` confirma un valor. Validar el **JSON Schema** confirma el contrato completo: que la respuesta tiene la estructura, los tipos y los campos obligatorios que promete la API. Es la validación con mejor ratio esfuerzo/valor de un test de API.

## Por qué

- Detecta **breaking changes de contrato** (un campo que desaparece, un tipo que cambia de `string` a `number`) aunque el happy path funcional siga pasando.
- Garantiza **consistencia entre endpoints**: mismo formato de fechas, mismo body de error en toda la API.
- Es barata: se escribe una vez por endpoint y valida decenas de propiedades en cada ejecución.

## Cómo se organiza

- Los schemas viven como ficheros `.json` en los recursos del proyecto, organizados por versión de API → servicio.
- Los que aplican a varios endpoints (el body de error estándar, la envoltura de paginación) van a un directorio `generic/` y se **reutilizan** — no dupliques el schema de error en cada servicio.
- Para crear uno: capturas una respuesta real de muestra y la pasas por un generador "JSON → JSON Schema"; luego lo ajustas a mano (sobre todo los `required`).

## Ejemplo

Respuesta al crear un producto del catálogo (una tarifa de fibra):

```json
{
  "id": "prod-042",
  "name": "Fibra 1 Gbps",
  "downloadSpeedMbps": 1000,
  "monthlyPrice": 35.90
}
```

Su schema (`create-product.json`):

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "id":                { "type": "string" },
    "name":              { "type": "string" },
    "downloadSpeedMbps": { "type": "integer" },
    "monthlyPrice":      { "type": "number" }
  },
  "required": ["id", "name", "downloadSpeedMbps", "monthlyPrice"]
}
```

Y un schema genérico reutilizable, la respuesta de error estándar (estilo RFC 7807):

```json
{
  "status": 401,
  "title": "Something went wrong",
  "detail": "Authentication failed",
  "type": "SecurityError",
  "traceId": "00000000-0000-0000-0000-000000000000"
}
```

Su schema:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "status":  { "type": "integer" },
    "title":   { "type": "string" },
    "detail":  { "type": "string" },
    "type":    { "type": "string" },
    "traceId": { "type": "string" }
  },
  "required": ["status", "title", "detail", "type", "traceId"]
}
```

En el test (REST Assured trae el matcher; aquí envuelto en la fachada de aserciones del framework):

```java
// status code + schema en una sola llamada — el combo habitual
TestCaseReport.assertResponseCodeAndBodySchema("Status y schema", response,
        HttpStatus.SC_CREATED, CATALOG_SCHEMA_PATH + "/create-product.json");
```

En JavaScript/TypeScript el equivalente es la librería `ajv`; en Playwright se integra en un `expect` custom.

## Los matices que marcan la diferencia

- **`required` es donde está el valor.** Un schema sin `required` valida casi cualquier cosa. Decide conscientemente qué campos son obligatorios.
- **Valida también los errores.** Los bodies de `400/401/403/404` tienen contrato igual que los de `200` — y se rompen más a menudo, porque nadie los mira.
- **Cuidado con schemas demasiado estrictos**: si la API añade un campo nuevo (cambio retrocompatible), ¿quieres que tus tests fallen? Decide la política de `additionalProperties` según lo que signifique "romper el contrato" para tus consumidores.
- El schema **no sustituye** las aserciones funcionales: confirma la forma, no que el precio mensual calculado sea correcto.
