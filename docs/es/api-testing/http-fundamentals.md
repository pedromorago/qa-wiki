# Fundamentos de HTTP

Para testear APIs REST hay que dominar HTTP: es el idioma en el que la API te dice si algo fue bien o mal, y muchas veces **el código de estado es en sí mismo el bug**.

## Anatomía de una petición y una respuesta

```
── Petición ──────────────────────────────
POST /api/v1/users HTTP/1.1          ← método + ruta
Host: api.ejemplo.com
Authorization: Bearer eyJhbGc...     ← cabeceras
Content-Type: application/json

{ "email": "ana@test.com" }          ← cuerpo (body)

── Respuesta ─────────────────────────────
HTTP/1.1 201 Created                 ← código de estado
Content-Type: application/json
Location: /api/v1/users/42

{ "id": 42, "email": "ana@test.com" }
```

## Métodos HTTP

| Método | Uso | ¿Idempotente?* | ¿Tiene body? |
|---|---|---|---|
| `GET` | Leer un recurso | Sí | No |
| `POST` | Crear un recurso / acción | No | Sí |
| `PUT` | Reemplazar un recurso completo | Sí | Sí |
| `PATCH` | Modificar parcialmente | No (en general) | Sí |
| `DELETE` | Eliminar | Sí | Normalmente no |

\* **Idempotente** = ejecutarlo N veces produce el mismo estado que ejecutarlo 1 vez. Importantísimo para testing: un `PUT` repetido no debe duplicar nada; un `POST` repetido puede crear duplicados (¿lo controla la API?).

## Códigos de estado: los que importan a un QA

### 2xx — Éxito
- **200 OK** — petición correcta con respuesta.
- **201 Created** — recurso creado (esperar cabecera `Location` y/o el recurso en el body).
- **204 No Content** — éxito sin cuerpo de respuesta (típico de `DELETE`).

### 4xx — Error del cliente (¡aquí vive el testing negativo!)
- **400 Bad Request** — petición malformada o datos inválidos.
- **401 Unauthorized** — sin autenticar (falta token o es inválido).
- **403 Forbidden** — autenticado pero **sin permiso**. La confusión 401/403 es un bug clásico.
- **404 Not Found** — el recurso no existe. Ojo: algunas APIs devuelven 404 en vez de 403 para no revelar que el recurso existe — eso es una decisión de diseño, hay que saber cuál aplica.
- **409 Conflict** — conflicto de estado (p. ej. crear un email duplicado).
- **422 Unprocessable Entity** — sintaxis correcta pero datos semánticamente inválidos.
- **429 Too Many Requests** — rate limiting.

### 5xx — Error del servidor
- **500 Internal Server Error** — excepción no controlada. **Un 500 provocado por input del usuario es siempre un bug**, aunque el input sea absurdo: el servidor debe validar y responder 4xx.
- **502 / 503 / 504** — problemas de infraestructura (gateway, servicio caído, timeout).

::: warning El anti-patrón del "200 con error dentro"
Algunas APIs devuelven `200 OK` con `{ "success": false, "error": "..." }` en el body. Es mala práctica y una trampa para el testing: nunca valides solo el código de estado, valida también el cuerpo.
:::

## Cabeceras que hay que mirar

- `Content-Type` — formato del body (`application/json`). ¿Qué pasa si envío otro?
- `Authorization` — credenciales (`Bearer <token>`, `Basic ...`).
- `Location` — URL del recurso recién creado (en 201).
- `Cache-Control` / `ETag` — caché. Fuente de bugs de "datos viejos".
- `X-Request-Id` (o similar) — correlación con logs; oro para reportar bugs de API.
