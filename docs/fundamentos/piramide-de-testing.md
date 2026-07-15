# La pirámide de testing

La pirámide de testing es un modelo para decidir **cómo repartir el esfuerzo de automatización** entre los distintos niveles de prueba. La idea: muchos tests baratos y rápidos en la base, pocos tests caros y lentos en la cima.

```
        ▲
       ╱ ╲        E2E / UI  (pocos, lentos, frágiles, muy realistas)
      ╱───╲
     ╱     ╲      Integración / API  (equilibrio coste-confianza)
    ╱───────╲
   ╱         ╲    Unitarios  (muchos, rápidos, estables, muy localizados)
  ╱───────────╲
```

## Por qué tiene esta forma

| Nivel | Velocidad | Coste de mantener | Precisión al fallar | Realismo |
|---|---|---|---|---|
| Unitario | ⚡ milisegundos | Bajo | Muy alta (señala la función exacta) | Bajo |
| Integración/API | 🚶 segundos | Medio | Alta | Medio |
| E2E/UI | 🐢 minutos | Alto | Baja (¿falló el test o el entorno?) | Alto |

Un test E2E que falla te dice "algo va mal en el flujo de compra". Un test unitario que falla te dice "la función `calcularDescuento` devuelve mal el IVA". Cuanto más abajo detectes el problema, más barato es diagnosticarlo.

## El antipatrón: el cono de helado 🍦

La pirámide invertida: montones de tests E2E manuales o automatizados, casi nada de tests unitarios. Es el patrón típico de equipos donde QA automatiza "desde fuera" sin colaborar con desarrollo. Consecuencias:

- Suites que tardan horas y fallan de forma intermitente (*flaky tests*).
- Nadie confía en los resultados → se re-ejecuta hasta que pasa → la suite pierde todo su valor.
- El feedback llega tarde, cuando el código ya está integrado.

## Cómo lo aplico como QA

- **No todo lo que pruebo desde la UI debe automatizarse en la UI.** Si la lógica se puede verificar por API, el test va a la capa de API.
- Antes de escribir un E2E preguntarse: ¿qué me da este test que no me dé ya un test de capa inferior? Si la respuesta es "nada", sobra.
- Los E2E se reservan para los **flujos críticos de negocio** (happy paths): registro, login, compra, pago.
- El testing exploratorio manual no aparece en la pirámide, pero complementa todos los niveles: los tests automatizados verifican lo conocido; la exploración descubre lo desconocido.

::: tip Regla mental rápida
Automatiza en el nivel **más bajo posible** donde el comportamiento se pueda verificar con confianza.
:::
