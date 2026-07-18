# Diseño de casos de prueba

Como el testing exhaustivo es imposible, el diseño de casos de prueba consiste en elegir **el subconjunto de pruebas con más probabilidad de encontrar defectos** con el menor esfuerzo. Estas son las técnicas de caja negra fundamentales.

## Particiones de equivalencia

Dividir las entradas en grupos (particiones) donde el sistema debería comportarse igual, y probar **un solo valor representativo de cada grupo**.

**Ejemplo**: un campo "ancho de banda contratado" (en Mbps) que acepta de 100 a 1000.

| Partición | Rango | Valor de prueba | ¿Válida? |
|---|---|---|---|
| Por debajo del mínimo | < 100 | 50 | ❌ Inválida |
| Aceptados | 100–1000 | 500 | ✅ Válida |
| Por encima del máximo | > 1000 | 2000 | ❌ Inválida |
| No numérico | "abc" | "abc" | ❌ Inválida |
| Vacío | — | "" | ❌ Inválida |

Con 5 casos cubro lo que a fuerza bruta serían infinitos. Ojo: las particiones inválidas se prueban **de una en una**, para que un rechazo no enmascare a otro.

## Análisis de valores límite (boundary values)

Los bugs viven en las fronteras: los clásicos `>` donde debía ser `>=`. Por cada límite se prueban el valor del límite y sus vecinos inmediatos.

Para el rango 100–1000: probar **99, 100, 101** y **999, 1000, 1001**.

Esta técnica se combina siempre con la anterior: particiones para cubrir los grupos, límites para afinar las fronteras.

## Tablas de decisión

Cuando el comportamiento depende de **combinaciones de condiciones**, una tabla de decisión garantiza que no se te escapa ninguna combinación.

**Ejemplo**: descuento por convergencia en una operadora (cliente que añade una tarifa móvil).

| Condición | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| ¿Tiene fibra contratada? | Sí | Sí | No | No |
| ¿Añade una segunda línea móvil? | Sí | No | Sí | No |
| **Resultado: descuento en la cuota móvil** | **20%** | **10%** | **5%** | **0%** |

Cada columna (regla) es un caso de prueba. Con N condiciones binarias hay 2^N combinaciones; luego se pueden colapsar las que llevan al mismo resultado.

## Transición de estados

Para sistemas con estados (un pedido de servicio: `created → validated → provisioning → active`), se modelan los estados y las transiciones válidas, y se prueba:

- Cada transición válida (cobertura de transiciones).
- Las transiciones **inválidas**: ¿qué pasa si intento cancelar un pedido de servicio ya activo?

## Pairwise (combinatorio)

Cuando hay demasiados parámetros para probar todas las combinaciones (navegador × SO × idioma × moneda…), pairwise genera el mínimo conjunto de casos que cubre **todas las parejas de valores**. La justificación empírica: la gran mayoría de los defectos combinatorios los dispara la interacción de solo 2 parámetros.

## Cómo elijo la técnica

| Situación | Técnica |
|---|---|
| Campo con rangos numéricos o de fechas | Particiones + valores límite |
| Reglas de negocio con varias condiciones | Tabla de decisión |
| Flujos con estados y transiciones | Transición de estados |
| Explosión de configuraciones | Pairwise |
| Requisitos ambiguos o zona desconocida | Testing exploratorio |
