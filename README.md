# 📚 QA Wiki — Formación

[![Deploy](https://github.com/pedro-morago/formacion/actions/workflows/deploy.yml/badge.svg)](https://github.com/pedro-morago/formacion/actions/workflows/deploy.yml)
[![CI](https://github.com/pedro-morago/formacion/actions/workflows/ci.yml/badge.svg)](https://github.com/pedro-morago/formacion/actions/workflows/ci.yml)

Mi wiki personal de conocimiento en **Quality Assurance**: todo lo que voy aprendiendo, escrito con mis palabras, organizado y consultable. Me sirve como referencia mientras trabajo y como parte de mi portfolio.

**🌐 Web**: https://pedro-morago.github.io/formacion/

Construida con [VitePress](https://vitepress.dev): las entradas son archivos Markdown en `docs/`, cada pull request pasa un build de validación (CI, que también detecta enlaces rotos), y cada push a `main` despliega automáticamente a GitHub Pages.

## Cómo añadir contenido

1. Crear un `.md` en la carpeta de su categoría (p. ej. `docs/fundamentos/mi-tema.md`). Hay una [plantilla](docs/plantilla.md) con la estructura recomendada.
2. Añadirlo al sidebar en `docs/.vitepress/config.mts`:
   ```ts
   { text: 'Mi tema', link: '/fundamentos/mi-tema' }
   ```
3. Commit y push a `main`. En un par de minutos está publicado.

## Desarrollo en local

```bash
npm install
npm run dev      # servidor local con hot reload
npm run build    # build de producción
npm run preview  # previsualizar el build
```

## Estructura

```
docs/
├── .vitepress/config.mts   # configuración, menú y sidebar
├── index.md                # portada
├── fundamentos/            # conceptos base de QA
├── estrategia/             # estrategia de testing y procesos de calidad
├── api-testing/            # testing y automatización de APIs
├── automatizacion/         # Playwright, patrones y casos reales
├── cicd/                   # pipelines, análisis estático, sharding
├── glosario.md             # términos en corto
├── plantilla.md            # plantilla para nuevas entradas
└── sobre-mi.md             # bio y proyectos
```

## Activar GitHub Pages (solo la primera vez)

En el repo: **Settings → Pages → Source → GitHub Actions**. Con eso, el workflow de `.github/workflows/deploy.yml` se encarga del resto.
