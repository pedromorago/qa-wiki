# Reporte de bugs

Un bug bien reportado se arregla a la primera. Un bug mal reportado genera ping-pong de comentarios, se marca como *cannot reproduce* y acaba muriendo en el backlog. Reportar bien es de las habilidades más rentables de un QA.

## Anatomía de un buen bug report

| Campo | Qué debe contener |
|---|---|
| **Título** | Qué falla + dónde + bajo qué condición. Específico y buscable. |
| **Entorno** | App/versión, navegador o dispositivo, entorno (dev/staging/prod), usuario de prueba. |
| **Pasos para reproducir** | Numerados, desde un estado conocido, sin pasos implícitos. |
| **Resultado actual** | Lo que pasa, literal. Con evidencia: captura, vídeo, logs, respuesta de API. |
| **Resultado esperado** | Lo que debería pasar, y **por qué** (requisito, criterio de aceptación, comportamiento previo). |
| **Severidad** | Impacto técnico del fallo. |
| **Prioridad** | Urgencia de negocio para arreglarlo. |

## Título: el 80% del valor

- ❌ "No funciona el login"
- ❌ "Error al entrar"
- ✅ "Login: el botón 'Entrar' queda deshabilitado tras un intento fallido, impidiendo reintentar"

Regla práctica: alguien que solo lea el título debe entender el problema.

## Severidad vs prioridad

Se confunden constantemente y no son lo mismo:

- **Severidad** = impacto técnico. La define QA.
- **Prioridad** = urgencia de negocio. La define producto (con input de QA).

| Ejemplo | Severidad | Prioridad |
|---|---|---|
| El logo aparece pixelado en la home | Baja | Alta (imagen de marca) |
| Crash al exportar un informe que usa 1 usuario al año | Alta | Baja |
| El pago con tarjeta falla para todos los usuarios | Crítica | Crítica |

## Antes de reportar: la checklist

1. **¿Es reproducible?** Reproducirlo al menos dos veces. Si es intermitente, decirlo y anotar la frecuencia.
2. **¿Está ya reportado?** Buscar duplicados.
3. **¿Es realmente un bug?** Contrastar con el requisito o criterio de aceptación. Si no hay requisito claro, quizá lo que hay que abrir es una conversación, no un bug.
4. **¿Puedo acotarlo?** ¿Pasa en todos los navegadores? ¿Con todos los usuarios? ¿Desde cuándo? Cuanto más acotado, más rápido el diagnóstico.
5. **¿Tengo evidencia adjunta?** Captura/vídeo + datos usados + logs o respuesta de API si aplica.

## Ejemplo completo

> **Título**: Contratación: el resumen del pedido no refleja el descuento convergente al añadir una tarifa móvil a un cliente con fibra activa
>
> **Entorno**: staging v2.14.0 · Chrome 138 / macOS · cliente de prueba `qa_test_01`
>
> **Pasos**:
> 1. Con el cliente `qa_test_01`, que tiene fibra 1 Gbps en estado `active`, iniciar la contratación de la tarifa móvil "20 GB" (15 €/mes)
> 2. Avanzar hasta el resumen del pedido, donde debe aplicarse la promoción convergente (−10% en la cuota móvil)
> 3. Observar el desglose de cuotas
>
> **Resultado actual**: cuota móvil = 15 €/mes (el descuento no se aplica). La UI muestra la promoción como "aplicada" ✅ pero el desglose no cambia. La respuesta de `POST /service-orders` devuelve `201` con `"discount": 0`.
>
> **Resultado esperado**: cuota móvil = 13,50 €/mes (−10% sobre 15 €), según el criterio de aceptación de la historia JIRA-1234, que aplica la promoción a cualquier cliente con fibra activa.
>
> **Severidad**: Alta (afecta a facturación) · **Prioridad**: Alta
>
> **Notas**: solo ocurre si la fibra del cliente está en estado `active`; si el pedido de fibra sigue en `provisioning`, la promoción ni se ofrece (comportamiento esperado). En Firefox se reproduce igual.

::: tip Actitud
El bug report no es una acusación, es un regalo: le estás ahorrando al desarrollador todo el trabajo de diagnóstico. Escríbelo para que la persona que lo lea pueda empezar a arreglarlo sin hablar contigo.
:::
