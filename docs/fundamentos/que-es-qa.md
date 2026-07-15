# ¿Qué es QA?

**Quality Assurance (QA)** es el conjunto de actividades orientadas a garantizar que un producto de software cumple con el nivel de calidad esperado, tanto en lo funcional (hace lo que debe) como en lo no funcional (rendimiento, usabilidad, seguridad…).

Un error común es pensar que QA = "ejecutar tests". En realidad QA es más amplio: incluye prevenir defectos, mejorar procesos y aportar visibilidad sobre el estado real del producto.

## QA vs QC vs Testing

Tres términos que se confunden constantemente:

| Concepto | Enfoque | Pregunta que responde |
|---|---|---|
| **QA** (Quality Assurance) | Proceso, prevención | ¿Estamos construyendo el producto de la forma correcta? |
| **QC** (Quality Control) | Producto, detección | ¿El producto construido cumple los requisitos? |
| **Testing** | Ejecución, verificación | ¿Este comportamiento concreto funciona como se espera? |

El testing es una actividad *dentro* de QC, y QC es una parte *dentro* de QA. Un buen QA no solo encuentra bugs: cuestiona requisitos ambiguos antes de que se conviertan en bugs.

## Los 7 principios del testing (ISTQB)

1. **El testing muestra la presencia de defectos, no su ausencia.** Puedo demostrar que hay bugs, nunca que no los hay.
2. **El testing exhaustivo es imposible.** No se puede probar todo; hay que priorizar por riesgo.
3. **Testear pronto ahorra tiempo y dinero** (*shift-left*). Un defecto encontrado en requisitos cuesta muchísimo menos que en producción.
4. **Los defectos se agrupan.** Un módulo con bugs suele tener más bugs escondidos (principio de Pareto: ~80% de los defectos en ~20% de los módulos).
5. **Paradoja del pesticida.** Repetir siempre los mismos tests deja de encontrar bugs nuevos; hay que revisar y renovar los casos.
6. **El testing depende del contexto.** No se prueba igual una app bancaria que un videojuego.
7. **La ausencia de errores es una falacia.** Un software sin bugs pero que no resuelve la necesidad del usuario sigue siendo un mal producto.

## El rol del QA en un equipo ágil

- Participar en refinamientos para detectar ambigüedades **antes** de que se desarrolle nada.
- Definir criterios de aceptación claros y testeables junto con producto y desarrollo.
- Diseñar y ejecutar pruebas (manuales y automatizadas) durante el sprint, no al final.
- Aportar visibilidad: métricas, estado de la regresión, riesgos conocidos.
- Ser la voz del usuario dentro del equipo.

::: tip Idea clave
La calidad no es responsabilidad exclusiva del QA: es del equipo entero. El QA la **facilita**, la **mide** y la **defiende**.
:::
