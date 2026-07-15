# Capas de testing en frontend, con ejemplos

El equivalente frontend de las [capas de backend](/estrategia/capas-de-testing-backend). Ejemplo conductor: **el formulario de alta de usuario** en la página de administración de un SaaS.

## Unit: lógica del componente, sin navegador

Sin DOM real ni navegador; eventos simulados y **todas las llamadas a la API mockeadas** — nunca datos reales. Ficheros `*.test.tsx` junto al código (stack React/TS típico).

Para el formulario de alta:

- Se renderiza correctamente en modo readOnly.
- Se muestran las validaciones del campo contraseña (no coinciden, contraseña débil…).
- Las labels muestran el texto correcto.

Las cuatro áreas de foco habituales:

1. **Inicialización y renderizado** del componente (el foco principal).
2. **Estado de carga** — que hay feedback apropiado mientras llegan datos.
3. **Textos, botones y elementos** — incluida la verificación de que un clic **dispara la llamada API correcta** (mockeada, pero se verifica la invocación).
4. **Filtrado** — con valores mock, en componentes con filtros.

Asunción deliberada: la API entregará los datos correctos. El contrato con la API se valida en otras capas — el unit de front valida representación y comportamiento.

Limitaciones asumidas: no evalúan cómo los estilos afectan al layout, y los eventos no son eventos reales de navegador. Herramientas: Jest/Vitest + React Testing Library.

## Component: el componente aislado, en navegador real

El punto intermedio que más se olvida: el componente **solo**, pero en un navegador de verdad — lógica y apariencia a la vez, con interacciones reales.

- El botón "Crear" solo es visible cuando todos los campos obligatorios son válidos.
- Completar el formulario y pulsar "Crear".

Herramientas: Playwright Component Testing, Cypress Component Testing, Storybook.

## E2E: el flujo del usuario, con la aplicación completa

Aplicación desplegada entera (BD incluida), datos reales vía API. El flujo del ejemplo:

1. Login y navegar a la página de usuarios.
2. Clic en "Crear".
3. Rellenar el formulario con datos válidos.
4. Comprobar que los desplegables muestran los **roles correctos** (datos reales del backend).
5. Enviar y confirmar: banner de notificación + el usuario aparece en el listado.

Dos reglas de oro de esta capa:

- Todo flujo empieza con login y navegación; si el test necesita datos previos, **se crean vía API antes** — nunca dependiendo de lo que haya en el entorno.
- El foco es la integración de páginas y datos a lo largo del flujo, **no la implementación técnica** ni el aislamiento de componentes (para eso están las otras capas).

## Quién escribe qué

Un reparto que funciona muy bien en la práctica: **los developers de frontend escriben los unit tests** (conocen la lógica interna del componente) y **QA escribe los E2E** (conoce los flujos del usuario y el riesgo). Los component tests se reparten según el equipo.

## Resumen operativo

| Capa | Qué valida | Herramientas típicas | Cuándo corre |
|---|---|---|---|
| Unit | Lógica sin DOM/navegador, APIs mockeadas | Jest, Vitest, Testing Library | Cada commit |
| Component | Comportamiento + apariencia en navegador real | Playwright CT, Cypress CT, Storybook | Cada pull request |
| E2E | Flujos de usuario con backend y BD reales | Playwright, Cypress | Main/staging, pre-release |

Unit da feedback inmediato sobre unidades aisladas; E2E da confianza sobre el sistema completo con datos reales, a cambio de lentitud y complejidad. No compiten: se complementan — y cuando una capa cuesta más de lo que aporta (nos pasó con unos unit de front especialmente complejos), es legítimo **retirarla y cubrir ese riesgo desde otra capa**, dejándolo documentado.
