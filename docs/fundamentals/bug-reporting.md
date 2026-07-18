# Bug reporting

A well-reported bug gets fixed on the first try. A poorly reported bug generates comment ping-pong, gets marked *cannot reproduce*, and ends up dying in the backlog. Reporting well is one of the most profitable skills a QA can have.

## Anatomy of a good bug report

| Field | What it should contain |
|---|---|
| **Title** | What fails + where + under what condition. Specific and searchable. |
| **Environment** | App/version, browser or device, environment (dev/staging/prod), test user. |
| **Steps to reproduce** | Numbered, starting from a known state, with no implicit steps. |
| **Actual result** | What happens, literally. With evidence: screenshot, video, logs, API response. |
| **Expected result** | What should happen, and **why** (requirement, acceptance criterion, previous behavior). |
| **Severity** | Technical impact of the failure. |
| **Priority** | Business urgency to fix it. |

## The title: 80% of the value

- ❌ "Login doesn't work"
- ❌ "Error when signing in"
- ✅ "Login: the 'Sign in' button stays disabled after a failed attempt, preventing retries"

Practical rule: someone reading only the title should understand the problem.

## Severity vs priority

They get mixed up constantly and they're not the same thing:

- **Severity** = technical impact. Defined by QA.
- **Priority** = business urgency. Defined by product (with input from QA).

| Example | Severity | Priority |
|---|---|---|
| The logo looks pixelated on the home page | Low | High (brand image) |
| Crash when exporting a report used by 1 user a year | High | Low |
| Card payments fail for all users | Critical | Critical |

## Before reporting: the checklist

1. **Is it reproducible?** Reproduce it at least twice. If it's intermittent, say so and note the frequency.
2. **Is it already reported?** Search for duplicates.
3. **Is it really a bug?** Check against the requirement or acceptance criterion. If there's no clear requirement, maybe what you need to open is a conversation, not a bug.
4. **Can I narrow it down?** Does it happen in every browser? With every user? Since when? The narrower the scope, the faster the diagnosis.
5. **Do I have evidence attached?** Screenshot/video + the data used + logs or API response if applicable.

## Full example

> **Title**: Ordering: the order summary doesn't reflect the convergence discount when adding a mobile tariff for a customer with active fiber
>
> **Environment**: staging v2.14.0 · Chrome 138 / macOS · test customer `qa_test_01`
>
> **Steps**:
> 1. With customer `qa_test_01`, who has 1 Gbps fiber in `active` state, start contracting the "20 GB" mobile tariff (€15/month)
> 2. Proceed to the order summary, where the convergence promotion should be applied (−10% on the mobile fee)
> 3. Observe the fee breakdown
>
> **Actual result**: mobile fee = €15/month (the discount isn't applied). The UI shows the promotion as "applied" ✅ but the breakdown doesn't change. The response from `POST /service-orders` returns `201` with `"discount": 0`.
>
> **Expected result**: mobile fee = €13.50/month (−10% off €15), per the acceptance criterion of story JIRA-1234, which applies the promotion to any customer with active fiber.
>
> **Severity**: High (affects billing) · **Priority**: High
>
> **Notes**: only happens if the customer's fiber is in `active` state; if the fiber order is still in `provisioning`, the promotion isn't even offered (expected behavior). Reproduces the same way in Firefox.

::: tip Attitude
A bug report is not an accusation, it's a gift: you're saving the developer all the diagnostic work. Write it so the person reading it can start fixing it without talking to you.
:::
