# IA en automatización de pruebas: lo que funciona (y lo que aún no)

Notas de dos experiencias reales con IA aplicada a QA: una POC con los agentes de Playwright y el uso de asistentes de código durante una migración masiva de tests. Sin humo: con números y veredictos.

## POC: los agentes de Playwright

Playwright ofrece tres agentes de IA. Los evaluamos sobre una suite E2E real:

### 🩹 Healer — arregla tests fallidos

- **Fiable** cuando el fallo está **en el propio repo de automatización**: locators mal especificados o errores de implementación del test. En la POC introdujimos un typo en el argumento de un método y lo identificó y corrigió rápidamente.
- **Falla** cuando muchos tests caen a la vez por cambios de selectores en la aplicación: no consigue detectar el desajuste entre el código del frontend y los selectores de la automatización.

**Veredicto**: útil como detector de errores de implementación del test; no para fallos causados por cambios en la aplicación.

### 📋 Planner — genera planes de prueba

Le das contexto de la app y cuántos escenarios quieres; produce un `.md` con escenarios numerados y pasos con `expect:` anidados. Lo que más me sorprendió: la cobertura incluye **responsividad, accesibilidad (teclado, screen reader, ARIA) y rendimiento con datasets grandes** — dimensiones que un plan manual olvida a menudo.

**Veredicto**: valioso como **generador de checklists de escenarios** que un humano cura e implementa.

### 🤖 Generator — genera los tests

Toma el plan del Planner + contexto del enfoque del equipo (POM, locators) y genera la clase de test. Los números de nuestra POC:

- Generar un test de un escenario cross-domain: **13–15 minutos**.
- La mayoría de los tests generados **no funcionan** y traen un número significativo de errores.
- Arreglar un solo test cross-domain: **más de 15 minutos**.

**Veredicto**: para E2E complejos, hoy no compensa frente a escribirlo tú con el POM existente.

### Conclusión de la POC

La solución de agentes **no encaja (aún) en el flujo diario** de creación y mantenimiento de tests E2E complejos. Lo aprovechable: Healer para fallos puntuales de implementación y Planner como brainstorming de escenarios.

## Lo que sí funcionó: IA como acelerador de migración

Durante la [migración TestCafe → Playwright](/automatizacion/migrar-de-testcafe-a-playwright) usamos Copilot/ChatGPT con una técnica simple que multiplica la calidad del resultado: **el fichero de referencia** (few-shot). En vez de pedir "migra esto a Playwright" en frío:

```
> Use 'editor.ts' as a reference example to migrate selectors
> from 'Feature/UI/Feature.js'
```

El flujo completo: **corpus de estilo** (tests ya migrados a mano por humanos) + IA para el trabajo mecánico de traducción + **revisión humana siempre**. La IA rinde muchísimo mejor imitando tu patrón que inventando el suyo.

## Mis reglas de uso de IA en QA

1. **La IA propone, el humano cura.** Borradores de criterios de aceptación, planes de prueba, migraciones mecánicas: sí. Resultado final sin revisar: no.
2. **Dale ejemplos, no descripciones.** Un fichero de referencia vale más que tres párrafos de instrucciones.
3. **Nunca compartas datos sensibles** (negocio, seguridad interna, datos personales) con herramientas de IA externas.
4. **Mide antes de adoptar.** Nuestra POC costó poco y nos ahorró adoptar un flujo que hoy no compensa. Los veredictos caducan: lo que hoy no funciona, en dos versiones puede funcionar — re-evalúa.
