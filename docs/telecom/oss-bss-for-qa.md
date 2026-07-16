# OSS/BSS for QA

Telecom operators run on two families of systems: **BSS** (Business Support Systems), the business-facing side, and **OSS** (Operations Support Systems), the network-facing side. Testing software in this domain means testing long chains of systems that talk to each other — and that changes how you approach the job.

## The map: BSS and OSS

| | BSS (business) | OSS (operations) |
|---|---|---|
| Deals with | Customers, products, money | Network, services, resources |
| Typical systems | CRM, product catalog, order capture, billing | Network and service inventory, provisioning, activation, orchestration, service assurance |
| Question it answers | What does the customer buy and how much do they pay? | How is that service delivered and kept alive on the network? |

## The flow that crosses everything: order to activation

The domain's central process is *order-to-activation*: a customer buys something and the service ends up working on the network. Simplified:

1. The **catalog** defines the product (say, 1 Gbps fiber).
2. **Order capture** (BSS) creates the customer order.
3. The order is **decomposed**: from commercial product into technical services and resources.
4. **Orchestration and provisioning** (OSS) configure the network.
5. The **inventory** records what was deployed.
6. **Activation**: the service works. From there on, *assurance* (keeping it working) and *billing* (charging for it).

For a QA the consequence is direct: real E2E flows **cross half a dozen systems**, many steps are **asynchronous** (order states change over time), and data must end up **consistent across several inventories at once**.

## TM Forum: the industry standard

[TM Forum](https://www.tmforum.org/) is the association that standardizes how these systems are built. What matters most to a QA:

- **Open APIs** — a set of standardized REST APIs for the domain's typical operations, each with its specification and schema. Well-known examples: product catalog management (TMF620), product ordering (TMF622) or service ordering (TMF641). There is a **conformance certification** program for these APIs.
- **ODA (Open Digital Architecture)** — the modern reference architecture: systems built as components with defined responsibilities that communicate through Open APIs.
- **eTOM and SID** — the sector's shared business-process map and information model. They work as a common vocabulary.

## What testing means here

The interesting part: almost everything a product QA already knows applies, with different accents.

- **Conformance to the specification.** If the product implements Open APIs, the TM Forum spec is the contract: [JSON Schema validation](/api-testing/json-schema-validation) goes from good practice to requirement.
- **Long, asynchronous E2E flows.** An order takes time to walk through its states: [active waiting with Awaitility](/api-testing/async-apis-with-awaitility) (or its equivalent in each stack) becomes daily bread.
- **Data consistency across systems.** What the order says, what the inventory says and what the network says must match: [SQL](/api-testing/sql-for-qa) (and [NoSQL](/api-testing/nosql-for-qa)) to verify it.
- **Complex environments and data.** Reproducing a realistic network topology is expensive; test data design and the [per-environment strategy](/cicd/environment-validations) weigh more than in a typical SaaS.

## Minimal vocabulary

| Term | What it is |
|---|---|
| Provisioning / activation | Configuring the network to deliver a service and switching it on |
| Service assurance | Monitoring and diagnosing the service in production (alarms, incidents) |
| Inventory | The record of which resources and services exist and how they connect |
| Mediation / rating / CDR | The chain that turns network usage (calls, data) into billable amounts |
| Orchestration | Coordinating provisioning steps across systems and technologies |

::: tip Key idea
In OSS/BSS the system under test is almost never *one* application: it's a chain. A QA's value lies in thinking in full flows, asynchronous waits and cross-system data consistency — exactly the muscles this wiki's API testing and strategy sections train.
:::

## References

- [TM Forum — Open APIs](https://www.tmforum.org/oda/open-apis/)
- [TM Forum — Open Digital Architecture (ODA)](https://www.tmforum.org/oda/)
