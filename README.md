# Playwright Test Metrics Demo

Small Vite + React + Playwright app that demonstrates how to send Playwright test execution metrics into SonarQube/SonarQube Cloud.

## What this proves

The Playwright config uses `@bdellegrazie/playwright-sonar-reporter` to write SonarQube Generic Test Execution XML to:

```text
reports/sonar-playwright.xml
```

`sonar-project.properties` imports that file with:

```properties
sonar.testExecutionReportPaths=reports/sonar-playwright.xml
```

SonarQube can then display test execution metrics such as test count, failures, errors, skipped tests, execution time, and success density. Code coverage is separate and should be added with an LCOV report if needed.

## Run locally

```bash
npm install
npx playwright install chromium
npm run build
npm run test:e2e
```

After the test run, inspect:

```bash
cat reports/sonar-playwright.xml
```

## Run SonarScanner locally

Install and configure `sonar-scanner`, then run:

```bash
SONAR_TOKEN=<your-token> npm run sonar -- \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.organization=<your-org>
```

## SonarQube Cloud setup

This repository is instrumented for SonarQube Cloud with:

```properties
sonar.projectKey=sonar-solutions_playwright-test
sonar.organization=sonar-solutions
sonar.host.url=https://sonarcloud.io
sonar.testExecutionReportPaths=reports/sonar-playwright.xml
```

Required SonarCloud/GitHub setup:

1. Add or expose a GitHub Actions secret named `SONAR_TOKEN` for this repository.
2. Disable SonarCloud Automatic Analysis for `sonar-solutions_playwright-test`; CI-based analysis is required because the workflow must run Playwright before SonarScanner can import `reports/sonar-playwright.xml`.
3. Push to `main` or run the workflow manually with `workflow_dispatch`.

## CI example

See `.github/workflows/ci.yml`. The workflow runs Playwright first so `reports/sonar-playwright.xml` exists before the SonarQube Cloud scan step.

## Notes

- Playwright HTML reports, traces, screenshots, and videos remain Playwright artifacts; they are not first-class SonarQube metrics.
- Flakiness/retry history is not modeled as a native SonarQube metric from this import path.
- Add JavaScript/TypeScript coverage separately with Istanbul/nyc and `sonar.javascript.lcov.reportPaths=coverage/lcov.info`.
