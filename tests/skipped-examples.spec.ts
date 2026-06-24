import { expect, test } from './coverage-fixture';

test.describe('Intentional skipped examples for SonarQube import', () => {
  test.skip('skips a Safari-only payment authorization scenario', async () => {
    expect(true).toBe(true);
  });

  test.skip('skips a mobile viewport visual-regression scenario', async () => {
    expect(true).toBe(true);
  });
});
