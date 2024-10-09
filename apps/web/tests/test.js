import { expect, test } from '@playwright/test';

test('home page hero is rendered properly', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.hero h1')).toBeVisible();
	await expect(page.locator('.hero p')).toBeVisible();
	await expect(page.locator('.hero .button')).toBeVisible();
});
