# Playwright E2E Tests

[![Playwright Tests](https://github.com/ElvinBaxsh/playwright-e2e-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/ElvinBaxsh/playwright-e2e-tests/actions/workflows/playwright.yml)

UI and API test automation with **Playwright** and **TypeScript**.

- **UI tests:** [Sauce Demo](https://www.saucedemo.com), an e-commerce demo store, on Chromium, Firefox and WebKit (Safari engine)
- **API tests:** [Automation Exercise](https://automationexercise.com/api_list) public REST API

The same scenarios are also automated with Cypress: [cypress-e2e-tests](https://github.com/ElvinBaxsh/cypress-e2e-tests).

## What is covered

| Area | Scenarios |
|---|---|
| Login | valid login, locked out user, wrong password, required fields, protected page without login, logout |
| Products | product count, sort by name and price, product details page |
| Cart | add and remove products, cart badge, cart content, cart kept after reload |
| Checkout | full order flow, total = items + tax, required field validation |
| API | product and brand lists, product search, unsupported methods (405), missing parameters (400), unknown user (404) |

**38 test cases** in total, each UI case runs on 3 browsers.

## Approach

- **Page Object Model:** locators and actions live in `pages/`, tests only describe behaviour
- **Custom fixtures:** page objects and a ready logged-in session are injected into tests (`fixtures/test.ts`)
- **Data-driven tests:** validation cases are generated from data tables
- **Stable locators:** `data-test` attributes via `getByTestId`
- **On failure:** screenshot, video and trace are saved for debugging
- **CI:** GitHub Actions runs every browser in parallel on each push, pull request and once a week; HTML reports are kept as build artifacts

## Run locally

```bash
npm install
npx playwright install
npm test              # all tests
npm run test:ui       # UI tests on 3 browsers
npm run test:api      # API tests only
npm run test:headed   # watch the browser
npm run report        # open the HTML report
```

## Tech stack

Playwright · TypeScript · Node.js · GitHub Actions
