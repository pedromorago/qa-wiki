# Glosario de QA

Términos que uso en el día a día, explicados en corto. En orden alfabético.

**Ambiente / Entorno** — Cada instancia donde vive la aplicación: local, desarrollo, staging (pre-producción), producción.

**Bug (defecto)** — Discrepancia entre el comportamiento real y el esperado. Cadena habitual: *error* humano → *defecto* en el código → *fallo* observable en ejecución.

**Criterios de aceptación** — Condiciones concretas y verificables que una historia de usuario debe cumplir para considerarse terminada. Si no son testeables, no son criterios de aceptación.

**Cobertura (coverage)** — Medida de cuánto ejercitan los tests el sistema (líneas, ramas, requisitos). Alta cobertura ≠ buenas pruebas: puedes ejecutar todo el código sin verificar nada.

**DoD (Definition of Done)** — Checklist acordada por el equipo que define cuándo un trabajo está realmente terminado (código + tests + revisión + documentación…).

**E2E (End to End)** — Prueba que recorre un flujo completo del sistema desde la perspectiva del usuario, atravesando todas las capas.

**Flaky test** — Test que a veces pasa y a veces falla sin que cambie el código. Causas típicas: esperas mal gestionadas, dependencia de datos compartidos, orden de ejecución, entorno inestable.

**Happy path** — El flujo principal donde todo va bien: datos válidos, usuario correcto, sin errores. Lo contrario son los *edge cases* y el *testing negativo*.

**Hotfix** — Corrección urgente que se despliega a producción fuera del ciclo normal de releases.

**IDOR (Insecure Direct Object Reference)** — Vulnerabilidad de autorización: acceder a recursos de otro usuario cambiando un ID en la petición.

**Mock / Stub** — Sustitutos controlados de dependencias reales (servicios, APIs) para aislar lo que se está probando.

**Regresión** — Defecto en algo que antes funcionaba, introducido por un cambio posterior. *Testing de regresión*: re-ejecutar pruebas para detectarlas.

**Release** — Versión del software que se publica. *Release notes*: qué incluye.

**Shift-left** — Mover las actividades de calidad lo más temprano posible en el ciclo: revisar requisitos, testear diseños, automatizar desde el primer commit.

**Smoke test** — Verificación mínima y rápida de que lo esencial funciona, antes de invertir en pruebas más profundas.

**Test case (caso de prueba)** — Conjunto de precondiciones, pasos, datos y resultado esperado que verifica un comportamiento concreto.

**Test plan** — Documento que define alcance, enfoque, recursos y calendario de las actividades de prueba.

**Trazabilidad** — Relación entre requisitos ↔ casos de prueba ↔ bugs. Permite responder "¿qué requisitos están cubiertos?" y "¿qué pruebas debo repetir si cambia este requisito?".

**UAT (User Acceptance Testing)** — Pruebas de aceptación realizadas por el cliente o usuarios finales para validar que el producto resuelve su necesidad.
