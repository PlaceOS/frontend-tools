import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://127.0.0.1:4306';

export default defineConfig({
    ...nxE2EPreset(__filename, { testDir: './src' }),
    outputDir: '../../dist/.playwright/apps/wayfinding-e2e/test-output',
    reporter: [
        ['list'],
        [
            'html',
            {
                outputFolder:
                    '../../dist/.playwright/apps/wayfinding-e2e/playwright-report',
                open: 'never',
            },
        ],
    ],
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    webServer: {
        command:
            'npx nx run wayfinding:serve:development --port=4306 --host=127.0.0.1',
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
