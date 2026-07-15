# Cuándo automatizar (y cuándo no)

Automatizar no es gratis: cada test automatizado es código que hay que escribir, mantener, y en el que hay que confiar. La pregunta correcta no es "¿puedo automatizar esto?" sino "¿me compensa?".

## Buenos candidatos

- **Regresión**: pruebas que se repiten en cada release. El caso de uso número uno.
- **Flujos críticos de negocio**: login, registro, compra, pago. Lo que no puede romperse jamás.
- **Datos repetitivos**: el mismo flujo con 50 combinaciones de datos (data-driven testing).
- **Smoke tests**: la batería mínima que corre en cada despliegue.
- **Lo tedioso y propenso a error humano**: cálculos, comparaciones masivas, preparación de datos.
- **Lo imposible manualmente**: carga, rendimiento, concurrencia.

## Malos candidatos

- **Funcionalidad inestable o en pleno cambio**: automatizar sobre arena movediza = reescribir tests cada sprint.
- **Pruebas que se ejecutarán una sola vez**: el coste no se amortiza.
- **Usabilidad, diseño visual "a ojo", experiencia de usuario**: requieren juicio humano.
- **Testing exploratorio**: por definición no se puede guionizar.
- **Flujos con dependencias externas incontrolables** (terceros sin entorno de test): mejor un contrato/mock, o dejarlo en manual.

## El cálculo mental del retorno

```
Coste manual   =  (tiempo de ejecutar a mano) × (veces que se ejecutará)
Coste auto     =  (tiempo de desarrollarlo) + (mantenimiento) × (vida del test)
```

Si el flujo se prueba en cada release, dos releases al mes, y a mano son 15 minutos… en un año son 6 horas. Si automatizarlo cuesta 3 horas y es estable, compensa de sobra. Si el flujo cambia cada mes y hay que retocar el test cada vez, probablemente no.

## Señales de que una suite automatizada va mal

- **Tests flaky** (pasan o fallan aleatoriamente): son peores que no tener tests, porque destruyen la confianza en toda la suite. Un test flaky se arregla o se elimina, nunca se ignora.
- Nadie mira los resultados; los fallos se re-lanzan "a ver si pasa".
- La suite tarda tanto que se ejecuta "de vez en cuando" en lugar de en cada cambio.
- Los tests verifican detalles de implementación (selectores frágiles, textos exactos) en vez de comportamiento.

## La automatización no sustituye al QA

Los tests automatizados **verifican lo que ya sabemos** que debe funcionar; son una red de seguridad contra regresiones. Encontrar bugs nuevos sigue siendo trabajo de diseño de pruebas y exploración. La automatización te compra el *tiempo* para hacer ese trabajo — esa es su verdadera rentabilidad.
