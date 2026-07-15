# La evolución del rol de QA

¿Qué es calidad, quién la produce, y hacia dónde va el rol de QA? Mi visión, construida sobre una idea central: **el testing manual como núcleo del rol no escala** — y la salida no es testear más, sino cambiar de posición en el proceso.

## Qué es calidad (de verdad)

La definición formal: el grado en que un producto cumple los requisitos funcionales y no funcionales, garantizando fiabilidad, eficiencia y mantenibilidad. Correcta y poco útil. La versión operativa que me sirve tiene dos patas:

1. **Conocer al usuario** — saber cómo usa el producto y qué necesita hacer con él.
2. **Responder rápido** — capacidad de reaccionar a esas necesidades.

Y una idea que lo cambia todo: la calidad final es la **suma de todos los equipos y procesos implicados**. *"Es una agregación de pequeñas ganancias lo que produce un flujo de trabajo de alta calidad — y un flujo de calidad es lo que produce un producto de calidad, no las acciones aisladas."* No hay héroe QA que compense un proceso roto.

## La trampa del testing manual

El QA "clásico" concentra su actividad en probar durante el desarrollo y re-testear en la release. El problema, en cadena:

1. El testing manual **no escala**: su capacidad es el número de personas.
2. QA, siendo responsable de la automatización, **no tiene tiempo de automatizar** — el manual se lo come.
3. Resultado: más testing manual → entregas más lentas → más presión → más manual. Un círculo vicioso.

### Mide tu proceso antes de discutirlo

Un ejercicio que recomiendo a cualquier equipo: desglosar cuánto cuesta *realmente* validar un ticket. En un caso real medido:

| Validar un ticket de sprint | Tiempo |
|---|---|
| Mejor caso (todo fluye) | ~2,3 h |
| Peor caso (bug + conflictos de merge) | ~6 h |
| **Media** | **~4 h** |

(Leer el ticket 10 min, preparar entorno 15, ejecutar casos 1 h, alineamiento con dev 30 min… y si hay bug: verificarlo, discutirlo, documentarlo, re-testear el fix.)

Con datos así, la conversación "QA es un cuello de botella" deja de ser opinión y pasa a ser un problema de optimización: clasifica tus tareas por **esfuerzo × frecuencia** y ataca la celda dominante. Casi siempre es la validación manual de features — por eso la fase 2 de cada ticket (automatizar lo que se probó a mano) es innegociable.

## Los cuatro ejes de la evolución

1. **Integración temprana** — participar en requisitos, diseño y planificación desde el inicio ([shift-left](/es/strategy/shift-left-and-maturity)).
2. **Continuous testing** — automatización + CI/CD para poder probar en cualquier fase.
3. **Foco en valor de negocio** — concentrar las pruebas donde más impacto tienen para el cliente, no donde es más cómodo probar.
4. **Decisiones basadas en datos** — métricas: QA como el experto en detectar fortalezas y debilidades del proceso ([causa raíz](/es/strategy/bug-root-cause-analysis), métricas de calidad).

## Responsible vs Accountable: el mapa del rol

La distinción que ordena todo: **responsible** ejecuta el trabajo; **accountable** responde de que se haga bien y firma el resultado.

| Actividad | Rol de QA |
|---|---|
| Requisitos claros en los tickets | **Accountable** |
| Estrategia de testing del equipo | **Accountable** |
| Que la feature funcione (tests: identificar, ejecutar, codificar, mantener) | **Accountable** — la ejecución puede compartirse con dev |
| Dejar la release lista | **Responsible** (dev también puede) |
| Rendimiento y su seguimiento | **Accountable** |
| Elevar bloqueos y dolores del testing, **cuantificados** | **Accountable** |
| Visibilidad de la calidad (métricas, gaps, estrategia) | **Accountable** |

El patrón es claro: el futuro del QA es ser **accountable del sistema de calidad** — habilitando al equipo (coaching, pair testing, talleres), automatizando, midiendo — y quedarse la ejecución directa solo donde aporta de verdad. De cuello de botella verificador a **multiplicador de la calidad del equipo**.

::: tip En una frase
El QA que solo ejecuta tests compite con un script. El QA que diseña el sistema que previene, detecta y mide — ese no tiene sustituto.
:::
