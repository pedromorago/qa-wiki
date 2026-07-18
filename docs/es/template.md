# Plantilla para nuevas entradas

Copia esta estructura al crear una entrada nueva en la wiki. No es obligatorio rellenarlo todo — es un punto de partida para no empezar de cero.

```markdown
# Título del tema

Una o dos frases: qué es esto y por qué me importa como QA.

## Contexto

Dónde me encontré con esto (proyecto, curso, artículo) y qué problema resuelve.

## La idea principal

Explicación con mis palabras. Si no puedo explicarlo simple,
todavía no lo entiendo del todo.

## Ejemplo práctico

Un caso concreto, a poder ser de mi día a día.

## Cómo lo aplico

- Checklist o pasos accionables.

## Errores comunes / cosas que me sorprendieron

- ...

## Referencias

- [Enlace a la fuente](https://...)
```

## Convenciones de la wiki

1. **Un archivo `.md` por tema**, en la carpeta de su categoría (`docs/fundamentos/`, `docs/api-testing/`…).
2. **Nombre del archivo**: en minúsculas y con guiones — `mi-nuevo-tema.md`.
3. **Añadir la página al sidebar**: editar `docs/.vitepress/sidebar.ts` y añadir una línea `{ text: '...', link: '/categoria/mi-nuevo-tema' }` en su sección.
4. Para una **categoría nueva**: crear la carpeta con su `index.md` y añadir la sección al sidebar y al menú superior.
5. Escribir **con mis palabras**: la wiki vale por lo que yo entiendo, no por lo que copio.
6. **Dos dominios de ejemplo recurrentes**: los ejemplos de la wiki usan una plataforma de threat modeling y una operadora de telecomunicaciones como dominios ficticios, para que hablen el idioma de proyectos reales sin nombrar empresas ni productos.
