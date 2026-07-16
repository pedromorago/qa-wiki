# Python for QA

Python is the QA's Swiss army knife: test data scripts, internal tools, results analysis and, with **pytest** and **requests**, a complete and very readable testing stack. Even if your main suite is Java or TypeScript, Python shows up sooner or later.

## pytest in five minutes

A test is a function that starts with `test_` and uses plain `assert`:

```python
def test_active_status():
    user = create_user(status="active")
    assert user.status == "active"
```

The three pieces worth knowing:

- **Fixtures** — reusable setup and teardown, injected by parameter name:

```python
import pytest

@pytest.fixture
def api_client():
    client = ApiClient(base_url=BASE_URL)
    yield client        # everything after the yield is the teardown
    client.close()

def test_health(api_client):
    assert api_client.get("/health").status_code == 200
```

- **Parametrize** — the same test over several inputs, ideal for [partitions and boundary values](/fundamentals/test-case-design):

```python
@pytest.mark.parametrize("email", ["no-at-sign", "@nodomain", "a@b", ""])
def test_invalid_email_rejected(api_client, email):
    r = api_client.post("/users", json={"email": email})
    assert r.status_code == 400
```

- **Markers** (`@pytest.mark.smoke`) — labeling and filtering execution (`pytest -m smoke`), like tags in other frameworks.

## requests for APIs

```python
import requests

r = requests.post(f"{BASE_URL}/users", json={"name": "Ana"}, timeout=10)
assert r.status_code == 201
assert r.json()["name"] == "Ana"
```

With `pytest + requests + jsonschema` you get the lightweight equivalent of REST Assured: the [anatomy of an API test](/api-testing/anatomy-of-an-api-test) is the same, only the syntax changes.

## What else I use it for

- **Generating test data** (files, bulk payloads, random data with `faker`).
- **Support scripts**: cleaning environments, comparing responses between environments, processing logs or results CSVs.
- **Internal tools**: in my case, the sharding optimization model that later became CI Shard Advisor started as a Python script.

## When to pick Python as the suite's language

| Pick Python if… | Pick Java/TS if… |
|---|---|
| The team already speaks it (data, scripts, Python backend) | The suite lives next to Java/TS product code |
| You prioritize readability and writing speed | You want the product stack's typing and tooling |
| Testing is mostly APIs and data | There's a lot of browser E2E (Playwright TS is first-class) |

::: tip Key idea
Frameworks change, concepts don't: fixtures are setup/teardown, parametrize is data-driven and markers are tags. If you master those ideas in one stack, in Python you're only missing the syntax — and it's the friendliest one to learn.
:::

## References

- [pytest documentation](https://docs.pytest.org/)
- [requests documentation](https://requests.readthedocs.io/)
