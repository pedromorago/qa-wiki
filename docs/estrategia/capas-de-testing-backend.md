# Capas de testing en backend, con ejemplos

Qué se prueba en cada capa cuando el sistema bajo prueba es un backend. Para aterrizarlo, un ejemplo concreto: **una API REST de gestión de usuarios** de un SaaS — CRUD de usuarios autenticado con JWT, roles, validación de entrada y regla de negocio "no se permiten emails duplicados".

## Unit: la lógica, en aislamiento

Se prueba cada función/método con **todas las dependencias mockeadas** (repositorio, servicios externos):

- `validatePasswordStrength()` devuelve `false` para contraseñas débiles.
- `UserService.createUser()` lanza error si el email ya existe (repositorio mockeado).
- `JWTUtils.decodeToken()` parsea el token correctamente.

Es la capa más rápida y barata de mantener. Herramientas: JUnit, pytest, Jest/Vitest…

## Integración: componentes reales interactuando

Aquí ya hay **base de datos real** (o realista: H2/SQLite in-memory, o contenedores con Testcontainers):

- `POST /users` crea el usuario y **persiste** en la BD.
- `GET /users/{id}` devuelve lo que hay en la BD.
- `PUT /users/{id}` actualiza **y registra el cambio en el servicio de auditoría**.

Consejo que aplico: incluir **validación del contrato OpenAPI** en esta capa — es contract testing barato dentro del propio equipo.

## E2E de API: el flujo completo de un consumidor

El stack entero levantado (auth, BD, servicios), y el test recorre un flujo de negocio real:

1. `POST /auth/login` → obtener el JWT.
2. Con el token, `POST /users` con payload válido.
3. Validar la respuesta y **confirmar la persistencia** con `GET /users/{id}`.
4. `PUT /users/{id}` y validar los nuevos datos.
5. `DELETE /users/{id}` y comprobar que ya no existe.

## Resumen operativo

| Capa | Objetivo | Herramientas típicas | Cuándo corre | ¿Bloquea? |
|---|---|---|---|---|
| Unit | Funciones aisladas, sin BD ni red | JUnit, pytest, Jest | Cada commit/push | Sí, siempre |
| Integración | API ↔ BD, servicios ↔ colas, contrato OpenAPI | Spring Test, Supertest, Testcontainers | Cada pull request | Sí (contratos y BD) |
| E2E API | Flujos de negocio con stack completo | REST Assured, Postman/Newman, Karate | Main/staging y pre-release | Sí para release |

Dos consejos finales de los que me acuerdo tarde cuando no los aplico:

- **Medir la cobertura de unit y de integración por separado.** Mezclarlas produce una cifra agregada que da falsa confianza.
- **Taggear los tests** (`@unit`, `@integration`, `@e2e`) para que cada pipeline ejecute exactamente su subconjunto.
