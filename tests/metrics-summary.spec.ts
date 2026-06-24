import { expect, test } from '@playwright/test';

test.describe('Metrics summary cards', () => {
  test('renders the headline and all metric cards', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Playwright test metrics demo' })).toBeVisible();
    await expect(page.getByTestId('metric-tests')).toContainText('6');
    await expect(page.getByTestId('metric-passed')).toContainText('4');
    await expect(page.getByTestId('metric-failed')).toContainText('1');
    await expect(page.getByTestId('metric-skipped')).toContainText('1');
    await expect(page.getByTestId('metric-success-density')).toContainText('67%');
    await expect(page.getByTestId('metric-duration')).toContainText('1370ms');
  });

  test('area health summarizes each product area', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Area health' })).toBeVisible();
    await expect(page.getByTestId('area-health-row')).toHaveCount(4);
    const areaHealth = page.getByLabel('Area health');
    await expect(areaHealth.getByText('Authentication')).toBeVisible();
    await expect(areaHealth.getByText('Checkout')).toBeVisible();
    await expect(areaHealth.getByText('Reporting')).toBeVisible();
    await expect(areaHealth.getByText('Mobile')).toBeVisible();
  });

  test('initial run table includes browser and owner details', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Platform QA')).toBeVisible();
    await expect(page.getByText('firefox')).toBeVisible();
    await expect(page.getByText('webkit')).toHaveCount(2);
  });
});
