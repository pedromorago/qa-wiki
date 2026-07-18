# Capas de testing en backend, con ejemplos

Qué se prueba en cada capa cuando el sistema bajo prueba es un backend. Para aterrizarlo, un ejemplo concreto: **la API REST de proyectos de una plataforma de threat modeling** — CRUD de proyectos y sus componentes autenticado con JWT, roles editor/viewer, validación de entrada y regla de negocio "no se permiten componentes duplicados en un mismo proyecto".

## Unit: la lógica, en aislamiento

Se prueba cada función/método con **todas las dependencias mockeadas** (repositorio, servicios externos):

- `PermissionService.canEdit()` devuelve `false` para un usuario con rol viewer.
- `ProjectService.addComponent()` lanza error si el componente ya existe en el proyecto (repositorio mockeado).
- `JWTUtils.decodeToken()` parsea el token correctamente.

Es la capa más rápida y barata de mantener. Herramientas: JUnit, pytest, Jest/Vitest…

## Integración: componentes reales interactuando

Aquí ya hay **base de datos real** (o realista: H2/SQLite in-memory, o contenedores con Testcontainers):

- `POST /projects` crea el proyecto y **persiste** en la BD.
- `GET /projects/{id}` devuelve lo que hay en la BD.
- `PUT /projects/{id}` actualiza **y registra el cambio en el servicio de auditoría**.

Consejo que aplico: incluir **validación del contrato OpenAPI** en esta capa — es contract testing barato dentro del propio equipo.

## E2E de API: el flujo completo de un consumidor

El stack entero levantado (auth, BD, servicios), y el test recorre un flujo de negocio real:

1. `POST /auth/login` → obtener el JWT de un usuario con rol editor.
2. Con el token, `POST /projects` con payload válido.
3. Validar la respuesta y **confirmar la persistencia** con `GET /projects/{id}`.
4. `PUT /projects/{id}` añadiendo un componente y validar los nuevos datos (con un token de viewer, comprobar que devuelve `403`).
5. `DELETE /projects/{id}` y comprobar que ya no existe.

## Resumen operativo

| Capa | Objetivo | Herramientas típicas | Cuándo corre | ¿Bloquea? |
|---|---|---|---|---|
| Unit | Funciones aisladas, sin BD ni red | JUnit, pytest, Jest | Cada commit/push | Sí, siempre |
| Integración | API ↔ BD, servicios ↔ colas, contrato OpenAPI | Spring Test, Supertest, Testcontainers | Cada pull request | Sí (contratos y BD) |
| E2E API | Flujos de negocio con stack completo | REST Assured, Postman/Newman, Karate | Main/staging y pre-release | Sí para release |

Dos consejos finales de los que me acuerdo tarde cuando no los aplico:

- **Medir la cobertura de unit y de integración por separado.** Mezclarlas produce una cifra agregada que da falsa confianza.
- **Taggear los tests** (`@unit`, `@integration`, `@e2e`) para que cada pipeline ejecute exactamente su subconjunto.
