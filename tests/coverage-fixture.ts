import { expect, test as base } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const test = base.extend<{ collectCoverage: void }>({
  collectCoverage: [async ({ page }, use, testInfo) => {
    await use();

    if (process.env.E2E_COVERAGE !== 'true') {
      return;
    }

    const coverage = await page.evaluate(() => {
      return (window as typeof window & { __coverage__?: unknown }).__coverage__;
    }).catch(() => undefined);

    if (!coverage) {
      return;
    }

    const outputDir = path.join(process.cwd(), '.nyc_output');
    await mkdir(outputDir, { recursive: true });

    const safeName = `${testInfo.project.name}-${testInfo.titlePath.join('-')}`
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 180) || 'coverage';

    await writeFile(
      path.join(outputDir, `${safeName}-${testInfo.retry}.json`),
      JSON.stringify(coverage),
      'utf8'
    );
  }, { auto: true }]
});

export { expect };
