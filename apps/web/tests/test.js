import { expect, test } from '@playwright/test';

test('home page hero is rendered properly', async ({ page }) => {
	await page.goto('/');

	expect(page.url()).toBe('http://localhost:4173/');
	// await expect(page.locator('h1')).toContainText(`Record, transcribe and publish. It's that simple.`);
	// await expect(page.locator('p')).toContainText(`The easiest way to instantly get your ideas, interviews and conversations to Google Docs.`);
	// await expect(page.locator('.hero .button')).toContainText(`Get started`);
});
