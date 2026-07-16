# The E2E tools landscape

Selenium, Cypress, WebDriverIO, Playwright… the names change faster than the ideas. Understanding **how each family works inside** is worth more than memorizing APIs: the architecture explains their strengths, their limitations and which one fits each project.

## The three architectures

- **WebDriver protocol** (Selenium, WebDriverIO): commands travel over HTTP to a driver that controls the browser. It's a **W3C standard**: maximum browser and language compatibility, in exchange for more latency and manual waits.
- **Inside the browser** (Cypress): the test runs next to the application, in the browser itself. Excellent feedback and debugging, but structural limitations (multi-tab, multiple origins, supported browsers).
- **Native browser protocols** (Playwright, via CDP and equivalents): direct, bidirectional control of the browser from outside. Auto-waiting, cheap isolated contexts and easy parallelization.

## Quick comparison

| | Selenium | WebDriverIO | Cypress | Playwright |
|---|---|---|---|---|
| Architecture | WebDriver | WebDriver (and BiDi/CDP) | In-browser | CDP/native |
| Languages | Java, Python, JS, C#… | JavaScript/TypeScript | JavaScript/TypeScript | TS/JS, Java, Python, .NET |
| Waits | Explicit (on you) | Mixed | Automatic | Automatic |
| Strong point | Standard, legacy, grids | Services ecosystem and config | DX and debugging | Speed, stability, parallel |

## Selenium: the minimum you need to know

It's still the industry standard and what shows up most in projects with history:

- **WebDriver** is the central object: `driver.findElement(By.cssSelector(...))`, `click()`, `sendKeys()`.
- **Waits are your responsibility.** The number one cause of flakiness in Selenium is `sleep` and implicit waits: the right tool is `WebDriverWait` with explicit conditions (element visible, clickable…).
- **Selenium Grid** distributes execution across machines and browsers; it's the conceptual ancestor of [modern sharding](/cicd/parallelization-and-sharding).
- The [Page Object Model](/automation/page-object-model) was born in this ecosystem and applies the same way.

## WebDriverIO in two lines

A JavaScript framework on top of the WebDriver protocol (today also BiDi/CDP), with a very mature configuration and *services* system. A middle ground between the Selenium standard and the modern experience: common in JS teams with broad compatibility needs or Appium (mobile).

## How to choose

- **New project, TS/JS team, heavy CI** → Playwright (my default choice; [first steps](/automation/playwright-first-steps)).
- **Existing suite or compatibility/language requirements** → Selenium or WebDriverIO; you don't migrate for fashion, [you migrate with numbers](/automation/migrating-from-testcafe-to-playwright).
- **A team that values visual debugging above all** → Cypress remains a great experience.

::: tip Key idea
Selectors, POM, waits and test design travel with you from one tool to the next. Learn one well and understand the architecture of the others: that's what doesn't expire.
:::

## References

- [Selenium documentation](https://www.selenium.dev/documentation/)
- [WebDriverIO documentation](https://webdriver.io/docs/gettingstarted)
- [Playwright documentation](https://playwright.dev/) · [Cypress documentation](https://docs.cypress.io/)
