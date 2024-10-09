import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.hero h1')).toBeVisible();
	await expect(page.locator('.hero p')).toBeVisible();
	await expect(page.locator('.hero .button')).toBeVisible();
});
