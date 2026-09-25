# Postman and SoapUI

Two tools for testing APIs without building a code framework: **Postman** for the day-to-day with REST, and **SoapUI** when **SOAP** services show up — which in sectors like telecom or banking are still very much alive.

## Postman: more than sending requests

The basics take an afternoon; what makes the difference is using it with discipline:

- **Collections**: requests organized by product or flow — for example, one collection for the `/service-orders` API: create the order, query its status, cancel it — versioned and shared with the team (they export to JSON and can live in the repo).
- **Environments and variables**: the same collection runs against dev, staging or production by switching the environment. Credentials go in variables, never written into the request.
- **Tests** (*post-response scripts* in current Postman): every request can carry JavaScript assertions (`pm.expect(...)`) — status, body fields, timings. A collection without assertions isn't a suite: it's a request launcher.
- **Newman / Postman CLI**: collections run from the command line, which lets you put them in the CI pipeline.

### Postman in a shared team: lessons learned

- **Don't touch the shared collections.** Each QA engineer works on a personal **fork**; only QA modifies the shared ones, and changes go back through a merge. Otherwise someone's quick edit becomes everyone's broken request.
- **An undefined variable travels as a literal.** If a variable isn't defined in any scope, Postman sends the text with the braces as-is. If the API doesn't validate that field, the order is created normally, and the failure only appears much later, when a downstream connector tries to use the value. Before sending, check the variables panel: unresolved ones show no value. (Don't confuse them with variables filled by a pre-request script, which look empty in the environment but resolve at run time.)
- **Globals vs environment variables.** Per-person values (a personal tag for your test data) go in globals; per-environment values (base URLs, credentials) in environments. Mixing them is how a request ends up pointing at the wrong environment.
- **Conventions over personal values.** A collection that builds external IDs from a personal tag variable lets everyone run the same request and still find their own data.
- **Keep the utility requests with the collection**: the smoke `GET`, the lookups you use to verify results, and the callbacks you trigger by hand when a third party isn't integrated. They're as much part of the suite as the tests.

When Postman and when a code framework like REST Assured? Postman shines for exploring APIs, reproducing bugs and shareable smoke tests; for a large suite with logic and code review, an [API testing framework](/api-testing/api-framework-architecture) scales better.

## SOAP in two minutes

SOAP is the protocol that predates REST and remains common in integration systems:

| | REST | SOAP |
|---|---|---|
| Format | JSON (usually) | Always XML, inside an *envelope* |
| Contract | OpenAPI (optional) | **WSDL** (optional in the spec, but almost always present): defines operations, types and XSD validation |
| Operations | HTTP verbs over resources | Named operations (like function calls) |
| Validation | JSON Schema | XSD schemas and XPath |

The WSDL is the big advantage for a QA: it's a **formal, complete contract**. If the response doesn't match the schema, it's a bug — no debate.

## SoapUI: testing against the WSDL

- You import the WSDL — say, that of a provisioning service exposing an `activateService` operation — and SoapUI **generates the requests for each operation** with their XML structure ready to fill in.
- The key assertions: *Schema Compliance* (the response matches the XSD), *XPath Match* (a specific value inside the XML, like the service's status after activation) and *SOAP Fault / Not SOAP Fault* (protocol errors).
- It organizes work into *test suites* and *test cases* that also run from the command line, so it can integrate into CI.
- It handles REST too, although for pure REST Postman is usually more comfortable.

## Common mistakes

- **Requests without assertions.** Eyeballing a 200 isn't testing; write down the expectations.
- **Unversioned collections.** If the collection only lives in someone's account, it's knowledge waiting to be lost; export and commit.
- **Ignoring the WSDL.** In SOAP the contract already exists: testing without validating the schema wastes half the tool.
- **Hardcoded credentials** in exported requests — they end up in the repo, and [Git doesn't forget](/cicd/git-for-qa).

::: tip Key idea
The tool changes, the question doesn't: what is the contract and how do I verify it holds? In REST you have to build the contract (schemas, specs); in SOAP it comes built in with the WSDL — use it.
:::

## References

- [Postman Learning Center](https://learning.postman.com/)
- [SoapUI documentation](https://www.soapui.org/docs/)
