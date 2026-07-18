# Testing APIs from the editor: REST Client

[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) is a VS Code extension for sending HTTP requests from plain text files. For exploratory API work it has earned its place next to Postman for three reasons:

- **The `.http` files live in the repository**: they get versioned, reviewed in PRs, and work as **executable documentation** of the API for the whole team.
- **Zero context switching**: you test the endpoint in the same window where you write the code or the test.
- Plain, diffable text — no proprietary collections, no cloud account.

## Mechanics

1. Create a `.http` (or `.rest`) file.
2. Write the request: method + URL, headers below, and — the detail everyone forgets — **a blank line between headers and body**.
3. Click the **"Send Request"** link that appears above the request; the response opens in a side panel.
4. A single file can hold as many requests as you want, **separated by `###`**.

## Variables and request chaining

**File variables** — declared with `@name = value` (strings without quotes) and used by wrapping the name in double curly braces, as shown in the example below. The foundation for handling environments: change `@baseUrl` and the whole file points somewhere else.

**Request variables** — the gem: you name a request with `# @name` and extract data from its response with JSONPath. It's the typical authentication flow: a POST returns the JWT and subsequent requests use it as a bearer.

```http
@baseUrl = http://localhost:8080/api/v1
@contentType = application/json

### Create a countermeasure library
POST {{baseUrl}}/libraries
Content-Type: {{contentType}}

{
  "name": "Custom countermeasures",
  "description": "Countermeasure library created from REST Client"
}

### Authenticate and capture the token
# @name authRequest
POST {{baseUrl}}/auth/token
Content-Type: {{contentType}}

{
  "username": "test-user",
  "password": "{{password}}"
}

### Use the token on a protected route
@accessToken = {{authRequest.response.body.$.accessToken}}

GET {{baseUrl}}/security-classifications
Authorization: Bearer {{accessToken}}
```

The general extraction syntax:

```
{{requestName.(response|request).(body|headers).(JSONPath|HeaderName)}}
```

## Where it fits (and where it doesn't)

| Need | Tool |
|---|---|
| Exploring an endpoint while developing/testing | **REST Client** |
| Sharing API usage examples with the team | **REST Client** (versioned in the repo) |
| Automated API regression in CI | Test framework ([REST Assured](/api-testing/api-framework-architecture), pytest, Vitest…) |
| Complex collections with scripting and monitors | Postman |

My actual usage: the `.http` files are the **lab notebook** — I reproduce the bug, fine-tune the request, and that file ends up pasted into the bug report or turned into an automated test.
