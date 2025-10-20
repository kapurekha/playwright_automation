import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: {
    headless: true,
    baseURL: 'https://animated-gingersnap-8cf7f2.netlify.app/',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  reporter: [['html', { outputFolder: 'reports' }]],
})
