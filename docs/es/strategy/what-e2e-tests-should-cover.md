# Qué debe cubrir un E2E (y qué no)

Los E2E son los tests más caros de escribir, ejecutar y mantener. Estas son las guidelines que uso para decidir qué merece uno.

## Para qué están

- Validar **flujos de negocio críticos** de punta a punta: de la UI al backend y de vuelta.
- Asegurar que integraciones y features de cara al usuario **funcionan juntas**.
- Explícitamente **no** están para cubrir cada detalle ni la lógica interna — eso es de unit e integración.

## Qué probar

- Los **happy paths de los flujos clave**: login, registro, creación del recurso principal, checkout…
- **1–2 variaciones significativas por flujo** (login válido vs inválido). No veinte.
- **Errores visibles que bloquean al usuario** (pago rechazado).
- **Reglas de negocio core del flujo** (no hay checkout con carrito vacío).
- **Integraciones críticas** frontend ↔ API ↔ servicios.

## Qué NO probar

- Todas las combinaciones de entrada posibles.
- Validaciones de campo en detalle (capa unit/integración).
- Lógica interna de los servicios.
- Escenarios sin impacto en la experiencia del usuario.

::: tip La regla 8–12
**8–12 E2E bien elegidos valen más que 100 frágiles y redundantes.** Cada E2E debe poder responder a la pregunta: "¿qué parte del negocio me confirma que no está rota?". Un set mínimo típico: login OK y KO, crear el recurso principal, actualizarlo o cancelarlo, la acción crítica (pago) con error, y logout.
:::

## El hueco invisible: tests atómicos vs flujos cross-domain

Un aprendizaje que me costó bugs reales: puedes tener una suite E2E grande y verde y aun así escaparte fallos gordos, si todos tus tests son **atómicos** — cada uno valida un CRUD de una entidad en aislamiento, y ninguno recorre un **workflow completo que cruza dominios funcionales**.

Ejemplos del patrón (abstraídos de casos reales):

- Un test crea una entidad de catálogo y la lee… pero nunca comprueba que esa entidad **puede usarse después en otra parte de la aplicación**.
- Una configuración de visibilidad definida en administración no se aplicaba en la vista de otro módulo. Los tests de cada módulo, en verde.
- Restaurar una versión anterior fallaba solo cuando el elemento contenía datos creados en *otro* flujo. Ningún test atómico podía verlo.

**Los tests atómicos dan verde mientras las costuras se rompen.** La respuesta:

- Al menos **un E2E cross-domain por entidad** del producto: crear la entidad y *usarla* donde el negocio la usa.
- Ejecutarlos con el **usuario de permisos mínimos** realistas, no con el admin.
- **Happy path**: preparar datos vía API, y las acciones y validaciones como usuario real por UI.
- **Sad paths**: optimizar mantenimiento — API para preparar datos **y** ejecutar acciones; la UI solo para las validaciones finales.

La regla general que resume todo esto:

> **API para llegar al estado; UI para lo que el usuario ve.**

## Buenas prácticas de escritura

- Nombres en lenguaje de negocio: *"Un usuario registrado puede completar una compra con tarjeta válida"*.
- Tests **independientes y paralelizables** (datos propios, [creados vía API](/es/api-testing/test-data-and-authentication)).
- Datos controlados: usa la búsqueda para aislar tu dato — nunca asumas que está en la primera página de la tabla.
- No dupliques cobertura que ya dan unit/integración: cada E2E tiene que justificar su coste.
