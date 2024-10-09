import { expect, test } from '@playwright/test';

test('home page hero is rendered properly', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.hero h1')).toContainText(`Record, transcribe and publish. It's that simple.`);
	await expect(page.locator('.hero p')).toContainText(`The easiest way to instantly get your ideas, interviews and conversations to Google Docs.`);
	await expect(page.locator('.hero .button')).toContainText(`Get started`);
});
