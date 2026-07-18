# Criterios de aceptación y Definition of Ready

Los dos artefactos que deciden la calidad de una feature **antes de escribir una línea de código**. Como QA, son mi principal herramienta de shift-left: cuanto mejor definimos, menos dudamos — y menos bugs nacen.

## Criterios de aceptación (AC)

Las condiciones que el software debe cumplir para ser aceptado por el usuario, el cliente u otros sistemas. Únicos por historia, y escritos **desde la perspectiva del usuario final**.

### Las propiedades no negociables

- **Pass/fail**: se cumplen o no se cumplen. *Nunca* "a medias".
- **Claros, concisos y testeables.** Si no se puede verificar, no es un criterio de aceptación.
- Describen el **qué**, jamás el **cómo** de la solución.
- Se escriben **antes** de empezar el desarrollo y se cierran en el refinamiento. AC escritos después del código no son criterios: son actas de lo que salió.

### Para qué sirven (además de para testear)

1. **Delimitar el alcance** — cuándo la historia está completa.
2. **Describir los escenarios negativos** — cómo reacciona el sistema a entradas inválidas. El happy path se define solo; los AC valen oro por los sad paths.
3. **Sincronizar** cliente ↔ equipo: los devs saben qué construir, los stakeholders qué esperar.
4. **Facilitar el testing de aceptación** — cada criterio testeable de forma independiente.
5. **Permitir estimar y trocear** la historia.

### Dos formatos válidos

**Given/When/Then** (herencia de BDD) — mi preferido cuando el comportamiento tiene estados y acciones claras:

```
Scenario: Un viewer intenta editar una contramedida
  Given un usuario con rol viewer en el proyecto "Pagos"
  When intenta cambiar el estado de una contramedida a "aplicada"
  Then el cambio no se guarda
  And se muestra el aviso de permisos insuficientes
```

Ventaja extra: si el equipo usa un framework BDD, el formato ya es de casa — alineación dev-QA gratis.

**Orientado a reglas** — lista simple de reglas de comportamiento, de las que luego se derivan los escenarios. Mejor para features con muchas reglas y pocas interacciones.

Lo innegociable no es el formato: es que quede claro qué se espera.

### Distinciones que evitan discusiones

| | Qué es |
|---|---|
| **AC** | El **qué** debe cumplirse (por issue) |
| **Testing steps** | El **cómo** comprobar que se cumple |
| **DoD** | Checklist **común a todos** los issues (pipeline verde, docs, mergeado…) |
| **DoR** | Lo que hace falta para **empezar** (ver abajo) |

Y una regla pequeña y brillante: los tickets de análisis/spike **no llevan AC — llevan las preguntas** que el análisis debe responder.

### Hacer que ocurra (enforcement)

Las guías que dependen de la buena voluntad duran dos sprints. Lo que funciona:

- Plantilla/checklist de AC **auto-incluida por tipo de issue** en el gestor de tickets.
- **Validador en la transición de workflow**: no se puede pasar a "Entregado" con ítems de AC sin marcar.
- Enlazar cada criterio con **los tests que lo verifican** — evidencia, no promesa.
- ¿IA para redactarlos? Como **borrador** a refinar por el equipo, nunca como resultado final — y sin pasarle jamás información sensible.

## Definition of Ready (DoR)

La DoR responde a: ¿está esta tarea lista para **empezarse**? Es la simétrica de la DoD. Se define en las **tareas padre** (épicas, historias), no en las subtareas — única fuente de verdad.

### La checklist, con su responsable

| Ítem | Quién responde | Qué garantiza |
|---|---|---|
| **Propuesta de valor** | Product manager | Quién es el stakeholder, qué problema se resuelve, qué queda **fuera** del alcance, prioridad, ¿release notes?, ¿demo?, ¿revisión UX? |
| **AC definidos y acordados** | **QA** | El benchmark para considerar la tarea completa. QA garantiza que *hay* AC (aunque se escriban en equipo). |
| **Diseño UX y especificaciones** | Diseño | Cambios detallados y enlazados, claros para ingeniería. |
| **Revisado por backend** | Backend | Dudas resueltas, notas técnicas: permisos, auditoría, ¿revisión de arquitectura/seguridad?, componentes afectados. |
| **Revisado por frontend** | Frontend | Ídem. |
| **Stakeholders notificados** | Team lead | ¿DevOps? ¿Soporte, ventas? ¿Otros equipos? |

### La advertencia anti-waterfall

La DoR existe para **evitar bloqueos durante el desarrollo**, no para convertir el refinamiento en una fase de requisitos de seis semanas. A veces está bien empezar con incertidumbre y aprender sobre la marcha; no todos los ítems aplican a todos los tickets. El contenido importa; el formato, no.

::: tip El papel del QA en todo esto
Si un ticket llega a refinamiento sin AC, **levantar la mano es trabajo de QA**. Es el bug más barato que cazarás en tu vida: todavía no existe.
:::
