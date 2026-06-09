import { expect, test } from '@playwright/test';

test('map-regions renders the app shell', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Map Regions \| PlaceOS/);
    await expect(page.locator('placeos-tools-root')).toBeAttached();
});
