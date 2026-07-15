# Estrategia de testing para microservicios

Los microservicios cambian el problema: ya no pruebas *una* aplicación, sino muchas piezas que evolucionan por separado y prometen cosas unas a otras. La estrategia que mejor me encaja se resume en una idea: **probar cada servicio en dos estados**.

## Estado 1: el microservicio aislado

Sin llamar a ningún tercero — si necesita una dependencia, se mockea. Objetivo: garantizar que el servicio, por sí solo, hace lo que dice.

- **Unit tests** — la mayor porción de la pirámide, como siempre.
- **E2E de API del servicio aislado** — el servicio arrancado en solitario, probado **contra su catálogo de API desde la perspectiva de un consumidor**, simulando un flujo de negocio completo de entrada a salida.
- **Rendimiento/carga aislada** — volúmenes altos de peticiones para encontrar cuellos de botella y medir su capacidad *antes* de integrarlo: es la predicción de su estabilidad futura.

## Estado 2: el microservicio integrado en el ecosistema

Aquí el principio clave: **el ecosistema se trata como una caja negra con un único punto de acceso lógico**. Los tests no saben (ni les importa) la arquitectura ni la infraestructura interna.

- **Contract tests** — verifican que los acuerdos consumidor↔proveedor (formato, estructura, comportamiento de los datos) se respetan, **sin levantar el sistema completo**. Su superpoder concreto: validar **compatibilidad hacia atrás** — que la versión nueva del proveedor no rompe las expectativas de los consumidores existentes.
- **E2E del sistema completo** — en dos sabores: API E2E (el catálogo expuesto por el sistema entero) y frontend E2E (lo mismo vía UI).
- **Rendimiento del sistema** — desde fuera: tiempos globales, latencia entre servicios, uso de recursos, y la pregunta final: ¿se recupera de fallos sin afectar al usuario?

::: tip Gate entre estados
Los tests del estado integrado **solo corren si los del servicio aislado han pasado**. Si el servicio está roto por dentro, probar su integración es quemar pipeline para aprender lo que ya sabes.
:::

## Un caso real: módulo de informes

Cómo se aplicó esto a un microservicio de generación de informes integrado con el core de un SaaS:

- **Aislado**: unit tests de backend por pieza de la arquitectura (adapters, controllers, services); API E2E arrancando el servicio y validando **el contenido del informe generado** — que incluye todas sus secciones y componentes, no solo que responde 200.
- Los unit tests de frontend **se intentaron y se depreciaron** por su complejidad: ese riesgo pasó a cubrirse desde los E2E. Retirar una capa es una decisión de estrategia legítima si el riesgo queda cubierto en otra — y documentado.
- **Integrado**: API E2E core→módulo (la petición que dispara el informe responde bien) y frontend E2E (generar y **descargar** el informe como usuario).

De aquí sale una plantilla de test plan para cualquier módulo nuevo: dos fases (aislado/integrado) → capas por fase con su objetivo → decidir qué capas compensan (y documentar las descartadas) → si genera artefactos, validar su contenido → gates entre fases.

## Herramientas: mi chuleta

**Contrato**: [Dredd](https://dredd.org) (valida contra OpenAPI directamente — barato y perfecto para CI, aunque solo hace contrato) o [Pact](https://pact.io) (contratos consumidor/proveedor de verdad, detecta incompatibilidades antes del despliegue, pero exige coordinación entre equipos y más setup).

**Funcional de API** — la recomendación es aburrida y correcta: **cada equipo con su stack nativo**:

| Stack | Framework | Requests | Mocks |
|---|---|---|---|
| Python | pytest | requests / httpx | responses, pytest-httpx |
| Java | JUnit | REST Assured | Mockito, WireMock |
| JS/TS | Vitest | supertest / axios | msw, mocks integrados |

**Carga**: Artillery (ligera, YAML, muy CI-friendly — ideal para APIs), Locust (si el equipo es de Python), JMeter (protocolos enterprise, maduro pero pesado), Gatling (máximo rendimiento JVM, curva alta).
