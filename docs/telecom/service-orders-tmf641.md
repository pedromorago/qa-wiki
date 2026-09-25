# Service orders (TMF641): lifecycle and what to verify

**TMF641 Service Ordering** is TM Forum's standard API for requesting services: you create a *service order* whose *items* each reference a service specification (usually a [CFS](/telecom/catalog-cfs-rfs)) and an action. Behind that single `POST` an orchestrator decomposes the order, provisions RFS and resources across half a dozen systems, and reports progress over hours or days. Testing it well means knowing three things: **the state machine, how items depend on each other, and where the truth lives**.

## Anatomy of an order

- **The order**: an external ID (yours, so you can find it later), dates (`requestedStartDate`, `requestedCompletionDate`, and the system's `expectedCompletionDate`), related parties, and the items.
- **The items**: each has an **action** and a service with its specification and characteristics, plus relationships to other items (`reliesOn`).
- **What comes back**: the state, **notes** explaining failures, and **milestones** recording what happened along the way.

### Item actions

| Action | What it does | Worth knowing |
|---|---|---|
| `add` | Creates the service | Scarce prerequisites (a feasibility or qualification ID) usually only apply here |
| `modify` | Changes an existing service | **Partial modify**: every item carries its inventory ID, only the item to change says `modify`, and the rest go as `noChange` to protect them |
| `delete` | Ends the service | **It doesn't erase**: the service goes to `terminated` in the inventory and keeps its history, because customers come back. A resource still used by another active RFS is unlinked, not terminated. |
| `noChange` | Leaves the item as it is | Lets you send related items for context without touching them |

Two behaviors that make good tests: a second `modify` on a service **while a process is still running on it** should be rejected, and a `modify` doesn't create RFS missing from the inventory (it skips them).

## The state machine

TMF641 defines the states; your implementation decides the exact transitions. The ones I test against:

| State | Meaning | Test implication |
|---|---|---|
| `acknowledged` | Received. A **scheduled** order (future start date) waits here, with a clock event checking whether it's time. | Future date → waits; past date → rejected; no date → runs now |
| `rejected` | Failed validation (catalog, parameters). **Dead**: you launch a new order, maybe as a `modify` if something got created. | The [rejection checklist](#rejections-a-checklist-of-negative-cases) below |
| `inProgress` | Executing | Milestones should appear as it goes |
| `held` | An execution error **after** validations passed. **Recoverable**: fix and relaunch. | This is where [fallouts](/telecom/fallout-management) live |
| `pending` | Waiting for something (information, a manual step) | |
| `completed` / `failed` / `partial` | Final: all good / all failed / some items completed and others failed | See propagation below |
| `assessingCancellation`, `pendingCancellation`, `cancelled` | The cancellation path | See cancellations below |

**Held vs rejected: the line is whether you passed the validations.** A wrong parameter or a catalog mismatch rejects the order. An IP address ending in `.161` instead of `.160`, discovered while configuring the network, leaves it held: correct it, re-execute, done.

**How states propagate** (in the implementation I worked with, and verified against the source before trusting it):

- If every RFS fails, the CFS fails and the order ends `failed`.
- If at least one RFS completed and the others failed, CFS and order end `partial`.
- Cancelling an RFS from a fallout counts as a failure for this calculation.
- While sibling items are still running, the parent's state is **provisional**.

## Execution order

- **The payload goes top-down** (the CFS with its characteristics), but **an `add` executes bottom-up**: resources first, then RFS, then the CFS, and the order completes last. A service order doesn't complete until its resource orders do. That's why the completion order in the order manager looks "backwards".
- **A `delete` reverses it**: the parent goes first, then the children.
- **Items with no `reliesOn` can start straight away, and there can be more than one.** Reading the relationships in the creation response narrows down which items start first without opening the execution tracking. But the dependency graph comes from the catalog and changes with catalog releases, so use it to narrow down, not to conclude.

## Rejections: a checklist of negative cases

Every one of these is a mandatory negative test:

- The specification doesn't exist in the catalog, or the **version** doesn't.
- A **mandatory characteristic is missing** (minimum cardinality 1), or a mandatory parameter inside an array.
- A value has the **wrong type** (a malformed object or array).
- **Uniqueness is violated** in the inventory (a phone number or SIM identifier already assigned).
- The service **already exists** and an `add` is requested (it should be a `modify`).
- The requested start date is **in the past**.
- A date your implementation **requires even though the spec marks it optional**. Request templates love to leave it out.

**Where to look first: the order's `note` array.** It explains why an order was rejected at creation and why an item failed during execution, before you go digging through logs.

## Cancellations

- **Immediate**: the order is `acknowledged` and nothing has started, so it's cancelled automatically.
- **With reversal**: some steps already completed, so the order goes to `pendingCancellation`, the pending task disappears, and **one reversal task is created per completed step**. (If the technician already installed the router, someone has to go and uninstall it.) Two different test cases; cover both.
- **A completed item never becomes `cancelled`.** The order ends `partial` instead, and the rollbacks happen underneath without showing in the completed items' states.
- **Assessing cancellation.** If a cancellation arrives while someone is resolving a fallout by hand, the order goes to `assessingCancellation` and **every manual fallout action is disabled** until someone decides. Greyed-out buttons aren't a permissions bug. Accept, and the standard cancellation starts and active fallouts close; reject, and the order goes back to held. This is also where the *point of no return* is decided.
- **Cancelling an `add` means undoing its footprint in every system it touched**: authentication (RADIUS), IP address management (IPAM), the workflow engine. Verify each one. For IP networks registered with a regional internet registry: take a snapshot of every network before cancelling, check the deletion milestones, check that the lookups and the registry come back empty, and that the RFS are `terminated`. And the tricky case: a registry contact **shared with another service's networks must survive**. You set it up by completing another order with the same contact first. Cover *all* the networks (IPv4 and IPv6, customer and transfer), not just the two in the example.
- **Leave tasks open on purpose** before cancelling, to verify the cancellation cleans them up.
- Cancellation from the UI and from the API should behave identically. Test both entry points once.

## Where the truth lives: the inventory

The most important lesson of the domain: **the order is not the truth, the inventory is.**

- An order item's characteristics show **what was requested, frozen at that moment**, not the current state of the service. After a `modify`, the original order still shows the old values and a precondition can look satisfied when it isn't.
- The source of truth is the **service inventory** (TMF638, `GET /service/{id}`): the real characteristics, the list of every order that touched the service with its action, and the supporting services (the RFS) to query directly. For resources, the resource inventory (TMF639).
- A real case: a CFS showed a bandwidth of 500 in its creation order, but 1500 in the inventory, because a developer had consumed it with their own `modify` while generating evidence. Running the test on it would have produced a false PASSED. **Verify test preconditions against the inventory right before running.**
- **Closing checks for any order**: milestones and notes; the service in the inventory (active, expected dates, correct characteristics, relationships to its RFS); and the key comparison between what the customer's inventory shows and what ours shows.
- A service stuck in `reserved` with no start date is a half-finished `add`. It isn't valid test data.

## Events: proving the notification arrived

Many flows end with an event sent to the customer's systems. The complete validation checks the whole path:

1. The event was **published** on your own broker (filter the topic by the order ID; milestone events accumulate, so several events per order is normal).
2. The component that forwards events outward (the TMF688 Event Management side) **consumed it, generated a new event ID and transformed the payload**. The ID you saw internally isn't the one the customer receives. Its log tells you which topic it read, which ID it generated and where it published.
3. The event **exists in the customer's event hub**: authenticate and fetch it by topic and event ID.

If step 3 returns the event with the expected content, the whole chain is proven.

## Dates and scheduling

- A `modify` can also **reschedule** orders that are already scheduled.
- A **jeopardy alert** fired by the requested completion date can be an artifact of launching test orders with "today" as the date. That's a test data artifact, not a bug.
- The system may **recalculate the expected completion date** along the critical path, so the value in an event can legitimately differ from the one in the callback that triggered it.
- Compare dates as **instants, not as text**: one system may send UTC while another shows local time.
- In a demo the order completes in seconds. In real life it takes days. The instant version is a simulation.

## The standard as a test oracle

- The **official user guide of each Open API** is a reference oracle. A field that's mandatory in TMF but not enforced by your API is either a bug or an architecture decision; tell the PO and let them decide which.
- **Validating the response schema is contract testing**: if the structure doesn't match, "something was added without telling us". Get the schemas from the published specification, or derive them from a known-good response. See [JSON Schema validation](/api-testing/json-schema-validation).

::: tip Key idea
Three questions for every service-order test: which state should it reach and why, in which order should its items execute, and what does the **inventory** say at the end? The order's own response answers none of them reliably.
:::

## References

- [TM Forum Open APIs](https://www.tmforum.org/oda/open-apis/): TMF641 Service Ordering, TMF638 Service Inventory, TMF639 Resource Inventory, TMF688 Event Management
- [The catalog: offers, CFS, RFS and resources](/telecom/catalog-cfs-rfs)
- [Fallout management](/telecom/fallout-management)
