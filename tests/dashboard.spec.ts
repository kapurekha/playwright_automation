import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const dataPath = path.join(__dirname, '../data/tasks.json')
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

async function login(page) {
  await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/')
  await page.getByRole('textbox', { name: 'Username' }).fill('admin')
  await page.getByRole('textbox', { name: 'Password' }).fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()
}

test.describe('Dashboard Demo App - Data Driven', () => {
  for (const data of testData) {
    test(`Validate task "${data.task}" under ${data.app}`, async ({ page }) => {
      // Step 1: Login
      await login(page)

      // Step 2: Navigate to specified app workspace
      await page.getByRole('button', { name: data.app }).click()

      // Locate column by title
      const column = page.locator(
        `.flex.flex-col.w-80.bg-gray-50.rounded-lg.p-4:has(h2:has-text("${data.column}"))`
      )

      const taskCard = column.locator(
        `div.bg-white.p-4.rounded-lg.shadow-sm.border.border-gray-200.hover\\:shadow-md.transition-shadow:has(h3:has-text("${data.task}"))`
      )

      if (data.shouldExist) {
        // Positive test: task and tags must be visible
        await expect(taskCard).toBeVisible()

        for (const tag of data.tags) {
          const tagLocator = taskCard.locator(
            `span[class^="px-2"][class*="rounded-full"][class*="font-medium"]:has-text("${tag}")`
          )
          await expect(tagLocator).toBeVisible()
        }
      } else {
        // Negative test: task card should NOT be visible
        await expect(taskCard).not.toBeVisible()
      }
    })
  }
})
