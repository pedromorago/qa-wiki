# Cómo revisar una tarea

La revisión es donde el equipo se juega la calidad de verdad: es la última mirada antes del merge. Dos procesos distintos: revisar un ticket de feature en el equipo de producto, y el peer review entre QAs.

## Revisar un ticket de feature

Cuando el desarrollo termina (refinado, desarrollado, con code review), el ticket pasa a "To Review" y **cualquier miembro del equipo — dev o QA — puede revisarlo**. Mi flujo:

1. **Asígnate el ticket** antes de empezar — que se vea quién revisa qué.
2. **Entiende el propósito** de la tarea. Revisar sin contexto es mirar, no revisar.
3. **Mira el pipeline de la rama**: tests de desarrollo y tests de QA. Si los de desarrollo fallan, de vuelta al developer — QA no debe gastar tiempo en detectar lo que las puertas automáticas ya detectan. Corolario: **no asignes a QA un ticket con el pipeline en rojo**.
4. **Ejecuta los casos de prueba propuestos por el developer** y añade los tuyos si ves huecos de cobertura. Como QA, aquí también reviso dos cosas más: que los criterios de aceptación están **cubiertos por los tests del developer**, y si algún test funcional mío se vuelve redundante porque ya lo cubre un test de desarrollo — eliminar duplicación también es revisar.
5. **¿Problemas?** Comenta en el ticket **especificando el error** (no "no funciona") y re-testea el fix.
6. **Cierre**: validado el ticket — sin conflictos, mergea el revisor; con conflictos, el revisor deja constancia de que está validado y el developer resuelve y mergea.
7. Al entregar, **rellena la fix version**: saber en qué versión entra cada cambio no es opcional.

## Peer review entre QAs

Las tareas del propio equipo de QA (framework de automatización, pipelines, documentación) también pasan por revisión de un par — **toda tarea, siempre**, aunque haya revisores por defecto.

### El autor prepara la revisión

Antes de poner el ticket en la columna de review (sin asignar, para que se vean las pendientes):

- **Pipeline ejecutado sobre su rama** — si la tarea incluye tests, la evidencia de que funcionan va por delante.
- **Enlace al caso/suite del gestor de casos** que cubre — el revisor entiende *qué* se está cubriendo.
- Documentación o contexto necesario, en el ticket.
- Aviso en el canal del equipo.

### El revisor

1. Se **auto-asigna** y reacciona al mensaje del canal (visibilidad).
2. Comprueba tres cosas: el código sigue las buenas prácticas; los reportes del pipeline pasan; y — la que se olvida — **los cambios resuelven el problema descrito en el ticket**. Recomendación: bájate los cambios y pruébalos en local.
3. ¿Cambios? Comentarios nativos en la PR + "Changes requested" + reasignar al autor. En tareas complejas, una revisión en pareja acelera.
4. Cierre: el revisor **aprueba y mergea**, rellena versión y componentes, mueve a "Entregado" y se des-asigna.

## La regla de oro

> **Las revisiones pendientes tienen prioridad máxima** sobre el resto del trabajo (si tu carga lo permite). Desbloquear a un compañero multiplica el throughput del equipo; tu tarea solo te acelera a ti.
