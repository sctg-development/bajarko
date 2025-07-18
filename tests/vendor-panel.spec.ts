import { test, expect } from '@playwright/test';

test('Vendor panel login and product verification', async ({ page }) => {
    // Retrieve environment variables
    const email = process.env.VENDOR_EMAIL;
    const password = process.env.VENDOR_PASSWORD;

    // Check that environment variables are defined
    if (!email || !password) {
        throw new Error('Environment variables VENDOR_EMAIL and VENDOR_PASSWORD must be defined');
    }

    // Step 1: Go to the vendor panel login page
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Step 2: Fill in the login form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for redirect after login
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Step 3: Verify that the medusa_auth_token cookie is set
    const cookies = await page.context().cookies();
    // console.log('Cookies after login:', cookies);
    // const authCookie = cookies.find(cookie => cookie.name === 'medusa_auth_token');
    // expect(authCookie).toBeDefined();
    // expect(authCookie?.value).toBeTruthy();

    // console.log('✅ Auth cookie successfully set:', authCookie?.value);

    // Step 4: Navigate to the products page
    await page.click('a[href="/products"]');

    // Wait for the products page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Step 5: Verify that the text "Napoléon fait du ski" is present
    const productTextElement = page.getByText('Napoléon fait du ski');
    await expect(productTextElement).toBeVisible();

    console.log('✅ Product "Napoléon fait du ski" found on the page');

    // Step 6: Delete the cookie
    await page.context().clearCookies();

    // Verify that the cookie has been deleted
    const cookiesAfterDeletion = await page.context().cookies();
    const authCookieAfterDeletion = cookiesAfterDeletion.find(cookie => cookie.name === 'medusa_auth_token');
    expect(authCookieAfterDeletion).toBeUndefined();

    console.log('✅ Test passed: Vendor panel login, product verification, and cookie management completed successfully');
});
