# SQL para QA

La interfaz y la API te dicen lo que el sistema **afirma** haber hecho; la base de datos te dice lo que ha hecho **de verdad**. Un QA que sabe consultar la base de datos puede verificar la persistencia, preparar datos de prueba y diagnosticar bugs sin depender de nadie.

## El 20 % de SQL que resuelve el 80 % del trabajo

No hace falta ser DBA. Con esto se cubre casi todo el día a día:

| Necesito… | Patrón SQL |
|---|---|
| Verificar que un registro se creó | `SELECT` con `WHERE` |
| Verificar un cambio de estado | `SELECT status FROM … WHERE id = …` |
| Contar cuántos hay | `COUNT(*)` con `GROUP BY` |
| Detectar duplicados | `GROUP BY … HAVING COUNT(*) > 1` |
| Detectar huérfanos (integridad) | `LEFT JOIN … WHERE hijo.id IS NULL` |
| Encontrar datos para un test | `SELECT … WHERE <criterios> LIMIT 5` |

## Ejemplos sobre un esquema mínimo

Con dos tablas de ejemplo, `users` y `orders` (un usuario tiene muchos pedidos):

```sql
-- ¿Se creó el usuario que registré desde la UI?
SELECT id, email, status, created_at
FROM users
WHERE email = 'test-2026-07@example.com';

-- ¿El pedido pasó a 'shipped' tras el flujo completo?
SELECT status FROM orders WHERE id = 10442;

-- Duplicados que la validación debería impedir
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Pedidos huérfanos: apuntan a un usuario que ya no existe
SELECT o.id
FROM orders o
LEFT JOIN users u ON u.id = o.user_id
WHERE u.id IS NULL;

-- Datos de prueba: usuarios activos con pedidos pendientes
SELECT u.id, u.email
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.status = 'active' AND o.status = 'pending'
LIMIT 5;
```

## La trampa de NULL

`NULL` no es igual a nada, ni siquiera a otro `NULL`. Dos consecuencias que generan falsos verdes:

- `WHERE campo = NULL` no devuelve nada **nunca**: se escribe `WHERE campo IS NULL`.
- `COUNT(columna)` ignora los `NULL`; `COUNT(*)` cuenta todas las filas. Si validas totales, elige con intención.

## Reglas de seguridad en entornos reales

- **Acceso de solo lectura** siempre que sea posible. Un `UPDATE` sin `WHERE` en un entorno compartido es una leyenda de terror clásica por algo.
- **`LIMIT` por defecto** en tablas grandes: una consulta pesada en un entorno compartido puede degradar el rendimiento para todo el equipo.
- **Cuidado con los datos personales**: el resultado de una query con emails o nombres reales no se pega en un ticket ni en un chat. Anonimiza o referencia por id.

## Cómo encaja con la automatización

En tests de API, la aserción más completa valida las dos caras: la **respuesta** (contrato, status, body) y la **persistencia** (lo que quedó en base de datos). También es la herramienta de preparación y limpieza: localizar datos que cumplen condiciones para el test, y verificar el estado inicial antes de ejecutar.

## Errores comunes

- **Validar solo la respuesta.** Un 200 con body correcto no garantiza que se persistiera bien (ni que no se persistiera dos veces).
- **Tests que dependen de datos vivos.** Si la query del test asume "el usuario 42 existe y tiene 3 pedidos", el test se rompe cuando alguien toque esos datos. Crea o localiza tus datos, no los des por supuestos.
- **`SELECT *` en tablas enormes**, por costumbre. Pide las columnas que necesitas.
- **Copiar queries sin entender el JOIN.** Un `INNER JOIN` donde tocaba `LEFT JOIN` oculta exactamente las filas que buscabas (las que no tienen pareja).

::: tip Idea clave
La API te dice lo que el sistema afirma; la base de datos, lo que ha hecho de verdad. Cuando las dos versiones no coinciden, ahí hay un bug — y de los buenos.
:::

## Referencias

- [SQLBolt](https://sqlbolt.com/) — el mejor tutorial interactivo para coger soltura con SELECT y JOINs.
- [Documentación de PostgreSQL — consultas](https://www.postgresql.org/docs/current/queries.html)
