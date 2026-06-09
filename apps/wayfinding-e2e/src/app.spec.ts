import { expect, test } from '@playwright/test';

test('wayfinding renders the app shell', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Wayfinding/);
    await expect(page.locator('placeos-tools-root')).toBeAttached();
});
