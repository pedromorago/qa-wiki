# Validaciones por entorno en CI/CD

A lo largo del ciclo de vida conviven varias "versiones" del producto (rama de feature, rama de integración, release candidate, producción, LTS…) y **no todas necesitan la misma batería de tests ni la misma frecuencia**. Diseñar esto bien es diseñar la estrategia de testing continuo.

## El principio

> Cuanto más cerca del desarrollador, más rápido y estrecho; cuanto más cerca del cliente, más lento y ancho.

- **En la PR** prima la velocidad de feedback: regresión de backend (barata y estable, vía API) + solo **sanity** de frontend. Una matriz completa en cada PR sería lenta y carísima.
- **En la rama de integración**, ejecución **programada** (p. ej. diaria o dos veces al día, no por commit): amortigua el coste y detecta regresiones de integración en horas. Aquí ya se cubren todas las variantes.
- **En la release**, validación **exhaustiva y multi-matriz**: es la última red antes de clientes y el coste de escape es máximo.

## La matriz (ejemplo real, abstraído)

| Etapa | Tests | Disparador | Ediciones | Bases de datos |
|---|---|---|---|---|
| **Pull request** | Regresión backend + sanity frontend | Al abrir la PR | Solo la principal | Solo la principal |
| **Integración (develop)** | Regresión completa BE+FE + suite de cross-functionalities | Programado, 1-2×/día | **Todas** (enterprise, professional, community…) | Principal, restaurada **y vacía** |
| **Release (RC)** | Regresión completa BE+FE + cross-functionalities + addons | Al merge a la rama de release | Todas | **Todas las versiones soportadas** (p. ej. Postgres 15 y 13) |
| **Espejo de producción** | Regresión completa | Bajo demanda | Todas | Restaurada y vacía |
| **LTS** | Regresión completa | Bajo demanda (parches) | Todas | — |

Dimensiones que conviene identificar en cualquier producto:

- **Ediciones/variantes comerciales** — cada una activa features distintas; se validan por separado.
- **Versiones de BD soportadas** — la release se valida contra todas las que existen en clientes, no solo la última.
- **Cross-functionalities** — transversales que no pertenecen a ningún dominio (licenciamiento, expiración de sesión…): merecen suite propia.
- **Addons e integraciones** con servicios externos.

## Dos estados de base de datos

Una práctica barata y sorprendentemente eficaz: probar contra **BD restaurada** (datos realistas migrados — simula al cliente veterano y caza problemas de migración) **y BD vacía** (instalación limpia — simula al cliente nuevo). Muchos bugs solo existen en uno de los dos mundos.

Operativa: los volcados se **regeneran automáticamente con cada despliegue** del entorno de referencia y se publican versionados (bucket tipo S3). Los tests arrancan siempre sobre un estado conocido, y el dataset nunca se desincroniza del esquema.

## El ciclo de release desde QA

1. **Release Candidate**: las features validadas se empaquetan en una RC que se despliega en su entorno y recibe la regresión completa. Regla estricta: **desde que existe la RC, solo entran correcciones de errores críticos** — congelación funcional.
2. **Producción**: se mantiene un **entorno espejo** con la versión exacta de producción, para reproducir y validar cualquier problema o fix sobre lo que el cliente realmente tiene.
3. **LTS**: las versiones de soporte extendido viven en su entorno dedicado donde solo se validan parches y correcciones de seguridad.

## Pipelines custom bajo demanda

Además de las automáticas, cuatro pipelines parametrizables que cualquiera puede lanzar:

- `backend-all-domains` / `backend-one-domain`
- `frontend-all-domains` / `frontend-one-domain`

Parámetros típicos: navegador, suite/dominio, edición del producto y **rama del repositorio de tests**. Sirven para reproducir "solo la suite de X contra la rama Y" sin esperar a la ejecución programada — y para validar tus tests nuevos antes de pedir review.

::: tip La pregunta de diseño
Para cada suite y cada etapa: *¿qué decisión se toma con este resultado?* Si un fallo aquí no bloquea nada ni informa a nadie, esa suite está corriendo en el sitio equivocado.
:::
