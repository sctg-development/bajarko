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
});
