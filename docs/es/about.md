# Sobre mí

Soy **Pedro Morago**, QA Engineer con 5 años de experiencia en aseguramiento de la calidad y automatización de pruebas en productos SaaS internacionales. Esta wiki es mi base de conocimiento personal: todo lo que aprendo trabajando y estudiando, escrito con mis palabras.

- 🎓 Graduado en **Matemáticas** (Universidad de Cantabria) — de ahí me viene la manía de optimizarlo todo.
- 📜 **ISTQB® Certified Tester Foundation Level (CTFL) v4.0**
- 💼 QA Engineer en producto SaaS de ciberseguridad (threat modelling), antes en SaaS de field service management.
- 🌍 Trabajo 100% en remoto en equipos ágiles y distribuidos.

[LinkedIn](https://www.linkedin.com/in/pedro-morago-lópez-vazquez) · [GitHub](https://github.com/pedro-morago)

## Lo que hago en el día a día

- **Estrategia de testing**: definir el mix de pruebas a lo largo de la pirámide (unit, integración, API, E2E) para features y módulos completos.
- **Automatización backend**: APIs en **Java con REST Assured y JUnit 5** — patrón Given-When-Then, validación de JSON schemas, casos negativos, trazabilidad con Qase.
- **Automatización E2E**: **Playwright con TypeScript** (participé en una migración completa desde TestCafe que redujo los tiempos de ejecución ~80%). Anteriormente Cypress y Selenium.
- **CI/CD**: integración de pruebas en pipelines de Bitbucket, análisis estático (SonarCloud, linters) y optimización de la ejecución paralela.
- **Shift-left**: revisar requisitos y diseños desde fases tempranas y convertirlos en casos de prueba accionables.
- **Análisis de causa raíz** de bugs para orientar la estrategia de pruebas y reducir reincidencia.

## Proyectos

### 🧩 CI Shard Advisor
Herramienta para **optimizar el reparto de tests E2E entre shards de CI**. Nace de un problema real: diseñé un modelo de optimización en Python (programación lineal entera mixta) para paralelizar la ejecución de tests E2E, reduciendo el tiempo de pipeline en torno a un 40% sin aumentar el coste de infraestructura.
→ [github.com/pedro-morago/ci-shard-advisor](https://github.com/pedro-morago/ci-shard-advisor)

### 🎥 Grabador de pantalla
Extensión para grabar la pantalla desde el navegador. La evidencia en vídeo es de lo más valioso al reportar un bug, y quería una herramienta a mi medida.
→ [github.com/pedro-morago/grabador-pantalla](https://github.com/pedro-morago/grabador-pantalla)

### 📚 Esta wiki
El sitio donde estás ahora: wiki de formación QA construida con VitePress y desplegada automáticamente con GitHub Actions.
→ [github.com/pedro-morago/formacion](https://github.com/pedro-morago/formacion)

### 💼 Portfolio
Mi sitio personal con el resto de proyectos.
→ [github.com/pedro-morago/portfolio](https://github.com/pedro-morago/portfolio)

### 🎰 Spins *(en construcción)*
Próximamente.

## Por qué esta wiki

Tres motivos:

1. **Aprender escribiendo** — explicar algo con tus palabras es la prueba de fuego de que lo entiendes.
2. **Referencia rápida** — mi documentación de consulta mientras trabajo.
3. **Divulgación** — si a alguien más le sirve lo que voy aprendiendo, doble victoria.

## Cómo está hecha esta wiki

Transparencia total: mantengo esta wiki **con ayuda de Claude Code**. La experiencia, las decisiones técnicas y el criterio detrás de cada artículo son míos — salen de mi día a día como QA —, y la IA me ayuda con la redacción, la traducción y la infraestructura del sitio. Reviso y suscribo cada página.

Lo veo igual que la automatización de pruebas: la herramienta te multiplica, pero [no sustituye tu criterio](/es/automation/ai-in-test-automation). Saber trabajar *con* la IA — darle el contexto adecuado, revisar su salida con ojo crítico y mantener la propiedad del resultado — es parte de mi caja de herramientas como ingeniero.
