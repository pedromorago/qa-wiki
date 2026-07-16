# Docker para QA

Docker resuelve el problema más viejo del testing: **"en mi máquina funciona"**. Un contenedor empaqueta la aplicación con todas sus dependencias, así que el entorno donde pruebas es reproducible — el mismo hoy, mañana y en la pipeline.

## Los tres conceptos

| Concepto | Qué es | Analogía |
|---|---|---|
| **Imagen** | La plantilla inmutable (app + dependencias) | La clase |
| **Contenedor** | Una instancia en ejecución de la imagen | El objeto |
| **Registry** | Donde se publican las imágenes (Docker Hub, registries privados) | El repositorio de paquetes |

## Los comandos del día a día

```bash
docker ps                        # qué contenedores corren
docker run -d -p 8080:80 app     # arrancar (mapeando el puerto 8080 → 80)
docker logs -f <contenedor>      # ver sus logs en directo
docker exec -it <contenedor> sh  # entrar a mirar dentro
docker stop <contenedor>         # parar
```

Y el que más usarás: **Docker Compose**, que define un entorno completo (app + base de datos + mocks) en un YAML:

```yaml
services:
  app:
    image: mi-app:1.4.2
    ports: ["8080:8080"]
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: test
```

```bash
docker compose up -d    # levantar el entorno entero
docker compose down -v  # tirarlo, incluidos los datos (-v)
```

## Para qué lo usa un QA

- **Levantar el producto en local** en la versión exacta que quieras probar: `docker run mi-app:1.4.2` y estás probando la 1.4.2, sin instalar nada.
- **Entornos de prueba efímeros**: la pipeline levanta app + base de datos con Compose, ejecuta la suite y lo destruye. Cada ejecución parte de cero — adiós al estado contaminado entre ejecuciones.
- **Dependencias de test empaquetadas**: navegadores para E2E, mocks de servicios externos, una base de datos limpia por suite (si trabajas en JVM, mira *Testcontainers*: contenedores gestionados desde el propio test).
- **Diagnóstico**: cuando un test de integración falla, `docker logs` del servicio implicado suele contener la respuesta.

## Errores comunes

- **Usar el tag `latest`**: hoy prueba una cosa y mañana otra sin que nadie haya tocado nada. Versiona las imágenes como versionas el código.
- **No limpiar los volúmenes** (`down` sin `-v`): los datos sobreviven y la siguiente ejecución hereda el estado de la anterior — flakiness asegurada.
- **Confundir el localhost**: dentro de un contenedor, `localhost` es el propio contenedor. Los servicios de un Compose se alcanzan por su nombre (`db:5432`, no `localhost:5432`).
- **Imágenes sin recursos limitados en CI**: un contenedor glotón degrada al resto de la pipeline.

::: tip Idea clave
Para un QA, Docker es la máquina de fabricar entornos: idénticos, versionados y desechables. Si el entorno es reproducible, cada bug que encuentres lo es también — y esa es la mitad de la batalla.
:::

## Referencias

- [Docker — Get started](https://docs.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Testcontainers](https://testcontainers.com/)
