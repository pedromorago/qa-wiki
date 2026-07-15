# Probar APIs desde el editor: REST Client

[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) es una extensión de VS Code para enviar peticiones HTTP desde ficheros de texto plano. Para el trabajo exploratorio con APIs se ha ganado un hueco frente a Postman por tres razones:

- **Los ficheros `.http` viven en el repositorio**: se versionan, se revisan en PRs y funcionan como **documentación ejecutable** de la API para todo el equipo.
- **Cero cambio de contexto**: pruebas el endpoint en la misma ventana donde escribes el código o el test.
- Texto plano y difeable — sin colecciones propietarias ni cuenta cloud.

## Mecánica

1. Crea un fichero `.http` (o `.rest`).
2. Escribe la petición: método + URL, headers debajo y — detalle que siempre se olvida — **una línea en blanco entre headers y body**.
3. Pulsa el enlace **"Send Request"** que aparece sobre la petición; la respuesta se abre en un panel lateral.
4. Un mismo fichero admite todas las peticiones que quieras, **separadas por `###`**.

## Variables y encadenado de peticiones

**Variables de fichero** — se declaran con `@nombre = valor` (strings sin comillas) y se usan envolviendo el nombre en dobles llaves, como se ve en el ejemplo de abajo. La base para manejar entornos: cambias `@baseUrl` y todo el fichero apunta a otro sitio.

**Variables de petición** — la joya: nombras una petición con `# @name` y extraes datos de su respuesta con JSONPath. Es el flujo de autenticación típico: un POST devuelve el JWT y las siguientes peticiones lo usan como bearer.

```http
@baseUrl = http://localhost:8080/api/v1
@contentType = application/json

### Crear un recurso
POST {{baseUrl}}/libraries
Content-Type: {{contentType}}

{
  "name": "Mi biblioteca",
  "description": "Creada desde REST Client"
}

### Autenticarse y capturar el token
# @name authRequest
POST {{baseUrl}}/auth/token
Content-Type: {{contentType}}

{
  "username": "usuario-de-pruebas",
  "password": "{{password}}"
}

### Usar el token en una ruta protegida
@accessToken = {{authRequest.response.body.$.accessToken}}

GET {{baseUrl}}/security-classifications
Authorization: Bearer {{accessToken}}
```

La sintaxis general de extracción:

```
{{nombreRequest.(response|request).(body|headers).(JSONPath|NombreHeader)}}
```

## Dónde encaja (y dónde no)

| Necesidad | Herramienta |
|---|---|
| Explorar un endpoint mientras desarrollas/testeas | **REST Client** |
| Compartir ejemplos de uso de la API con el equipo | **REST Client** (versionado en el repo) |
| Regresión automatizada de API en CI | Framework de tests ([REST Assured](/api-testing/arquitectura-framework-api), pytest, Vitest…) |
| Colecciones complejas con scripting y monitores | Postman |

Mi uso real: los `.http` son el **cuaderno de laboratorio** — reproduzco el bug, afino la petición, y ese fichero acaba pegado en el bug report o convertido en un test automatizado.
