import { expect, test } from '@playwright/test';

test('map-builder renders the app shell', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Map Builder \| PlaceOS/);
    await expect(page.locator('placeos-tools-root')).toBeAttached();
});
