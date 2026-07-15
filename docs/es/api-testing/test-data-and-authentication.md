# Datos de prueba y autenticación

Los tests no fallan solo por bugs: fallan por datos. Cómo generar datos de prueba robustos y cómo autenticar los tests sin credenciales versionadas ni usuarios "mágicos" del entorno.

## Generar datos: aleatorios por defecto, fijos cuando importan

El patrón que uso (Java + Lombok, pero el concepto es universal): modelos con **builder** donde cada campo tiene un valor aleatorio válido por defecto.

```java
@Data
@Builder
public class GenericProductBody {

    @Default
    private String name = FeederHelper.generateRandomValue("Product_", 5);

    @Default
    private String referenceId = FeederHelper.generateRandomValue("Product-", 5);

    @Default
    private String description = FeederHelper.generateRandomValue("Product_", 100);
}
```

- `GenericProductBody.builder().build()` → objeto completo y válido, con valores aleatorios.
- Para un caso concreto, **sobrescribes solo el campo que importa**:

```java
// Caso negativo: nombre vacío. El test declara SOLO lo relevante.
GenericProductBody product = GenericProductBody.builder()
        .name("")
        .build();
```

Tres beneficios: menos boilerplate, el test muestra únicamente los datos relevantes para el caso (el resto es ruido), y los valores aleatorios evitan colisiones entre tests y ejecuciones paralelas.

En TypeScript el mismo patrón son **factories tipadas** en una carpeta de datos común (`src/data`), con librerías tipo faker para los valores.

## Crear los datos vía API, no por UI ni por BD

Cuando un test necesita una entidad previa (un usuario, un proyecto), la crea **llamando a la propia API** en el setup:

- **Independencia del entorno**: no dependes de que el volcado de datos tenga exactamente esa fila.
- **Velocidad y estabilidad**: crear un usuario por UI son 20 segundos frágiles; por API, 200 ms.
- **Autodescripción**: el test declara sus datos; no hay que ir a mirar la BD para entender de qué depende.

::: tip La regla que me llevo a cualquier proyecto
API para llegar al estado, UI solo para lo que estás probando.
:::

## Autenticación: del CSV de credenciales a usuarios efímeros

### El antipatrón (muy común)

Usuarios fijos del entorno (admin, "usuario sin permisos"…) con sus credenciales guardadas en CSVs versionados en el repo, inyectadas con tests parametrizados. Problemas:

1. **Dependencia de datos preexistentes** — el test falla si el entorno no tiene exactamente esos usuarios.
2. **Seguridad** — credenciales en el repositorio. No hay más que hablar.
3. **Sobre-permisos** — si todo se prueba con el admin, nunca verificas el **principio de mínimo privilegio**: ¿funciona el endpoint con *solo* el permiso que dice requerir?

### El patrón: usuarios creados al vuelo con permisos exactos

Cada clase de test crea sus usuarios vía API con **exactamente** los permisos del caso, y recibe su token:

```java
@BeforeAll
static void beforeAll() {
    // usuario con el permiso justo para el endpoint bajo prueba
    userWithPermission = UserUtils.createNewUserAndAssignPermissions("GLOBAL-ORDERS_UPDATE");
    // usuario sin permisos, para el caso 403
    noPermissionUser = UserUtils.createNewUserAndAssignPermissions();
}
```

Internamente el helper hace el flujo completo vía API — crear rol → asignar permisos → asignar rol al usuario → recuperar su token — y devuelve un objeto usuario+token listo para inyectar en el service object.

El caso 403 sale natural:

```java
OrdersService ordersService = new OrdersService(noPermissionUser.getToken());
ValidatableResponse response = ordersService.deleteOrder(FeederHelper.generateUuid());

TestCaseReport.assertResponseCodeAndBodySchema("", response, HttpStatus.SC_FORBIDDEN,
        AUTH_SCHEMA_PATH + "/wrong-request.json");
```

### Matices de rendimiento y tokens

- Crear usuarios cuesta llamadas: los usuarios compartidos por un dominio se declaran en una **clase base del dominio** (`protected static final`) y se crean una sola vez, no una vez por clase de test.
- Conoce los **tipos de token** de tu API: token de API permanente vs bearer temporal que expira (¡y hay que refrescar en suites largas!).
- Las credenciales de administración (solo para *preparar* datos, nunca para el endpoint bajo prueba) viven en la config del entorno o en un gestor de secretos — jamás en el código.

## Bonus: un truco de serialización

El mismo modelo puede servir para crear y actualizar aunque la actualización no admita algún campo: se anota el campo con `@JsonInclude(NON_NULL)` (Jackson) y se pone a `null` en el caso de actualización — si es null, no viaja en el JSON. Un modelo, dos usos, cero duplicación.
