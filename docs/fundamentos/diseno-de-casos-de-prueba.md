# Diseño de casos de prueba

Como el testing exhaustivo es imposible, el diseño de casos de prueba consiste en elegir **el subconjunto de pruebas con más probabilidad de encontrar defectos** con el menor esfuerzo. Estas son las técnicas de caja negra fundamentales.

## Particiones de equivalencia

Dividir las entradas en grupos (particiones) donde el sistema debería comportarse igual, y probar **un solo valor representativo de cada grupo**.

**Ejemplo**: un campo "edad" que acepta de 18 a 65 años.

| Partición | Rango | Valor de prueba | ¿Válida? |
|---|---|---|---|
| Menores | < 18 | 10 | ❌ Inválida |
| Aceptados | 18–65 | 40 | ✅ Válida |
| Mayores | > 65 | 70 | ❌ Inválida |
| No numérico | "abc" | "abc" | ❌ Inválida |
| Vacío | — | "" | ❌ Inválida |

Con 5 casos cubro lo que a fuerza bruta serían infinitos. Ojo: las particiones inválidas se prueban **de una en una**, para que un rechazo no enmascare a otro.

## Análisis de valores límite (boundary values)

Los bugs viven en las fronteras: los clásicos `>` donde debía ser `>=`. Por cada límite se prueban el valor del límite y sus vecinos inmediatos.

Para el rango 18–65: probar **17, 18, 19** y **64, 65, 66**.

Esta técnica se combina siempre con la anterior: particiones para cubrir los grupos, límites para afinar las fronteras.

## Tablas de decisión

Cuando el comportamiento depende de **combinaciones de condiciones**, una tabla de decisión garantiza que no se te escapa ninguna combinación.

**Ejemplo**: descuento en un e-commerce.

| Condición | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| ¿Cliente premium? | Sí | Sí | No | No |
| ¿Compra > 100 €? | Sí | No | Sí | No |
| **Resultado: descuento** | **20%** | **10%** | **5%** | **0%** |

Cada columna (regla) es un caso de prueba. Con N condiciones binarias hay 2^N combinaciones; luego se pueden colapsar las que llevan al mismo resultado.

## Transición de estados

Para sistemas con estados (un pedido: `creado → pagado → enviado → entregado`), se modelan los estados y las transiciones válidas, y se prueba:

- Cada transición válida (cobertura de transiciones).
- Las transiciones **inválidas**: ¿qué pasa si intento cancelar un pedido ya entregado?

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
