# Python para QA

Python es la navaja suiza del QA: scripts de datos de prueba, herramientas internas, análisis de resultados y, con **pytest** y **requests**, un stack de testing completo y muy legible. Aunque tu suite principal sea Java o TypeScript, Python aparece antes o después.

## pytest en cinco minutos

Un test es una función que empieza por `test_` y usa `assert` a secas:

```python
def test_pedido_activo():
    pedido = crear_pedido_de_servicio(status="active")
    assert pedido.status == "active"
```

Las tres piezas que hay que conocer:

- **Fixtures** — setup y teardown reutilizables, se inyectan por nombre de parámetro:

```python
import pytest

@pytest.fixture
def api_client():
    client = ApiClient(base_url=BASE_URL)
    yield client        # lo que hay tras el yield es el teardown
    client.close()

def test_health(api_client):
    assert api_client.get("/health").status_code == 200
```

- **Parametrize** — el mismo test con varios datos, ideal para [particiones y valores límite](/es/fundamentals/test-case-design):

```python
@pytest.mark.parametrize("msisdn", ["12345", "abcdefghi", "+34-600", ""])
def test_msisdn_invalido_rechazado(api_client, msisdn):
    r = api_client.post("/service-orders", json={"productId": "mobile-20gb", "msisdn": msisdn})
    assert r.status_code == 400
```

- **Markers** (`@pytest.mark.smoke`) — etiquetar y filtrar la ejecución (`pytest -m smoke`), como los tags en otros frameworks.

## requests para APIs

```python
import requests

pedido = {"customerId": "C-100", "productId": "fiber-1gbps"}
r = requests.post(f"{BASE_URL}/service-orders", json=pedido, timeout=10)
assert r.status_code == 201
assert r.json()["status"] == "created"
```

Con `pytest + requests + jsonschema` tienes el equivalente ligero de REST Assured: la [anatomía del test de API](/es/api-testing/anatomy-of-an-api-test) es la misma, cambia la sintaxis.

## Para qué más lo uso

- **Generar datos de prueba** (ficheros, payloads masivos, datos aleatorios con `faker`).
- **Scripts de apoyo**: limpiar entornos, comparar respuestas entre entornos, procesar logs o CSV de resultados.
- **Herramientas internas**: en mi caso, el modelo de optimización de sharding que luego se convirtió en CI Shard Advisor nació como script de Python.

## Cuándo elegir Python como lenguaje de la suite

| Elige Python si… | Elige Java/TS si… |
|---|---|
| El equipo ya lo habla (datos, scripts, backend Python) | La suite convive con el código de producto en Java/TS |
| Priorizas legibilidad y velocidad de escritura | Quieres el tipado y las herramientas del stack del producto |
| El testing es sobre todo de APIs y datos | Hay mucho E2E de navegador (Playwright TS es primera clase) |

::: tip Idea clave
El framework cambia, los conceptos no: fixtures son setup/teardown, parametrize es data-driven y los markers son tags. Si dominas esas ideas en un stack, en Python solo te falta la sintaxis — y es la más amable de aprender.
:::

## Referencias

- [Documentación de pytest](https://docs.pytest.org/)
- [Documentación de requests](https://requests.readthedocs.io/)
