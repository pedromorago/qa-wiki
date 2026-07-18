# JMeter en la práctica

JMeter es el veterano del testing de rendimiento: interfaz gráfica para diseñar los planes y línea de comandos para ejecutarlos de verdad. Antes de tocarlo, conviene tener claros los [fundamentos](/es/performance/performance-fundamentals): la herramienta no arregla una prueba mal planteada.

## Las piezas de un test plan

Un plan de JMeter es un árbol de elementos:

| Elemento | Qué hace |
|---|---|
| **Test Plan** | La raíz: variables globales del plan |
| **Thread Group** | El modelo de carga: usuarios (threads), ramp-up y duración |
| **Samplers** (HTTP Request…) | Las peticiones que se envían |
| **Config Elements** | Configuración compartida: HTTP Header Manager, CSV Data Set Config |
| **Assertions** | Los criterios de aceptación de cada respuesta (contenido, duración) |
| **Post-Processors** (extractores) | Sacan valores de una respuesta para usarlos en la siguiente |
| **Listeners** | Visualización de resultados — solo para diseñar y depurar |

## El flujo de trabajo que funciona

1. **Diseña en la GUI** con pocos threads: la petición (p. ej. una consulta de catálogo o un alta de pedido de servicio), sus aserciones (status, algún contenido, duración máxima) y los extractores.
2. **Parametriza los datos** con *CSV Data Set Config*: cien usuarios con el mismo cliente y el mismo producto del catálogo prueban la caché, no el sistema.
3. **Correlaciona lo dinámico**: tokens, ids de sesión y valores generados se extraen de las respuestas (JSON/Regex Extractor) y se reutilizan (`${token}`) — es el equivalente al encadenado de peticiones en cualquier API test.
4. **Ejecuta en CLI**, nunca con la GUI:

```bash
jmeter -n -t plan.jmx -l resultados.jtl -e -o informe/
```

`-n` (sin GUI), `-t` (el plan), `-l` (resultados crudos) y `-e -o` generan el **informe HTML** con percentiles, throughput y errores por sampler.

5. **Integra en CI**: el mismo comando corre en una pipeline; el informe se publica como artefacto y los objetivos (p95, errores) se verifican contra el `.jtl`.

## Errores comunes

- **Ejecutar la carga real desde la GUI** con listeners activos: la GUI consume tantos recursos que mides JMeter, no tu sistema.
- **No correlacionar**: reproducir a ciegas peticiones grabadas con tokens caducados produce montañas de 401 que parecen "errores del sistema".
- **Ramp-up irreal**: pasar de 0 a 500 usuarios en un segundo no es una prueba de carga, es un ataque.
- **Generar la carga desde una sola máquina pequeña**: si el generador satura antes que el sistema, JMeter tiene modo distribuido y también puedes repartir por CI.
- **Guardar el `.jmx` fuera del repo**: es XML, se versiona [como cualquier otro código de test](/es/cicd/git-for-qa).

::: tip Idea clave
La GUI de JMeter es la mesa de diseño; la CLI es la máquina de medir. Diseña con pocos threads y listeners, ejecuta con `-n` y lee percentiles en el informe HTML — en ese orden.
:::

## Referencias

- [Manual de usuario de JMeter](https://jmeter.apache.org/usermanual/index.html)
- [JMeter — Best practices](https://jmeter.apache.org/usermanual/best-practices.html)
