# Git básico para QA

La automatización es código, y el código vive en Git. Pero para un QA, Git es más que "subir mis tests": es una herramienta de **investigación** — saber qué cambió en una release para enfocar las pruebas, o encontrar el commit exacto que rompió algo.

## El modelo mental

Git mueve cambios entre cuatro sitios:

```
directorio de trabajo → staging → repositorio local → remoto (GitHub, Bitbucket…)
        (editas)      (git add)    (git commit)         (git push)
```

Entender este flujo evita el 90 % de las confusiones. Lo demás son comandos.

## Los comandos del día a día

| Quiero… | Comando |
|---|---|
| Traerme un repo | `git clone <url>` |
| Ver en qué estado estoy | `git status` |
| Preparar mis cambios | `git add <archivo>` (o `git add -p` para revisar trozo a trozo) |
| Guardarlos con mensaje | `git commit -m "..."` |
| Subirlos | `git push` |
| Traer lo último | `git pull` |
| Crear una rama y saltar a ella | `git switch -c mi-rama` |
| Cambiar de rama | `git switch otra-rama` |
| Ver el historial | `git log --oneline` |

El flujo normal en equipo: **rama por tarea + pull request**. Nunca directamente sobre `main` — ni para "un cambio pequeñito".

## Git como herramienta de investigación

Aquí es donde Git da superpoderes a un QA:

- **`git log` y `git diff` entre versiones** — qué cambió exactamente en esta release. Es la base del testing dirigido por riesgo: prueba más fuerte lo que más se tocó.
- **`git blame <archivo>`** — quién y cuándo tocó cada línea. No para señalar a nadie: para saber a quién preguntar y qué tarea introdujo el cambio.
- **`git bisect`** — la joya. Si un bug "antes no pasaba", bisect hace una **búsqueda binaria entre commits**: marcas uno bueno y uno malo, Git te va proponiendo puntos intermedios, y en pocos pasos tienes el commit exacto que lo introdujo. Convierte "no sé desde cuándo falla" en un procedimiento.
- **Volver a una versión anterior** (`git checkout <tag>`) — reproducir cómo se comportaba el producto en la versión N-1 sin pedírselo a nadie.

## Higiene para el código de tests

- **Commits pequeños y frecuentes**, con mensajes que digan el *porqué* ("estabilizar espera en login" dice más que "fix").
- **`.gitignore` para los artefactos**: screenshots, vídeos, reports y `node_modules` no se commitean. Solo código y configuración.
- **Nunca credenciales en el repo.** Los datos de acceso de los tests van en variables de entorno o en el gestor de secretos, jamás hardcodeados — el historial de Git no olvida.
- **Rama actualizada antes del PR**: integra `main` en tu rama y ejecuta la suite antes de pedir revisión.

## Errores comunes

- **Trabajar sobre `main`** y descubrirlo al hacer push.
- **Commits gigantes** ("cambios varios") que hacen imposible revisar o revertir con precisión.
- **`git push --force` en ramas compartidas** — reescribe historia que otros ya tienen. Si lo necesitas en tu propia rama, `--force-with-lease` al menos comprueba que no pisas trabajo ajeno.
- **Resolver conflictos sin leerlos**, aceptando "todo lo mío" o "todo lo suyo". Un conflicto mal resuelto es un bug silencioso.

::: tip Idea clave
Para un QA, Git no es solo donde viven los tests: es el registro forense del producto. `git diff` te dice dónde mirar y `git bisect` te dice desde cuándo — dos preguntas que un tester hace todos los días.
:::

## Referencias

- [Pro Git](https://git-scm.com/book/es/v2) — el libro oficial, gratuito y traducido al español.
- [Learn Git Branching](https://learngitbranching.js.org/?locale=es_ES) — práctica interactiva de ramas, visual y muy buena.
