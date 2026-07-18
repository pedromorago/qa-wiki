# Postman y SoapUI

Dos herramientas para probar APIs sin montar un framework de código: **Postman** para el día a día con REST, y **SoapUI** cuando aparecen servicios **SOAP** — que en sectores como telecom o banca siguen muy vivos.

## Postman: más que enviar peticiones

Lo básico se aprende en una tarde; lo que marca la diferencia es usarlo con disciplina:

- **Colecciones**: las peticiones se organizan por producto o por flujo — por ejemplo, una colección para la API de `/service-orders`: crear el pedido, consultar su estado, cancelarlo —, versionadas y compartidas con el equipo (se pueden exportar a JSON y guardar en el repo).
- **Entornos y variables**: la misma colección corre contra dev, staging o producción cambiando solo el entorno. Las credenciales van en variables, nunca escritas en la petición.
- **Tests**: cada petición puede llevar aserciones en JavaScript (`pm.expect(...)`) — status, campos del body, tiempos. Una colección sin aserciones no es una suite: es un lanzador de peticiones.
- **Newman / Postman CLI**: las colecciones se ejecutan por línea de comandos, lo que permite meterlas en la pipeline de CI.

¿Cuándo Postman y cuándo un framework de código como REST Assured? Postman brilla para explorar APIs, reproducir bugs y smoke tests compartibles; para una suite grande, con lógica y revisión de código, un [framework de API testing](/es/api-testing/api-framework-architecture) escala mejor.

## SOAP en dos minutos

SOAP es el protocolo anterior a REST y sigue siendo común en sistemas de integración:

| | REST | SOAP |
|---|---|---|
| Formato | JSON (normalmente) | XML siempre, dentro de un *envelope* |
| Contrato | OpenAPI (opcional) | **WSDL** (obligatorio): define operaciones, tipos y validación con XSD |
| Operaciones | Verbos HTTP sobre recursos | Operaciones con nombre (como llamadas a funciones) |
| Validación | JSON Schema | Esquemas XSD y XPath |

El WSDL es la gran ventaja para un QA: es un **contrato formal y completo**. Si la respuesta no cumple el esquema, es un bug — sin discusión.

## SoapUI: probar contra el WSDL

- Importas el WSDL — por ejemplo, el de un servicio de aprovisionamiento con una operación `activateService` — y SoapUI **genera las peticiones de cada operación** con su estructura XML lista para rellenar.
- Las aserciones clave: *Schema Compliance* (la respuesta cumple el XSD), *XPath Match* (un valor concreto en el XML, como el estado del servicio tras la activación) y *SOAP Fault / Not SOAP Fault* (errores del protocolo).
- Organiza en *test suites* y *test cases* ejecutables también por línea de comandos, así que puede integrarse en CI.
- También maneja REST, aunque para REST puro Postman suele ser más cómodo.

## Errores comunes

- **Peticiones sin aserciones.** Ver un 200 a ojo no es probar; escribe las expectativas.
- **Colecciones sin versionar.** Si la colección vive solo en la cuenta de alguien, es conocimiento que se pierde; exporta y committea.
- **Ignorar el WSDL.** En SOAP el contrato ya existe: probar sin validar el esquema es desaprovechar la mitad de la herramienta.
- **Credenciales hardcodeadas** en peticiones exportadas — acaban en el repo y [Git no olvida](/es/cicd/git-for-qa).

::: tip Idea clave
La herramienta cambia, la pregunta no: ¿cuál es el contrato y cómo verifico que se cumple? En REST el contrato hay que construirlo (schemas, specs); en SOAP viene de serie en el WSDL — úsalo.
:::

## Referencias

- [Postman Learning Center](https://learning.postman.com/)
- [Documentación de SoapUI](https://www.soapui.org/docs/)
