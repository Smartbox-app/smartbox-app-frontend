import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const backendRoot = path.resolve(process.cwd(), '../smartbox-back');
const reuseExistingServer = !process.env.CI;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      // globalSetup runs only after this process is healthy, so the database has to come up here.
      command:
        'docker compose -f docker-compose.e2e.yml up -d --wait && bash scripts/start-e2e.sh',
      cwd: backendRoot,
      url: 'http://localhost:3002/tenant/e2e',
      reuseExistingServer,
      timeout: 180_000,
    },
    {
      command: 'npx vite --mode e2e --port 3100 --strictPort --host localhost',
      url: 'http://localhost:3100',
      reuseExistingServer,
      timeout: 120_000,
    },
  ],
});
