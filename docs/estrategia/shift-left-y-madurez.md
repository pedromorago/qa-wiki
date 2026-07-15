# Shift-left y el modelo de madurez

**Shift-left** es desplazar las actividades de calidad a etapas más tempranas del ciclo: prevenir defectos en lugar de detectarlos tarde. La cadena causal que lo justifica se repite en cada equipo que lo adopta: *detectar antes → arreglar más barato → entregar más rápido y con más confianza*.

(Su complemento es el **shift-right**: monitorizar el comportamiento real en producción — métricas, rendimiento, chaos engineering — para medir resiliencia. No compiten; cubren extremos distintos.)

## Qué persigue el shift-left

- **Responsabilidad compartida**: la calidad deja de ser "trabajo de QA" para ser parte del trabajo diario de developers, DevOps y producto.
- **Testing pegado al desarrollo**: unit tests, code reviews, checks automáticos en CI, contract testing.
- **Automatización inteligente**: en la base de la [pirámide](/fundamentos/piramide-de-testing), no solo UI tardía.
- **Releases frecuentes con confianza.**

## El modelo de madurez: 6 dimensiones × 5 niveles

Para pasar del eslogan a un plan, lo mejor que he usado es un **modelo de madurez**: una matriz que permite evaluar dónde está un equipo y qué prácticas concretas lo suben de nivel.

### Los cinco niveles

| Nivel | Nombre | En una frase |
|---|---|---|
| 1 | **Shifted right** | El testing ocurre al final; feedback lento; poca consciencia de testing en el equipo. |
| 2 | **Initial** | El equipo conoce el shift-left y da pasos simples; aparece la planificación y la documentación se organiza. |
| 3 | **Improving** | Actividades de testing moviéndose constantemente hacia etapas tempranas, con métricas. |
| 4 | **Stable** | La mayoría del testing se planifica y ejecuta lo antes posible; feedback corto; guías y herramientas en práctica real. |
| 5 | **Shifted left** | Todo el testing se concentra en etapas tempranas; el equipo analiza y mejora su propio proceso. |

La palabra que separa niveles casi siempre es **"regular"**: la diferencia entre nivel 2 y 4 no es *qué* prácticas conoces, sino cuáles son **hábito sistemático** y no acto heroico ocasional.

### Las seis dimensiones (con sus hitos clave)

1. **Testing manual y análisis** — de exploratorio ad-hoc al final (N1) → revisar diseños/mockups antes de programar (N2) → testing en la conversación de definición, análisis de dependencias, exploratorio temprano (N3) → revisión de especificaciones de prueba (N4) → revisión regular de la cobertura automatizada para podar tests obsoletos y flaky (N5).
2. **Definición de producto** — sin actividad de calidad en definición (N1) → AC informales (N2) → **AC con producto + three amigos** + feedback de usuario en discovery (N3) → los AC bastan para alinear expectativas (N4) → *ningún resultado funcional se describe sin su testing* + análisis de riesgos en cada feature (N5).
3. **Planificación de pruebas** — inexistente (N1) → el tiempo de testing se conoce pero no se estima en sprint (N2) → test plan como checklist (N3) → test plan completo (no funcional, riesgos, dependencias) y capacidad de QA en la planificación (N4) → test plan para **cada feature significativa** (N5).
4. **Seguimiento de bugs** — solo se registran los de producción (N1) → fixes de release + backlog revisado a ratos (N2) → guías de registro seguidas por todos + bugs de etapas tempranas también (N3) → triaje por severidad y prioridad, grooming del backlog, **[causa raíz](/estrategia/causa-raiz-de-bugs) de las regresiones importantes** (N4) → política **cero bugs** estricta (N5).
5. **Métricas de calidad** — ninguna (N1) → bugs en producción e incidentes (N2) → distribución por severidad, por área, fixes por release (N3) → el equipo **actúa** sobre las métricas + métricas de análisis estático (N4) → mejora continua con objetivos y seguimiento (N5).
6. **Reporting y documentación** — documentación irregular, sin reporting (N1) → reporting ad-hoc, regresión como checklists (N2) → regresión al día y comprensible desde fuera + base de conocimiento (N3) → reporting regular y base de conocimiento validada (N4) → **retrospectivas de calidad accionables** (N5).

### Cómo se evalúa

Cada práctica de la matriz se marca como: **Implemented · Partially implemented** (no todos los equipos la adoptaron — clave en organizaciones multi-equipo) **· Pending** (hay que implantarla) **· Not applicable · No info**.

El nivel emerge de lo implantado, y las prácticas *pending* **son directamente el plan de mejora**. No hace falta llegar a 5 en todo: el valor del modelo es tener una conversación honesta sobre dónde estás y decidir conscientemente el siguiente paso por dimensión.

## Por dónde empezar (si estás en nivel 1-2)

Las tres prácticas con mejor ratio esfuerzo/impacto según mi experiencia:

1. **Revisar diseños y criterios de aceptación antes de programar** (dimensión 2, nivel 2-3) — el bug más barato es el que no se escribe. El formato *three amigos* (producto + dev + QA) es suficiente.
2. **Registrar todos los bugs con [causa raíz](/estrategia/causa-raiz-de-bugs)** (dimensión 4) — sin datos, la mejora es opinología.
3. **Convertir la validación manual de cada feature en automatización de regresión** (la fase 2 que siempre se cae del sprint) — es lo único que rompe el círculo vicioso del testing manual que [no escala](/fundamentos/evolucion-del-rol-de-qa).
