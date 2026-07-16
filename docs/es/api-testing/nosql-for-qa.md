# NoSQL para QA

Si ya sabes [SQL](/es/api-testing/sql-for-qa), el salto a NoSQL no es aprender otro lenguaje: es aprender **qué garantías desaparecen** y qué hay que validar por ello. Uso MongoDB como ejemplo por ser la base documental más extendida.

## Qué cambia respecto a lo relacional

| | Relacional (SQL) | Documental (MongoDB) |
|---|---|---|
| Unidad de datos | Fila en una tabla | Documento JSON en una colección |
| Esquema | Fijo, lo impone la base de datos | Flexible: cada documento puede tener campos distintos |
| Relaciones | JOINs entre tablas | Documentos anidados o referencias (sin JOIN clásico) |
| Consistencia | Fuerte por defecto | Depende de la configuración; a menudo **eventual** |

Las dos últimas filas son las que cambian el trabajo del QA.

## Las consultas del día a día

Equivalencias directas con lo que ya haces en SQL:

| En SQL | En MongoDB |
|---|---|
| `SELECT * FROM users WHERE email = '…'` | `db.users.find({ email: '…' })` |
| `SELECT status FROM orders WHERE id = …` | `db.orders.find({ _id: … }, { status: 1 })` |
| `SELECT COUNT(*) …` | `db.orders.countDocuments({ status: 'pending' })` |
| `GROUP BY … HAVING COUNT(*) > 1` | `db.users.aggregate([{ $group: { _id: '$email', n: { $sum: 1 } } }, { $match: { n: { $gt: 1 } } }])` |

```js
// ¿Se persistió el pedido con la estructura esperada?
db.orders.find({ orderId: 'ORD-10442' })

// Duplicados que la validación debería impedir
db.users.aggregate([
  { $group: { _id: '$email', n: { $sum: 1 } } },
  { $match: { n: { $gt: 1 } } }
])
```

## Lo que hay que validar (precisamente porque no hay esquema)

- **El esquema implícito.** La base de datos acepta cualquier documento, así que un campo mal escrito (`satus` en vez de `status`) **no falla al escribir: falla al leer**, en otro sistema, semanas después. Verificar la estructura de los documentos persistidos es tarea del test, no de la base de datos.
- **Campos ausentes vs. campos null.** En Mongo son cosas distintas (`{ campo: null }` existe; un documento sin el campo, no). Las queries `{ campo: null }` encuentran **ambos** — elige aserciones con intención (`$exists`).
- **Consistencia eventual.** En arquitecturas distribuidas, lo que acabas de escribir puede tardar en ser visible. Un `find` inmediato que no encuentra el documento no siempre es un bug: se valida con [espera activa](/es/api-testing/async-apis-with-awaitility), no con `sleep`.

## El resto del mapa NoSQL, en una línea cada uno

- **Clave-valor (Redis)** — cachés y sesiones; en tests, la causa habitual de "lo borré de la base de datos pero lo sigo viendo".
- **Columnar (Cassandra)** — series y volúmenes enormes, consistencia configurable por consulta.
- **Grafos (Neo4j)** — relaciones como dato principal; útil saber que existen.

## Errores comunes

- **Validar con `findOne` a secas** y dar por bueno el primer documento que aparezca: filtra con la clave completa del dato que creaste.
- **Asumir consistencia inmediata** en sistemas distribuidos: esperas activas, no lecturas instantáneas.
- **Ignorar los documentos "viejos".** Sin migraciones de esquema forzosas, conviven versiones de documento distintas en la misma colección; los tests deben contar con ello.

::: tip Idea clave
En SQL la base de datos defiende el esquema por ti; en NoSQL el esquema es una promesa del código. Y las promesas del código son exactamente lo que un QA se dedica a verificar.
:::

## Referencias

- [Manual de MongoDB — CRUD](https://www.mongodb.com/docs/manual/crud/)
- [Manual de MongoDB — Agregaciones](https://www.mongodb.com/docs/manual/aggregation/)
