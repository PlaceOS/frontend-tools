import { expect, test } from '@playwright/test';

test('sensor-map renders the app shell', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/SensorMap/);
    await expect(page.locator('placeos-tools-root')).toBeAttached();
});
