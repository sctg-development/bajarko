import { test, expect } from '@playwright/test';

test('Motiharu homepage content verification', async ({ page }) => {
    // Go to the Motiharu homepage
    await page.goto('http://localhost:5174');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    console.log('✅ Motiharu homepage loaded successfully');

    // Verify that the text "Napoléon fait du ski" is present
    const napoleonTextElement = page.getByText('Napoléon fait du ski');
    await expect(napoleonTextElement).toBeVisible();

    console.log('✅ Found text "Napoléon fait du ski" on the homepage');

    console.log('✅ Test passed: Motiharu homepage content verification completed successfully');
});
