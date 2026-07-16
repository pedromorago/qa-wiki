# CI/CD y calidad de código

El testing no vive solo en el repositorio de tests: vive en la pipeline. Integración de pruebas en CI/CD, análisis estático y optimización de la ejecución.

- [Git básico para QA](/es/cicd/git-for-qa) — el flujo diario con ramas y PRs, y Git como herramienta de investigación: diff, blame y bisect.
- [Validaciones por entorno](/es/cicd/environment-validations) — qué batería corre en cada etapa (PR → integración → release) y por qué.
- [Análisis estático](/es/cicd/static-analysis) — SonarCloud, quality gates, SonarLint, Checkstyle y ESLint, en pipeline y en el IDE.
- [Paralelización y sharding de tests](/es/cicd/parallelization-and-sharding) — repartir la suite para que la pipeline vuele (sin pagar más infraestructura).
- [Jenkins y GitLab CI](/es/cicd/jenkins-and-gitlab-ci) — el diccionario de equivalencias entre herramientas de pipeline y lo esencial de cada una.
- [Docker para QA](/es/cicd/docker-for-qa) — entornos reproducibles y desechables: imágenes, Compose y para qué los usa un QA.
- [AWS para QA](/es/cicd/aws-for-qa) — S3, CloudWatch, RDS y la autonomía de encontrar logs, datos y artefactos en la nube.
