# API Testing

Probar por debajo de la interfaz: más rápido, más estable y más cerca de la lógica de negocio que el testing de UI.

## Fundamentos

- [Fundamentos de HTTP](/es/api-testing/http-fundamentals) — métodos, códigos de estado, cabeceras: el idioma de las APIs.
- [Qué probar en una API](/es/api-testing/what-to-test-in-an-api) — checklist: contrato, datos, errores, seguridad e idempotencia.

## Automatización de APIs

- [Arquitectura de un framework de API testing](/es/api-testing/api-framework-architecture) — capas, service objects y organización (Java + REST Assured + JUnit 5).
- [Anatomía de un test de API](/es/api-testing/anatomy-of-an-api-test) — Given-When-Then, la matriz de casos por endpoint y las aserciones.
- [Validación de JSON Schema](/es/api-testing/json-schema-validation) — validar el contrato, no solo los valores.
- [Datos de prueba y autenticación](/es/api-testing/test-data-and-authentication) — builders con datos aleatorios, usuarios efímeros y mínimo privilegio.
- [APIs asíncronas con Awaitility](/es/api-testing/async-apis-with-awaitility) — polling con timeout en vez de sleeps.

## Herramientas

- [REST Client de VS Code](/es/api-testing/rest-client-vscode) — probar APIs con ficheros `.http` versionados en el repo.
- [SQL para QA](/es/api-testing/sql-for-qa) — el 20 % de SQL que resuelve el 80 % del trabajo: verificar persistencia, preparar datos y detectar inconsistencias.
- [Postman y SoapUI](/es/api-testing/postman-and-soapui) — probar APIs sin framework: colecciones con aserciones, y SOAP con su contrato WSDL.
- [NoSQL para QA](/es/api-testing/nosql-for-qa) — qué garantías desaparecen sin esquema fijo y qué hay que validar por ello, con MongoDB como ejemplo.
- [Karate: API testing con BDD](/es/api-testing/karate-api-testing) — features autocontenidas con aserciones match, sin step definitions.
