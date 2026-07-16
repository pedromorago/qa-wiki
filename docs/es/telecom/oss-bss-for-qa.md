# OSS/BSS para QA

Las operadoras de telecomunicaciones funcionan sobre dos familias de sistemas: **BSS** (Business Support Systems), la cara del negocio, y **OSS** (Operations Support Systems), la cara de la red. Probar software en este dominio significa probar cadenas largas de sistemas que se hablan entre sí — y eso cambia cómo se enfoca el testing.

## El mapa: BSS y OSS

| | BSS (negocio) | OSS (operaciones) |
|---|---|---|
| Se ocupa de | Clientes, productos, dinero | Red, servicios, recursos |
| Sistemas típicos | CRM, catálogo de productos, captura de pedidos, facturación (billing) | Inventario de red y servicios, aprovisionamiento, activación, orquestación, service assurance |
| Pregunta que responde | ¿Qué contrata el cliente y cuánto paga? | ¿Cómo se entrega y se mantiene ese servicio en la red? |

## El flujo que lo cruza todo: de pedido a activación

El proceso central del dominio es el *order-to-activation*: un cliente contrata algo y el servicio termina funcionando en la red. Simplificado:

1. **Catálogo** define el producto (por ejemplo, fibra 1 Gbps).
2. **Captura de pedido** (BSS) crea el pedido del cliente.
3. El pedido se **descompone**: de producto comercial a servicios técnicos y recursos.
4. **Orquestación y aprovisionamiento** (OSS) configuran la red.
5. **Inventario** registra lo que quedó desplegado.
6. **Activación**: el servicio funciona. A partir de ahí, *assurance* (vigilar que siga funcionando) y *billing* (cobrarlo).

Para un QA, la consecuencia es directa: los flujos E2E de verdad **atraviesan media docena de sistemas**, muchos pasos son **asíncronos** (los estados del pedido cambian con el tiempo) y los datos deben quedar **consistentes en varios inventarios a la vez**.

## TM Forum: el estándar del sector

[TM Forum](https://www.tmforum.org/) es la asociación que estandariza cómo se construyen estos sistemas. Lo que más toca a un QA:

- **Open APIs** — un conjunto de APIs REST estandarizadas para las operaciones típicas del dominio, cada una con su especificación y su esquema. Ejemplos conocidos: gestión de catálogo de productos (TMF620), pedidos de producto (TMF622) o pedidos de servicio (TMF641). Existe un programa de **certificación de conformidad** con estas APIs.
- **ODA (Open Digital Architecture)** — la arquitectura de referencia moderna: sistemas construidos como componentes con responsabilidades definidas que se comunican por Open APIs.
- **eTOM y SID** — el mapa de procesos de negocio y el modelo de información comunes del sector. Sirven de vocabulario compartido.

## Qué significa probar aquí

Lo interesante: casi todo lo que ya sabe un QA de producto aplica, con acentos distintos.

- **Conformidad con la especificación.** Si el producto implementa Open APIs, la spec de TM Forum es el contrato: la [validación de JSON Schema](/es/api-testing/json-schema-validation) pasa de buena práctica a requisito.
- **Flujos E2E largos y asíncronos.** Un pedido tarda en recorrer sus estados: las técnicas de [espera activa con Awaitility](/es/api-testing/async-apis-with-awaitility) (o su equivalente en cada stack) son el pan de cada día.
- **Consistencia de datos entre sistemas.** Lo que dice el pedido, lo que dice el inventario y lo que dice la red deben coincidir: [SQL](/es/api-testing/sql-for-qa) (y [NoSQL](/es/api-testing/nosql-for-qa)) para verificarlo.
- **Entornos y datos complejos.** Reproducir una topología de red realista es caro; el diseño de datos de prueba y la [estrategia por entornos](/es/cicd/environment-validations) pesan más que en un SaaS típico.

## Vocabulario mínimo

| Término | Qué es |
|---|---|
| Provisioning / activación | Configurar la red para entregar un servicio y ponerlo en marcha |
| Service assurance | Vigilancia y diagnóstico del servicio en producción (alarmas, incidencias) |
| Inventario | El registro de qué recursos y servicios existen y cómo están conectados |
| Mediación / rating / CDR | La cadena que convierte el uso de red (llamadas, datos) en importes facturables |
| Orquestación | Coordinar los pasos de aprovisionamiento entre sistemas y tecnologías |

::: tip Idea clave
En OSS/BSS el sistema bajo prueba casi nunca es *una* aplicación: es una cadena. El valor del QA está en pensar en flujos completos, esperas asíncronas y consistencia de datos entre sistemas — exactamente los músculos que entrenan las secciones de API testing y estrategia de esta wiki.
:::

## Referencias

- [TM Forum — Open APIs](https://www.tmforum.org/oda/open-apis/)
- [TM Forum — Open Digital Architecture (ODA)](https://www.tmforum.org/oda/)
