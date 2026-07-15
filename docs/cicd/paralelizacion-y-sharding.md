# Paralelización y sharding de tests

Cuando la suite E2E crece, el tiempo de pipeline se convierte en el cuello de botella del equipo: nadie quiere esperar 40 minutos para saber si su PR rompe algo. La solución es ejecutar en paralelo — y hacerlo **bien** es un problema más interesante de lo que parece.

## Dos niveles de paralelismo

1. **Workers dentro de una máquina** — Playwright, por ejemplo, ejecuta N tests a la vez en una misma máquina (`workers` en la config). Barato, pero limitado por la CPU/RAM de la máquina.
2. **Sharding entre máquinas** — repartir la suite entre M máquinas de CI que corren a la vez (`--shard=1/4`, `--shard=2/4`…). Escala más, pero cada máquina extra cuesta dinero.

Ambos se combinan: 4 shards × 4 workers = 16 tests simultáneos.

## El problema real: el reparto

El tiempo total de la pipeline no es la media de los shards, es **el shard más lento** (*makespan*). Un reparto ingenuo (mismo número de tests por shard) produce shards desequilibrados, porque los tests no duran lo mismo: uno tarda 8 segundos y otro 4 minutos.

```
Reparto ingenuo (por número de tests):     Reparto por duración:
Shard 1: ████████████████████ 22 min       Shard 1: ████████████ 13 min
Shard 2: ████████ 9 min                    Shard 2: ███████████▌ 12,5 min
Shard 3: ██████ 7 min                      Shard 3: ████████████ 13 min
                 ⌛ total: 22 min                        ⌛ total: 13 min
```

Mismo hardware, mismos tests: **9 minutos menos por ejecución**, solo por repartir mejor.

## Cómo repartir mejor

- **Greedy por duración (LPT)**: ordenar los tests de más largo a más corto e ir asignando cada uno al shard menos cargado. Simple y muy efectivo.
- **Optimización exacta**: el reparto óptimo es un problema de *bin packing / makespan minimization* que se puede modelar como **programación lineal entera mixta (MILP)**. Yo lo hice en Python para la suite E2E de mi equipo: ~40% menos de tiempo de validación en CI/CD **sin añadir infraestructura**. De esa experiencia nació mi proyecto [CI Shard Advisor](https://github.com/pedro-morago/ci-shard-advisor).
- **Restricciones del mundo real**: tests que no pueden correr en paralelo (comparten datos), setups costosos que conviene agrupar en el mismo shard, y duraciones que cambian — el reparto hay que recalcularlo periódicamente con datos frescos de ejecuciones anteriores.

## Requisito previo: tests independientes

Nada de esto funciona si los tests dependen unos de otros. Para poder paralelizar:

- **Cada test crea (o le inyectan) sus propios datos** — nunca depender de lo que dejó otro test.
- **Usuarios/cuentas aislados por test o por worker** — dos tests logueados con el mismo usuario a la vez = falsos rojos.
- **Sin orden implícito**: si `test B` solo pasa después de `test A`, no son dos tests, son uno mal partido.
- **Limpieza**: idealmente vía API en el teardown, no desde la UI.

::: warning El síntoma
Si tu suite pasa en secuencial y falla en paralelo, no tienes un problema de paralelización: tienes tests acoplados, y la paralelización solo lo ha destapado.
:::

## Checklist para acelerar una pipeline de E2E

1. Mide primero: duración por test y por shard (los reporters de Playwright/JUnit lo dan gratis).
2. Elimina los top-offenders: ¿ese test de 5 minutos puede bajar a la capa de API?
3. Equilibra los shards por duración, no por número de tests.
4. Revisa el balance periódicamente: la suite de hoy no es la de hace 3 meses.
5. Solo entonces plantéate añadir máquinas.
