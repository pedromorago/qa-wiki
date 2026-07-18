# Fundamentos del testing de rendimiento

Una prueba de rendimiento sin objetivo definido solo produce gráficas bonitas. Antes de abrir cualquier herramienta hay que saber **qué pregunta se quiere responder**: ¿aguanta el pico del lanzamiento de una nueva tarifa o de una campaña de portabilidad? ¿cuántos usuarios soporta antes de degradarse? ¿hay fugas de memoria tras horas de uso?

## Los tipos de prueba (y la pregunta que responde cada uno)

| Tipo | Cómo es la carga | Pregunta que responde |
|---|---|---|
| **Carga** (load) | La esperada en producción, sostenida | ¿Cumplimos los objetivos con el tráfico normal? |
| **Estrés** (stress) | Creciente hasta romper | ¿Dónde está el límite y cómo falla al llegar? |
| **Pico** (spike) | Subida brusca y bajada | ¿Sobrevivimos a una avalancha repentina? |
| **Resistencia** (soak) | Moderada, durante horas | ¿Hay degradación con el tiempo (fugas, colas que crecen)? |

## Las métricas que importan

- **Latencia por percentiles**: p50 (mediana), p95, p99. **La media engaña**: una media de 200 ms puede esconder un p99 de 4 segundos, y ese p99 es la experiencia de tu 1 % de usuarios más desafortunado — que en un sistema grande son miles.
- **Throughput**: peticiones por segundo que el sistema procesa de verdad (no las que le lanzas).
- **Tasa de error**: el rendimiento con errores no cuenta. Un sistema "rápido" que devuelve 500 no es rápido: está roto.
- **Saturación de recursos**: CPU, memoria, conexiones de base de datos — explican el *porqué* de las otras tres.

La señal clásica: al subir la carga, el throughput crece hasta un punto y se aplana, mientras la latencia se dispara. Ese codo es la capacidad real del sistema.

## Cómo plantear una prueba que signifique algo

1. **Objetivos medibles antes de empezar**: "p95 < 500 ms y errores < 0,1 % con 200 usuarios concurrentes". Sin objetivo no hay veredicto.
2. **Modelo de carga realista**: mezcla de operaciones como en producción (¿80 % consultas de catálogo, 20 % altas de pedido?), ramp-up gradual, datos variados. Cien usuarios haciendo la misma petición cacheada no prueban nada.
3. **Entorno representativo**: los resultados escalan mal entre entornos; si pruebas en uno 4 veces más pequeño, documenta la diferencia y no extrapoles alegremente.
4. **Un cambio por iteración**: mide, cambia una cosa, vuelve a medir. Como en cualquier experimento.

## Las herramientas

- **[JMeter](/es/performance/jmeter-in-practice)** — el veterano de Apache: gráfico para diseñar, CLI para ejecutar, enorme ecosistema. El estándar de facto en muchas empresas.
- **k6** — code-first en JavaScript, pensado para CI y para desarrolladores; los umbrales (`thresholds`) como gate de pipeline son elegantísimos.
- **Gatling** — code-first en el ecosistema JVM, informes muy buenos.

La herramienta importa menos que el modelo de carga y las métricas: los cuatro conceptos de arriba aplican igual en las tres.

## Errores comunes

- **Probar sin objetivo** y decidir después si el resultado "parece bueno".
- **Mirar solo la media** — los percentiles altos son donde vive el dolor real.
- **Generar la carga desde tu portátil** contra un entorno remoto: acabas midiendo tu wifi.
- **Ignorar el warm-up**: los primeros minutos (cachés frías, JIT) no son representativos.
- **No repetir la prueba**: un solo run es una anécdota, no un dato.

::: tip Idea clave
Una prueba de rendimiento es un experimento: hipótesis (el objetivo), condiciones controladas (entorno y modelo de carga) y medición honesta (percentiles, no medias). Si falta cualquiera de las tres patas, es teatro con gráficas.
:::

## Referencias

- [Documentación de JMeter](https://jmeter.apache.org/usermanual/index.html)
- [Documentación de k6](https://grafana.com/docs/k6/latest/)
