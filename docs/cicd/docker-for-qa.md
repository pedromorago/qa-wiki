# Docker for QA

Docker solves testing's oldest problem: **"it works on my machine"**. A container packages the application with all its dependencies, so the environment where you test is reproducible — the same today, tomorrow and in the pipeline.

## The three concepts

| Concept | What it is | Analogy |
|---|---|---|
| **Image** | The immutable template (app + dependencies) | The class |
| **Container** | A running instance of the image | The object |
| **Registry** | Where images get published (Docker Hub, private registries) | The package repository |

## The day-to-day commands

```bash
docker ps                        # which containers are running
docker run -d -p 8080:80 app     # start one (mapping port 8080 → 80)
docker logs -f <container>       # follow its logs live
docker exec -it <container> sh   # step inside to look around
docker stop <container>          # stop it
```

And the one you'll use most: **Docker Compose**, which defines a full environment (app + database + mocks) in one YAML:

```yaml
services:
  app:
    image: my-app:1.4.2
    ports: ["8080:8080"]
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: test
```

```bash
docker compose up -d    # bring the whole environment up
docker compose down -v  # tear it down, data included (-v)
```

## What a QA uses it for

- **Running the product locally** at the exact version you want to test: `docker run my-app:1.4.2` and you're testing 1.4.2, no installs.
- **Ephemeral test environments**: the pipeline brings up app + database with Compose, runs the suite and destroys it. Every run starts from zero — goodbye to contaminated state between runs.
- **Packaged test dependencies**: browsers for E2E, mocks of external services, one clean database per suite (if you work on the JVM, look at *Testcontainers*: containers managed from the test itself).
- **Diagnosis**: when an integration test fails, `docker logs` of the involved service usually holds the answer.

## Common mistakes

- **Using the `latest` tag**: today it tests one thing, tomorrow another, with nobody having touched anything. Version images like you version code.
- **Not cleaning volumes** (`down` without `-v`): data survives and the next run inherits the previous run's state — guaranteed flakiness.
- **Getting localhost wrong**: inside a container, `localhost` is the container itself. Compose services are reached by name (`db:5432`, not `localhost:5432`).
- **Unbounded containers in CI**: one greedy container degrades the rest of the pipeline.

::: tip Key idea
For a QA, Docker is the environment factory: identical, versioned and disposable. If the environment is reproducible, every bug you find is too — and that's half the battle.
:::

## References

- [Docker — Get started](https://docs.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Testcontainers](https://testcontainers.com/)
