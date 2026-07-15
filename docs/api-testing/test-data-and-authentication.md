# Test data and authentication

Tests don't fail only because of bugs: they fail because of data. How to generate robust test data and how to authenticate tests without versioned credentials or "magic" environment users.

## Generating data: random by default, fixed when it matters

The pattern I use (Java + Lombok, but the concept is universal): models with a **builder** where every field has a valid random value by default.

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

- `GenericProductBody.builder().build()` → a complete, valid object with random values.
- For a specific case, **you override only the field that matters**:

```java
// Negative case: empty name. The test declares ONLY what's relevant.
GenericProductBody product = GenericProductBody.builder()
        .name("")
        .build();
```

Three benefits: less boilerplate, the test shows only the data relevant to the case (the rest is noise), and random values avoid collisions between tests and parallel runs.

In TypeScript the same pattern is **typed factories** in a shared data folder (`src/data`), with faker-style libraries for the values.

## Create the data via API, not through the UI or the DB

When a test needs a pre-existing entity (a user, a project), it creates it **by calling the API itself** during setup:

- **Environment independence**: you don't depend on the data dump having exactly that row.
- **Speed and stability**: creating a user through the UI is 20 fragile seconds; via API, 200 ms.
- **Self-description**: the test declares its data; you don't have to go inspect the DB to understand what it depends on.

::: tip The rule I take with me to any project
API to reach the state, UI only for what you're actually testing.
:::

## Authentication: from the credentials CSV to ephemeral users

### The anti-pattern (very common)

Fixed environment users (admin, "user with no permissions"…) with their credentials stored in CSVs versioned in the repo, injected via parameterized tests. Problems:

1. **Dependency on pre-existing data** — the test fails if the environment doesn't have exactly those users.
2. **Security** — credentials in the repository. End of discussion.
3. **Over-permissioning** — if everything is tested with the admin, you never verify the **principle of least privilege**: does the endpoint work with *only* the permission it claims to require?

### The pattern: users created on the fly with exact permissions

Each test class creates its users via API with **exactly** the permissions the case requires, and receives their token:

```java
@BeforeAll
static void beforeAll() {
    // user with just the right permission for the endpoint under test
    userWithPermission = UserUtils.createNewUserAndAssignPermissions("GLOBAL-ORDERS_UPDATE");
    // user with no permissions, for the 403 case
    noPermissionUser = UserUtils.createNewUserAndAssignPermissions();
}
```

Internally the helper runs the full flow via API — create role → assign permissions → assign role to the user → retrieve their token — and returns a user+token object ready to inject into the service object.

The 403 case comes out naturally:

```java
OrdersService ordersService = new OrdersService(noPermissionUser.getToken());
ValidatableResponse response = ordersService.deleteOrder(FeederHelper.generateUuid());

TestCaseReport.assertResponseCodeAndBodySchema("", response, HttpStatus.SC_FORBIDDEN,
        AUTH_SCHEMA_PATH + "/wrong-request.json");
```

### Performance and token nuances

- Creating users costs API calls: users shared across a domain are declared in a **domain base class** (`protected static final`) and created only once, not once per test class.
- Know your API's **token types**: permanent API token vs. temporary bearer that expires (and needs refreshing in long suites!).
- Admin credentials (only for *preparing* data, never for the endpoint under test) live in the environment config or in a secrets manager — never in the code.

## Bonus: a serialization trick

The same model can serve both create and update even if the update doesn't accept some field: annotate the field with `@JsonInclude(NON_NULL)` (Jackson) and set it to `null` in the update case — if it's null, it doesn't travel in the JSON. One model, two uses, zero duplication.
