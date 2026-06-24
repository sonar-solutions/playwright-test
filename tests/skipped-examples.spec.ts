import { test } from '@playwright/test';

test.describe('Intentional skipped examples for SonarQube import', () => {
  test.skip('skips a Safari-only payment authorization scenario', async () => {
    // Demonstrates how skipped tests appear in SonarQube Cloud as skipped_tests.
  });

  test.skip('skips a mobile viewport visual-regression scenario', async () => {
    // Demonstrates a second skipped Playwright case in the generic test execution report.
  });
});
