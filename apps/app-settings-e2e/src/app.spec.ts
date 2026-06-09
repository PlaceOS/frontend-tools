import { expect, test } from '@playwright/test';

test('app-settings renders the app shell', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/AppSettings/);
    await expect(page.locator('placeos-tools-root')).toBeAttached();
});
