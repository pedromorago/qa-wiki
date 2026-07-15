# Estrategia de testing ágil

Cómo se integra el testing en un equipo ágil de producto para que **no exista una "fase de testing"** separada: cada feature se valida como parte de su propio desarrollo, y al cerrarse está lista para entregar.

## La filosofía

- El testing continuo es parte del desarrollo, **al mismo nivel que programar**.
- **Shift-left de verdad: el testing empieza cuando se escribe la historia**, no cuando hay código.
- La automatización existe para reducir error humano y ganar cobertura y velocidad. *Earlier means faster*: detectar antes = arreglar más barato = entregar más rápido.
- Objetivo operativo: que al desplegar no aparezca ningún bug crítico que obligue a reiniciar el ciclo.

## El ciclo de una feature, con el testing dentro

### 1. Refinamiento técnico (shaping)

El equipo define los flujos principales de la iniciativa. De esta ceremonia sale **una tarea de análisis de QA** con tres objetivos:

1. Analizar el comportamiento de la iniciativa.
2. Generar los tests necesarios **en cada capa que aplique** e incorporarlos al plan de regresión.
3. Automatizarlos.

La clave: el **plan de regresión se mantiene vivo** — cada iniciativa lo alimenta, y los tests recién añadidos son, precisamente, el backlog de automatización. No hay una lista aparte que se desactualiza.

### 2. Desarrollo

- **El developer de la feature testea sus propios criterios de aceptación** — define los tests y la información para ejecutarlos. Es el *progression testing* de la feature.
- El **reviewer** valida el comportamiento y añade tests si detecta huecos.
- En paralelo corre **regresión** para proteger lo existente: una vez en la pull request, otra al integrar en la rama principal.

### 3. Release

Cada release agrupa features ya validadas que se promocionan por los entornos. Las validaciones se escalan por etapa ([artículo propio](/es/cicd/environment-validations)).

## ¿De quién es el testing? (RACI)

La pregunta del millón en equipos ágiles. La respuesta que mejor me ha funcionado:

- **Cualquier rol puede ser *responsible*** de ejecutar la validación de una feature (crear casos, ejecutarlos, automatizarlos). El *test owner* no tiene por qué ser QA.
- **QA es siempre *accountable***: responde de que la validación se haga conforme a la estrategia y firma el resultado.

El QA deja de ser el cuello de botella que ejecuta todo, y pasa a ser **el garante del proceso**: define la estrategia, la facilita y la vigila.

## Una definición operativa de "automatizado"

> Un caso de prueba solo se considera automatizado cuando **se ejecuta en CI/CD dentro de los pipelines**.

Que exista el script no basta: si se lanza a mano, no es automatización, es un test manual con extra de mantenimiento. El estado de automatización de cada caso se registra en el gestor de casos (campo "automation status"), lo que permite saber en todo momento qué está automatizado, qué está planificado y qué no es automatizable.

## Tipos de test según su ciclo de vida

Además del catálogo clásico, hay una categoría que me parece especialmente útil:

| Tipo | Qué es |
|---|---|
| **Smoke** | Verifica que la app está bien desplegada y se comunica con sus dependencias. Es un test de *despliegue*, más que de funcionalidad. |
| **Sanity** | La funcionalidad core, libre de bugs. Formalmente: un **subconjunto de la regresión**. |
| **Regresión** | Lo previo sigue funcionando tras cada cambio. |
| **Progression** | **Los tests nuevos de una feature en desarrollo.** Categoría *transitoria*: al cerrar la feature, cada test se promociona a smoke/sanity/regresión (y se automatiza) o muere con la validación. |

Ese ciclo de vida — todo test nace como *progression* y se decide conscientemente si se promociona — evita tanto los huecos ("nadie pasó este caso a regresión") como la regresión infinita ("guardamos todos los tests para siempre").
