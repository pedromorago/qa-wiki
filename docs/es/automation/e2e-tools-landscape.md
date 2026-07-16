# El panorama de herramientas E2E

Selenium, Cypress, WebDriverIO, Playwright… los nombres cambian más deprisa que las ideas. Entender **cómo funciona cada familia por dentro** vale más que memorizar APIs: la arquitectura explica sus fortalezas, sus limitaciones y cuál encaja en cada proyecto.

## Las tres arquitecturas

- **Protocolo WebDriver** (Selenium, WebDriverIO): los comandos viajan por HTTP a un driver que controla el navegador. Es un **estándar del W3C**: máxima compatibilidad de navegadores y lenguajes, a cambio de más latencia y esperas manuales.
- **Dentro del navegador** (Cypress): el test se ejecuta junto a la aplicación, en el propio navegador. Feedback y debugging excelentes, pero limitaciones estructurales (multi-pestaña, múltiples orígenes, navegadores soportados).
- **Protocolos nativos del navegador** (Playwright, vía CDP y equivalentes): control directo y bidireccional del navegador desde fuera. Auto-espera, contextos aislados baratos y paralelización sencilla.

## Comparativa rápida

| | Selenium | WebDriverIO | Cypress | Playwright |
|---|---|---|---|---|
| Arquitectura | WebDriver | WebDriver (y BiDi/CDP) | In-browser | CDP/nativos |
| Lenguajes | Java, Python, JS, C#… | JavaScript/TypeScript | JavaScript/TypeScript | TS/JS, Java, Python, .NET |
| Esperas | Explícitas (a tu cargo) | Mixtas | Automáticas | Automáticas |
| Punto fuerte | Estándar, legacy, grids | Ecosistema de servicios y config | DX y debugging | Velocidad, estabilidad, paralelo |

## Selenium: lo mínimo que hay que saber

Sigue siendo el estándar del sector y lo que más aparece en proyectos con historia:

- **WebDriver** es el objeto central: `driver.findElement(By.cssSelector(...))`, `click()`, `sendKeys()`.
- **Las esperas son tu responsabilidad.** La causa número uno de flakiness en Selenium son los `sleep` y las esperas implícitas: la herramienta correcta es `WebDriverWait` con condiciones explícitas (elemento visible, clicable…).
- **Selenium Grid** permite repartir la ejecución entre máquinas y navegadores; es el antecesor conceptual del [sharding moderno](/es/cicd/parallelization-and-sharding).
- El [Page Object Model](/es/automation/page-object-model) nació en este ecosistema y aplica igual.

## WebDriverIO en dos líneas

Framework JavaScript sobre el protocolo WebDriver (hoy también BiDi/CDP), con un sistema de configuración y *services* muy maduro. Punto medio entre el estándar Selenium y la experiencia moderna: común en equipos JS con necesidades de compatibilidad amplia o de Appium (móvil).

## Cómo elegir

- **Proyecto nuevo, equipo TS/JS, CI intensivo** → Playwright (mi elección por defecto; [primeros pasos](/es/automation/playwright-first-steps)).
- **Suite existente o requisitos de compatibilidad/lenguaje** → Selenium o WebDriverIO; no se migra por moda, [se migra con números](/es/automation/migrating-from-testcafe-to-playwright).
- **Equipo que valora el debugging visual por encima de todo** → Cypress sigue siendo una gran experiencia.

::: tip Idea clave
Los selectores, el POM, las esperas y el diseño de casos viajan contigo de una herramienta a otra. Aprende una bien y entiende la arquitectura de las demás: eso es lo que no caduca.
:::

## Referencias

- [Documentación de Selenium](https://www.selenium.dev/documentation/)
- [Documentación de WebDriverIO](https://webdriver.io/docs/gettingstarted)
- [Documentación de Playwright](https://playwright.dev/) · [Documentación de Cypress](https://docs.cypress.io/)
