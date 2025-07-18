import { test, expect } from '@playwright/test';

test('Koseli category products verification', async ({ page }) => {
    // Step 1: Go to the Koseli homepage
    await page.goto('http://localhost:5176/fr');

    // Step 2: Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    console.log('✅ Koseli homepage loaded successfully');

    // Step 3: Click on the boots category link
    await page.click('a[href="/fr/categories/boots"]');

    // Wait for the category page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    console.log('✅ Navigated to boots category page');

    // Step 4: Verify that the product list contains exactly 2 products
    // Find the ul that contains product links
    const productList = page.locator('ul:has(a[href^="/fr/products/"])');
    await expect(productList).toBeVisible();

    // Check for the first product link within the product list
    const firstProduct = productList.locator('a[href="/fr/products/u9060eee"]').first();
    await expect(firstProduct).toBeVisible();

    // Check for the second product link within the product list
    const secondProduct = productList.locator('a[href="/fr/products/u574-unisex-sneakers"]').first();
    await expect(secondProduct).toBeVisible();

    // Verify that there are exactly 2 distinct product links in the product list
    const distinctProducts = await productList.locator('a[href^="/fr/products/"]').evaluateAll(links => {
        const uniqueHrefs = new Set(links.map(link => link.getAttribute('href')));
        return Array.from(uniqueHrefs);
    });

    expect(distinctProducts).toHaveLength(2);
    expect(distinctProducts).toContain('/fr/products/u9060eee');
    expect(distinctProducts).toContain('/fr/products/u574-unisex-sneakers');

    console.log('✅ Found exactly 2 products in the boots category:');
    console.log('   - u9060eee');
    console.log('   - u574-unisex-sneakers');

    console.log('✅ Test passed: Koseli category products verification completed successfully');
});
