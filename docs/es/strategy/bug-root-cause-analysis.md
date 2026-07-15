# Análisis de causa raíz de bugs

Cerrar un bug lo arregla una vez. Clasificar **de dónde vino** te dice cómo evitar los próximos veinte. El análisis de causa raíz agregado es de las prácticas de QA con más retorno y menos coste.

## La mecánica

Añadir al gestor de tickets un campo obligatorio **"Root Cause"** en todos los issues de tipo bug, con una taxonomía cerrada:

| Categoría | Definición |
|---|---|
| **Environment** | Limitación del entorno: red, recursos, configuración… |
| **External / 3rd party** | Activo no desarrollado por nosotros: librería, servicio externo. |
| **Improper / lack of definition** | Definición o documentación incorrecta o insuficiente. El bug nació en el refinamiento. |
| **Lack of testing** | Testing incorrecto o insuficiente — de *cualquier* capa: manual, unit, integración, regresión. |
| **TBD** | No encaja en ninguna categoría. Se revisa a posteriori. |

Dos decisiones de diseño que me parecen muy finas:

- **El principio detrás de "lack of testing"**: *si el código falla, los tests deberían haberlo cazado*. No es culpabilizar a QA — es reconocer que cada bug escapado señala un hueco concreto en alguna capa de la red de seguridad.
- **La categoría TBD** hace la taxonomía **evolutiva**: en vez de forzar clasificaciones incorrectas, dejas una vía de escape controlada, y los TBD acumulados se revisan para crear nuevas categorías con datos reales.

## Enforcement: por workflow, no por buena voluntad

Un campo opcional se queda vacío. Lo que funciona:

1. **Obligatorio al crear** el issue de tipo bug.
2. **Validador en la transición**: el workflow impide pasar el bug a "Entregado" con el campo vacío.

(Probamos antes una automatización reactiva que devolvía el ticket al estado anterior con un comentario — funciona, pero la validación de workflow es más limpia. Mejor impedir que corregir.)

## Qué se hace con los datos

Agregados por trimestre, por equipo o por área de producto, los datos responden la pregunta que ningún bug individual responde: **¿de qué nos equivocamos más?**

- ¿Domina *lack of definition*? → invertir en refinamiento: [criterios de aceptación y DoR](/es/strategy/acceptance-criteria-and-dor), three amigos.
- ¿Domina *lack of testing*? → mirar qué capa falló más y reforzarla ([pirámide](/es/fundamentals/the-testing-pyramid), [E2E cross-domain](/es/strategy/what-e2e-tests-should-cover)).
- ¿Dominan *environment/3rd party*? → estabilidad de entornos, contract testing con terceros.

Y se cierra el círculo con las **métricas de calidad del equipo**, revisadas periódicamente (en la retro o la sprint review, no en un dashboard que nadie abre): bugs abiertos vs cerrados, reportados vs hotfixes, distribución por severidad y por causa raíz. No como vigilancia — como respuesta a "¿dónde enfocamos el esfuerzo?".

::: tip El triaje binario que mantiene la señal limpia
La misma disciplina aplica a los fallos de pipeline: ¿falla la aplicación? → bug. ¿Falla el test? → arregla el test (o elimínalo si es flaky irrecuperable). Un tercer estado — "se re-lanza a ver si pasa" — no existe: es la muerte de la confianza en la regresión.
:::
