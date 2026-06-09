import { expect, test } from '@playwright/test';

test('placeos-setup renders the app shell', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/PlaceOS Build Setup/);
    await expect(page.locator('placeos-tools-root')).toBeAttached();
});
