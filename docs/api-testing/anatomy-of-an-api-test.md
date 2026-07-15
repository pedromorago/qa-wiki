# Anatomy of an API test

How I write an automated API test, from the name to the assertions. Examples in Java + JUnit 5 + REST Assured, but the structure is stack-agnostic.

## The name tells the story

**Given-When-Then** convention in the method name + a natural-language description in `@DisplayName`:

```java
@DisplayName("Create Product - valid. Product with all fields filled.")
@Test
void givenValidUser_WhenCreateProductWithAllFields_ThenCreateSuccess() {
```

`givenNoPermissionUser_WhenDeleteOrder_ThenOperationForbidden` reads like the case's specification. Long, descriptive names in tests are a *feature*: nobody types them (the runner executes them) and everybody reads them (on every failure).

## A body in three blocks

```java
@Test
void givenValidUser_WhenCreateProductWithAllFields_ThenCreateSuccess() {
    // given - prepare the data
    ProductsService productsService = new ProductsService(productUser.getToken());
    JSONObject productData = ProductsService.fillProductWithAllFields();
    String name = productData.getString("name");

    // when - make the request
    ValidatableResponse response = productsService.createProduct(productData);

    // then - validate the response
    TestCaseReport.assertResponseCodeAndBodySchema("Status and schema", response,
            HttpStatus.SC_OK, PRODUCTS_SCHEMA_PATH + "/create-product.json");
    TestCaseReport.assertPropertyIsNotNull("", response, "id");
    TestCaseReport.assertBodyContainsProperty("", response, "name", name);
}
```

Rules I follow:

- **All** validations live in the *then* block.
- Status codes via constants (`HttpStatus.SC_OK`), never magic numbers.
- The test talks to **service objects**, never builds URLs or requests by hand ([here's why](/api-testing/api-framework-architecture)).

## The per-endpoint case matrix

Cases are derived from the **specification** (contract first), not from the code. For each new endpoint, this is my minimum checklist:

| Case | What's being tested |
|---|---|
| **200/201 happy path** | The correct operation with a user holding **just the right permissions** (not an admin). For listings: combinations of `page`, `size`, filters, and `sort`. |
| **400 Bad Request** | Parameter with an invalid format; body missing required fields. |
| **401 Unauthorized** | Invalid or missing token. |
| **403 Forbidden** | A user created on purpose **without** the required permission. |
| **404 Not Found** | Nonexistent ID… and the important nuance: an ID that **exists but belongs to another user**. |

::: tip 403 vs 404: a security decision
If a user requests an object they have no access to, many APIs deliberately respond `404` instead of `403`: a `403` would confirm the object exists. You need to know your API's policy and test it — this is object-level authorization, the classic bug ([IDOR](/glossary)). 
:::

## What I validate in every response

My mandatory minimum for any response:

1. **Status code**
2. **JSON Schema** of the body ([its own article](/api-testing/json-schema-validation))
3. **Main attributes** of the body
4. Headers and parameters, where applicable

For error messages, a pattern that avoids brittle tests: the API defines standardized messages with placeholders (`Property [%s] with value [%s] is invalid`), and the framework mirrors them in a **reusable enum** instead of repeating strings all over the code. If the message wording changes, you change it in one place.

```java
String expected = String.format(AssertionErrors.PROPERTY_WITH_VALUE.message, "name", "");
TestCaseReport.assertBodyContainsValue("", response, expected);
```

## Traceability with the test case manager

Every automated test has its entry in the test case manager (Qase, TestRail, Xray…), linked from the code with an annotation:

```java
@QaseId(1234)
@DisplayName("Products - BE - Create - valid. All fields filled.")
@Test
void givenValidUser_WhenCreateProduct_ThenCreateSuccess() { ... }
```

The tedious part (creating the case in the manager and copying the ID into the code) can be automated: a script walks the tests with a placeholder ID, creates the cases via the manager's API using the `@DisplayName` as the title, and rewrites the placeholders with the real IDs. **The annotation works as a bidirectional traceability contract** between code and manager.

## Classic REST Assured gotcha

If you reuse the same service object instance for two calls (a GET with query params followed by a POST with a body), you can get hit with:

```
java.lang.IllegalStateException: You can either send form parameters OR body content in POST, not both!
```

The `RequestSpecification` **retains query params between requests**. Solution: clear the parameters between calls (via `FilterableRequestSpecification#removeParam`) or build a fresh specification per request. General lesson: if you share state between requests, manage it explicitly.
