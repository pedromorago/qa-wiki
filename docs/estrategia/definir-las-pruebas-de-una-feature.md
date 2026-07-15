# Definir las pruebas de una feature

De la historia de usuario a los casos de prueba: el proceso que sigo cuando una feature entra en el ciclo.

## Antes de empezar: prerrequisitos

- La feature cumple la **Definition of Ready** — en particular, tiene **criterios de aceptación (AC)** claros y testeables.
- Todos los casos de prueba viven en un **gestor de casos** (TMS: Qase, TestRail…) enlazable con el gestor de tickets.

## En el refinamiento

Dos obligaciones, y la segunda casi nadie la hace:

1. Definir los criterios de aceptación.
2. **Buscar si ya existen casos de prueba que apliquen a esta feature** — y si los hay, enlazarlos al ticket ya, durante el refinamiento. Una feature casi siempre modifica funcionalidad existente: si no enlazas los casos afectados, quedarán desactualizados y duplicarás otros nuevos.

## Las tres familias de tests a definir

### 1. Tests de criterios de aceptación

Verifican que la feature hace lo que promete: acciones esperadas, resultados deseados, restricciones respetadas, integración con el resto del sistema y estándares de diseño/comportamiento.

El matiz importante: **no todos los tests de AC entran en regresión** — solo los que merece la pena ejecutar con cada cambio futuro de la aplicación. Reglas operativas:

- Si el test debe formar parte de la regresión → se define **en el TMS**, no en los "testing steps" del ticket (donde muere al cerrar el ticket).
- Si la feature cambia el comportamiento de casos existentes → **actualizarlos** en el TMS.
- Antes de dar la feature por buena: ejecutar los nuevos **y** los enlazados.

### 2. Tests de happy path

El flujo principal e ideal — y sobre todo, que la feature nueva **no rompe los happy paths existentes**. Se automatizan cuanto antes y suelen formar la suite de **sanity**, que corre en la PR y repetidamente en los pipelines de cada entorno.

### 3. Tests de edge cases

Valores límite, datos inusuales, flujos poco frecuentes, condiciones excepcionales. Destapan los puntos débiles invisibles en el uso normal. También se automatizan pronto y suelen formar la suite de **regresión**. Detalle práctico de pipeline: en la PR corre solo la regresión de backend (rápida); la completa corre tras el merge.

## De la familia a la capa

Definidos los casos, cada uno se asigna a la **capa más baja donde se pueda verificar con confianza** ([pirámide](/fundamentos/piramide-de-testing)):

- ¿Es lógica pura? → unit (probablemente ya la cubre el developer).
- ¿Es comportamiento de API o persistencia? → integración/API.
- ¿Es algo que el usuario ve o un flujo que cruza el sistema? → E2E, con moderación ([qué merece un E2E](/estrategia/que-debe-cubrir-un-e2e)).

Las capas concretas, con ejemplos: [backend](/estrategia/capas-de-testing-backend) y [frontend](/estrategia/capas-de-testing-frontend).

## Checklist final

- [ ] AC testeables definidos en el refinamiento
- [ ] Casos existentes afectados: buscados y enlazados al ticket
- [ ] Tests de AC definidos; los que van a regresión, creados en el TMS
- [ ] Happy paths cubiertos (y automatizados → sanity)
- [ ] Edge cases cubiertos (y automatizados → regresión)
- [ ] Cada caso asignado a su capa
- [ ] Ejecutados nuevos + enlazados antes de cerrar
