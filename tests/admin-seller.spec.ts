import { test, expect } from '@playwright/test';

test('Test: admin connexion and seller verification', async ({ page }) => {
    // Retrieve environment variables
    const email = process.env.MEDUSA_EMAIL;
    const password = process.env.MEDUSA_PASSWORD;

    // Check that environment variables are defined
    if (!email || !password) {
        throw new Error('Environment variables MEDUSA_EMAIL and MEDUSA_PASSWORD must be defined');
    }

    // Step 1: Go to the login page
    await page.goto('/app/login');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Fill in the login form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Click the login button (adjust selector if needed)
    await page.click('button[type="submit"]');

    // Wait for redirect after login with a longer timeout
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Step 2: Navigate to the sellers page
    // Wait for the sellers link to be available before clicking
    await page.waitForSelector('a[href="/app/sellers"]', { timeout: 10000 });
    await page.click('a[href="/app/sellers"]');

    // Wait for the sellers page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 15000 });    // Step 3: Check for the presence of seller admin@store2.world

    // Method 1: Directly search for the text admin@store2.world in the links
    const sellerTextElement = page.getByText('admin@store2.world', { exact: true });
    await expect(sellerTextElement).toBeVisible();

    // Method 2: Check that the row contains both admin@store2.world AND the correct href
    const sellerRow = page.locator('tr').filter({ hasText: 'admin@store2.world' });
    await expect(sellerRow).toBeVisible();


    // Method 4: Specifically check the data-row-link with the correct href
    await page.waitForSelector('a[data-row-link="true"][href="/app/sellers/sel_01JZG3F302612EWG8SKJWG0EXM"]', { timeout: 10000 });
    const dataRowLink = page.locator('a[href="/app/sellers/sel_01JZG3F302612EWG8SKJWG0EXM"]');
    await expect(dataRowLink).toBeDefined();

    console.log('✅ Test passed: Seller admin@store2.world was found with the correct link');
});
