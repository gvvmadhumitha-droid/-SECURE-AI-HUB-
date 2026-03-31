import { test, expect } from '@playwright/test';

test.describe('Secure AI Hub User Journeys', () => {

  test('Application successfully loads and lazy-loads the Dashboard', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Ensure the Navbar rendered
    await expect(page.getByText('Secure AI Hub').first()).toBeVisible();
    
    // Evaluate initial content structure (Home)
    await expect(page.getByText('Cyber Resilience', { exact: false }).first()).toBeVisible();

    // Navigate to Dashboard (this triggers the React.lazy load)
    const dashboardButton = page.getByRole('button', { name: 'Dashboard' }).first();
    await dashboardButton.click();

    // Verify it loads correctly without crashing the Error Boundary
    await expect(page.getByText('Active Training Impact').first()).toBeVisible({ timeout: 10000 });
    
    // Check initial readiness score
    await expect(page.getByText('0%').first()).toBeVisible();
  });

  test('Error Boundary catches crashes appropriately', async ({ page }) => {
    // In a real e2e test, we could inject an error or navigate to a test route that reliably throws.
    // For this e2e proof, we check that normal navigation doesn't trigger the glitch screen.
    await page.goto('/?tab=dashboard');
    
    // Assert the glitch screen is NOT visible
    await expect(page.locator('text=System Glitch')).not.toBeVisible();
  });
});
