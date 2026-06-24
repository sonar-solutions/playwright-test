import { expect, test } from '@playwright/test';

test.describe('Playwright metrics dashboard', () => {
  test('renders the metrics summary cards', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Playwright test metrics demo' })).toBeVisible();
    await expect(page.getByTestId('metric-tests')).toContainText('3');
    await expect(page.getByTestId('metric-passed')).toContainText('2');
    await expect(page.getByTestId('metric-skipped')).toContainText('1');
    await expect(page.getByTestId('metric-success-density')).toContainText('67%');
  });

  test('filters the visible test run list by status', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Filter by status').selectOption('skipped');

    await expect(page.getByTestId('test-run-row')).toHaveCount(1);
    await expect(page.getByText('legacy browser payment test')).toBeVisible();
  });

  test('updates metrics when a new passing run is added', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Add passing run' }).click();

    await expect(page.getByTestId('metric-tests')).toContainText('4');
    await expect(page.getByTestId('metric-passed')).toContainText('3');
    await expect(page.getByTestId('metric-success-density')).toContainText('75%');
  });

  test.skip('demonstrates a skipped test in SonarQube test execution metrics', async () => {
    // This intentional skip is imported by SonarQube as a skipped test case.
  });
});
