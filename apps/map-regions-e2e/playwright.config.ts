import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://127.0.0.1:4303';

export default defineConfig({
    ...nxE2EPreset(__filename, { testDir: './src' }),
    outputDir: '../../dist/.playwright/apps/map-regions-e2e/test-output',
    reporter: [
        ['list'],
        [
            'html',
            {
                outputFolder:
                    '../../dist/.playwright/apps/map-regions-e2e/playwright-report',
                open: 'never',
            },
        ],
    ],
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'npx nx run map-regions:serve --port=4303 --host=127.0.0.1',
        url: baseURL,
        reuseExistingServer: true,
        cwd: workspaceRoot,
        timeout: 120000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
