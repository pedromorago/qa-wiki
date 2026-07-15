# Qué probar en una API

Checklist de las dimensiones que reviso cuando pruebo un endpoint. No todas aplican siempre, pero repasarlas evita huecos.

## 1. El contrato

- ¿El código de estado es el correcto para cada escenario (éxito, no encontrado, inválido…)?
- ¿La estructura de la respuesta coincide con la documentación (OpenAPI/Swagger)? Campos, tipos, anidamiento.
- ¿Los campos obligatorios están siempre presentes? ¿Los opcionales se omiten o vienen como `null` de forma consistente?
- ¿Formatos consistentes? Fechas (ISO 8601), monedas, IDs.

## 2. Datos y validaciones (testing negativo)

Aquí es donde se aplican [particiones y valores límite](/fundamentos/diseno-de-casos-de-prueba), igual que en UI:

- Campos obligatorios ausentes, vacíos, `null`.
- Tipos incorrectos: string donde va número, array donde va objeto.
- Valores límite: strings larguísimos, números negativos, cero, decimales donde se esperan enteros.
- Caracteres especiales, emojis, HTML/SQL en los campos de texto (`<script>`, `' OR 1=1 --`).
- JSON malformado y `Content-Type` incorrecto.
- Campos extra no esperados en el body: ¿los ignora o los persiste? (*mass assignment*).

**Regla de oro**: ningún input debe producir un `500`. Input inválido → `4xx` con mensaje de error útil (pero que no filtre stack traces ni detalles internos).

## 3. Autenticación y autorización

- Sin token → `401`.
- Token expirado o manipulado → `401`.
- Token válido pero de un usuario **sin permisos** → `403`.
- El clásico de los clásicos: **IDOR** — con el token del usuario A, pedir `GET /users/B/orders`. ¿Puedo ver datos de otro usuario?

## 4. Comportamiento y estado

- ¿La operación realmente persiste? Tras un `POST`, hacer el `GET` y verificar.
- Idempotencia: repetir el mismo `PUT`/`DELETE`. ¿El segundo `DELETE` devuelve `404` o `204`? ¿Es lo esperado?
- `POST` duplicado (doble clic, reintento de red): ¿crea dos recursos?
- Concurrencia: dos actualizaciones a la vez sobre el mismo recurso. ¿Quién gana? ¿Hay control de versiones (ETag / `version`)?

## 5. Listados: paginación, filtros y orden

- Página fuera de rango, `page=0`, `page=-1`, `pageSize` gigante.
- ¿El total (`totalCount`) cuadra con los elementos reales?
- Filtros combinados y filtros con valores sin resultados.
- Orden estable: ¿dos peticiones iguales devuelven el mismo orden?

## 6. Lo no funcional que sí puedo tocar

- Tiempo de respuesta razonable (y consistente entre llamadas).
- Rate limiting: ¿responde `429` al superarlo? ¿Con cabecera `Retry-After`?
- Payload grande: ¿hay límite de tamaño de body? ¿Qué devuelve al superarlo?

::: tip Cómo lo organizo
Para cada endpoint monto una tabla rápida: filas = escenarios (happy path + negativos + permisos), columnas = código esperado, body esperado, efecto colateral esperado. Esa tabla luego es la semilla de los tests automatizados de API.
:::
