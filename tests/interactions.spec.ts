import { expect, test } from './coverage-fixture';

test.describe('Dashboard interactions', () => {
  test('updates metrics when a new passing run is added', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Add passing run' }).click();

    await expect(page.getByTestId('metric-tests')).toContainText('7');
    await expect(page.getByTestId('metric-passed')).toContainText('5');
    await expect(page.getByTestId('metric-success-density')).toContainText('71%');
    await expect(page.getByText('generated smoke test 7')).toBeVisible();
  });

  test('marks the failed checkout test as fixed', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Mark checkout fixed' }).click();

    await expect(page.getByTestId('metric-failed')).toContainText('0');
    await expect(page.getByTestId('metric-passed')).toContainText('5');
    await expect(page.getByTestId('metric-success-density')).toContainText('83%');
  });

  test('reset restores the original dataset and filters', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Add passing run' }).click();
    await page.getByLabel('Filter by status').selectOption('passed');
    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(page.getByTestId('metric-tests')).toContainText('6');
    await expect(page.getByTestId('test-run-row')).toHaveCount(6);
    await expect(page.getByLabel('Filter by status')).toHaveValue('all');
  });
});
