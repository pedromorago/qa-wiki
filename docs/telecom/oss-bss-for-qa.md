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

A mobile line is a good canonical example, simplified but representative: **SIM from the inventory → number-to-SIM (ICCID) association → activation of voice and data on the network → registration in the online charging system (OCS)** so usage can be billed. Each arrow is an integration with a different system, and each one is a test question: what happens if *this* link fails?

For a QA engineer the consequence is direct: real E2E flows **cross half a dozen systems**, many steps are **asynchronous** (order states change over time), and data must end up **consistent across several inventories at once**. The details of the middle of that chain have their own pages: [the catalog and its CFS/RFS model](/telecom/catalog-cfs-rfs), [service orders](/telecom/service-orders-tmf641), [fallouts](/telecom/fallout-management) and [the BPM workflows](/telecom/testing-bpm-workflows) that execute them.

## TM Forum: the industry standard

[TM Forum](https://www.tmforum.org/) is the association that standardizes how these systems are built. What matters most to a QA engineer:

- **Open APIs** — a set of standardized REST APIs for the domain's typical operations, each with its specification and schema. Well-known examples: product catalog management (TMF620), product ordering (TMF622) or service ordering (TMF641). There is a **conformance certification** program for these APIs.
- **ODA (Open Digital Architecture)** — the modern reference architecture: systems built as components with defined responsibilities that communicate through Open APIs.
- **eTOM, the Functional Framework and SID** — three maps that share the same domain structure: **eTOM** describes the *processes* (everything an operator does, from level-1 processes down to activities), the **Functional Framework** (formerly TAM) groups the *functions* software must implement, and **SID** is the *information model*: the entities and their relationships. Product design literally goes from one to the next (which process, which functions, which data), and for a newcomer they work as a shared vocabulary.

## What testing means here

The interesting part: almost everything a product QA engineer already knows applies, with a different emphasis.

- **Conformance to the specification.** If the product implements Open APIs, the TM Forum spec is the contract and its user guide is a test oracle: [JSON Schema validation](/api-testing/json-schema-validation) goes from good practice to requirement.
- **Long, asynchronous E2E flows.** An order takes time to walk through its states: [polling with a timeout](/api-testing/async-apis-with-awaitility) (Awaitility or its equivalent in each stack) becomes your bread and butter.
- **Data consistency across systems.** What the order says, what the inventory says and what the network says must match, and when they disagree, [the inventory wins](/telecom/service-orders-tmf641#where-the-truth-lives-the-inventory). [SQL](/api-testing/sql-for-qa) (and [NoSQL](/api-testing/nosql-for-qa)) help verify it.
- **Complex environments and data.** Reproducing a realistic network topology is expensive, and many integrations can only be mocked: test data design and a [per-environment strategy](/strategy/test-environments-strategy) matter more than in a typical SaaS product.

## Minimal vocabulary

| Term | What it is |
|---|---|
| Provisioning / activation | Configuring the network to deliver a service and switching it on |
| Service assurance | Monitoring and diagnosing the service in production (alarms, incidents) |
| Inventory | The record of which resources and services exist and how they connect |
| Mediation / rating / CDR | The chain that turns network usage (calls, data) into billable amounts |
| Orchestration | Coordinating provisioning steps across systems and technologies |
| CFS / RFS | Customer-facing service (what the customer contracts) / resource-facing service (how the network realizes it). See [the catalog](/telecom/catalog-cfs-rfs). |
| Fallout | A provisioning error handled as part of the order's lifecycle, with actions to retry, continue, cancel or restart. See [fallout management](/telecom/fallout-management). |
| OCS | Online charging system: rates usage in real time (prepaid balances, quotas) |

## Getting your bearings as a newcomer

The best advice I got when I joined a telecom project with no telecom background came from a colleague who'd been through the same: **translate every flow into an everyday example** from the customer's side of an operator you know. Contracting the line, receiving the router, the technician's installation visit. The acronyms stick much faster once they're attached to something you've lived. Go little by little, and keep a glossary close. More on this in [onboarding into a complex domain](/fundamentals/onboarding-into-a-new-domain).

::: tip Key idea
In OSS/BSS the system under test is almost never *one* application: it's a chain. A QA's value lies in thinking in full flows, asynchronous waits and cross-system data consistency — exactly the muscles this wiki's API testing and strategy sections train.
:::

## References

- [TM Forum — Open APIs](https://www.tmforum.org/oda/open-apis/)
- [TM Forum — Open Digital Architecture (ODA)](https://www.tmforum.org/oda/)
