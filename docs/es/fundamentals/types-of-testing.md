# Tipos de testing

Clasificar los tipos de prueba ayuda a hablar un lenguaje común con el equipo y a detectar huecos en la estrategia de pruebas.

## Funcional vs no funcional

- **Testing funcional**: verifica *qué* hace el sistema. ¿El alta de un pedido de fibra genera el pedido de servicio? ¿La tarifa aplicada es la del catálogo?
- **Testing no funcional**: verifica *cómo* lo hace. Rendimiento, carga, seguridad, usabilidad, accesibilidad, compatibilidad.

## Caja negra, caja blanca, caja gris

| Enfoque | Conocimiento del código | Ejemplo |
|---|---|---|
| **Caja negra** | Ninguno; solo entradas y salidas | Probar un formulario desde la UI |
| **Caja blanca** | Total; se prueba la estructura interna | Tests unitarios, cobertura de ramas |
| **Caja gris** | Parcial | Probar la UI conociendo la API que hay detrás |

## Niveles de prueba

1. **Unitarias** — una función o clase de forma aislada. Las escriben (normalmente) los desarrolladores.
2. **De integración** — la interacción entre componentes: servicio + base de datos, módulo A + módulo B.
3. **De sistema / E2E** — el flujo completo desde la perspectiva del usuario.
4. **De aceptación (UAT)** — validación de que el producto resuelve la necesidad de negocio.

## Tipos que hay que conocer sí o sí

- **Smoke testing**: batería mínima y rápida que verifica que lo crítico funciona. Si el smoke falla, no tiene sentido seguir probando.
- **Sanity testing**: verificación rápida y enfocada tras un cambio concreto, para confirmar que la funcionalidad afectada sigue teniendo sentido.
- **Regresión**: re-ejecutar pruebas existentes para confirmar que un cambio no ha roto lo que ya funcionaba. Es el candidato número uno a automatización.
- **Exploratorio**: probar sin guion cerrado, diseñando y ejecutando a la vez, guiado por la experiencia y la intuición. No es "probar a lo loco": se organiza en sesiones con objetivos (*charters*).
- **Re-testing (confirmación)**: volver a probar un bug concreto tras su corrección.

::: warning Regresión ≠ Re-testing
Re-testing confirma que **el bug arreglado** ya no ocurre. Regresión confirma que el arreglo **no ha roto otra cosa**. Se complementan, no se sustituyen.
:::

## No funcionales más habituales

- **Rendimiento**: tiempos de respuesta bajo condiciones normales.
- **Carga**: comportamiento con el volumen de usuarios esperado.
- **Estrés**: comportamiento más allá del límite esperado — ¿degrada con elegancia o revienta?
- **Seguridad**: vulnerabilidades (inyección, XSS, gestión de sesiones…).
- **Usabilidad y accesibilidad**: que cualquier persona pueda usar el producto (WCAG).
- **Compatibilidad**: navegadores, dispositivos, sistemas operativos, resoluciones.
