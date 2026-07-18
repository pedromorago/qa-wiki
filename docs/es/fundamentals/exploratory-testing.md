# Testing exploratorio

**Testing exploratorio** es probar software aprendiendo, diseñando y ejecutando pruebas **a la vez**: cada resultado que observas alimenta la siguiente prueba que se te ocurre. No es "clicar a ver qué pasa" — es una técnica con estructura, y de las que más bugs interesantes encuentra.

## Exploratorio vs. guionizado

| | Testing guionizado | Testing exploratorio |
|---|---|---|
| Los casos se diseñan | Antes de ejecutar | Durante la ejecución |
| Guía | El caso de prueba | El comportamiento que vas observando |
| Fortaleza | Repetible, trazable, automatizable | Encuentra lo que nadie pensó en escribir |
| Debilidad | Solo encuentra lo que se anticipó | Difícil de repetir si no documentas |

No compiten: se complementan. La automatización comprueba lo que ya sabes que debe funcionar; la exploración busca lo que **no sabes que puede fallar**.

## Sesiones con charter: la estructura

La forma más práctica de explorar con rigor es el **session-based testing**: sesiones con tiempo cerrado y una misión escrita, el *charter*. Una plantilla que funciona (de Elisabeth Hendrickson):

> **Explora** *(un área del producto)* **con** *(recursos, herramientas, datos)* **para descubrir** *(qué información buscas)*.

Ejemplos:

- *Explora el editor de diagramas con componentes anidados para descubrir problemas al mover elementos.*
- *Explora la importación de un modelo de amenazas grande con dos pestañas a la vez para descubrir condiciones de carrera.*

La sesión: **60–90 minutos**, sin interrupciones, tomando notas sobre la marcha (qué probaste, qué viste, qué dejaste sin mirar). Al acabar, un mini repaso: bugs encontrados, riesgos detectados, charters nuevos que salieron por el camino.

## Heurísticas para no quedarte en blanco

Cuando no sabes por dónde seguir, una heurística te da ángulos nuevos. **SFDPOT** (de James Bach) es un buen punto de partida — mira el producto desde seis lados:

- **S**tructure — lo que el producto *es*: componentes, ficheros, dependencias.
- **F**unction — lo que el producto *hace*: cada función, también las secundarias.
- **D**ata — lo que el producto *procesa*: entradas, salidas, límites, vacíos, unicode, lo enorme.
- **P**latform — de lo que el producto *depende*: navegador, sistema operativo, permisos, red.
- **O**perations — *cómo se usa*: perfiles de usuario reales, flujos raros pero legítimos.
- **T**ime — *cuándo*: concurrencia, timeouts, zonas horarias, antes/después de una migración.

## Cuándo explorar

- **Features nuevas** con especificación ambigua o inexistente: explorar es la forma más rápida de entender qué se construyó de verdad.
- **Antes de una release**, como barrido complementario a la regresión automatizada.
- **Al investigar un bug**: reproducirlo es, en el fondo, una sesión exploratoria con charter muy concreto.
- **Al llegar a un producto nuevo**: no hay mejor onboarding que explorarlo con notas.

## Errores comunes

- **Explorar sin charter.** Sin misión, a los diez minutos estás vagando. La libertad del exploratorio funciona *dentro* de un marco.
- **No tomar notas.** Un bug que no sabes reproducir porque no apuntaste el camino es un bug medio perdido.
- **Tratarlo como relleno.** "Si sobra tiempo, exploramos" significa que nunca se explora. Las sesiones se planifican como cualquier otra actividad de testing.
- **No reportar la sesión.** El resultado no es solo bugs: es información — riesgos, zonas frágiles, preguntas abiertas. Compártela.

::: tip Idea clave
La automatización comprueba lo que ya sabes; la exploración descubre lo que no sabes. Un producto solo con tests automatizados está protegido contra el pasado, no contra las sorpresas.
:::

## Referencias

- Elisabeth Hendrickson — *Explore It!* (Pragmatic Bookshelf), el libro de referencia sobre charters y sesiones.
- [James Bach — Session-Based Test Management](https://www.satisfice.com/blog/archives/category/session-based-testing)
- [Glosario ISTQB — exploratory testing](https://glossary.istqb.org/)
