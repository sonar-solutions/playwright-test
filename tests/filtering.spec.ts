import { expect, test } from './coverage-fixture';

test.describe('Run filtering', () => {
  test('filters the visible test run list by failed status', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Filter by status').selectOption('failed');

    await expect(page.getByTestId('test-run-row')).toHaveCount(1);
    await expect(page.getByText('empty cart blocks payment')).toBeVisible();
  });

  test('filters the visible test run list by skipped status', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Filter by status').selectOption('skipped');

    await expect(page.getByTestId('test-run-row')).toHaveCount(1);
    await expect(page.getByText('legacy browser payment test')).toBeVisible();
  });

  test('filters the visible test run list by area', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Filter by area').selectOption('Authentication');

    await expect(page.getByTestId('test-run-row')).toHaveCount(2);
    await expect(page.getByText('login page loads')).toBeVisible();
    await expect(page.getByText('SSO redirects users')).toBeVisible();
  });

  test('combines area and status filters', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Filter by area').selectOption('Checkout');
    await page.getByLabel('Filter by status').selectOption('failed');

    await expect(page.getByTestId('test-run-row')).toHaveCount(1);
    await expect(page.getByText('empty cart blocks payment')).toBeVisible();
  });
});
