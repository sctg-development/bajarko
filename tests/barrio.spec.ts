import { test, expect } from '@playwright/test';

test.describe('Barrio Application', () => {
    test('should navigate to blends category and verify specific products', async ({ page }) => {
        // Navigate to the home page
        await page.goto('http://localhost:5175');

        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');

        // Click on the blends category link
        await page.click('a[href="/categories/blends"]');

        // Wait for the new page to load completely
        await page.waitForLoadState('networkidle');

        // Find the container div with class "@container"
        const containerDiv = page.locator('div.\\@container');
        await expect(containerDiv).toBeVisible();

        // Check for the two specific products within the container
        const napoleonProduct = containerDiv.locator('text=Napoléon fait du ski');
        const bertrandProduct = containerDiv.locator('text=Le Génial Bertrand fait du ski');

        // Verify that exactly these two products are present
        await expect(napoleonProduct).toBeVisible();
        await expect(bertrandProduct).toBeVisible();

        // Count all products with these specific texts to ensure there are exactly 2
        const napoleonCount = await containerDiv.locator('text=Napoléon fait du ski').count();
        const bertrandCount = await containerDiv.locator('text=Le Génial Bertrand fait du ski').count();

        expect(napoleonCount).toBe(1);
        expect(bertrandCount).toBe(1);

        // Verify that we have exactly 2 products total (optional verification)
        const allProductTexts = await containerDiv.locator('text=/Napoléon fait du ski|Le Génial Bertrand fait du ski/').count();
        expect(allProductTexts).toBe(2);
    });

    test('should navigate to Napoleon product and verify it is purchasable', async ({ page }) => {
        // Navigate to the home page
        await page.goto('http://localhost:5175');

        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');

        // Click on the blends category link
        await page.click('a[href="/categories/blends"]');

        // Wait for the new page to load completely
        await page.waitForLoadState('networkidle');

        // Find the container div with class "@container"
        const containerDiv = page.locator('div.\\@container');
        await expect(containerDiv).toBeVisible();

        // Find the Napoleon product and click on its link
        const napoleonProductContainer = containerDiv.locator('text=Napoléon fait du ski');
        await expect(napoleonProductContainer).toBeVisible();

        // Find the <a> tag within the Napoleon product container and click it
        await napoleonProductContainer.click();

        // Wait for the product page to load completely
        await page.waitForLoadState('networkidle');

        // Verify we're on the product page by checking the URL contains the product handle
        await expect(page).toHaveURL(/\/products\/napoleon-fait-du-ski/);

        // Verify the product title is visible on the page
        await expect(page.locator('text=Napoléon fait du ski')).toBeVisible();

        // Verify the "Add to cart" button is visible and enabled
        const addToCartButton = page.locator('button:has-text("Add to cart"), button:has-text("Ajouter au panier")');
        await expect(addToCartButton).toBeVisible();
        await expect(addToCartButton).toBeEnabled();

        // Optional: Verify that the product is not showing as "sold out"
        const soldOutIndicator = page.locator('text=/sold out|épuisé|rupture de stock/i');
        await expect(soldOutIndicator).not.toBeVisible();

        // Click the "Add to cart" button
        await addToCartButton.click();

        // Wait for the cart to update
        await page.waitForTimeout(1000); // Give some time for the cart to update

        // Verify that the cart shows "My Cart (1 item)"
        const cartTitle = page.locator('text=My Cart (1 item)');
        await expect(cartTitle).toBeVisible();
    });
});
