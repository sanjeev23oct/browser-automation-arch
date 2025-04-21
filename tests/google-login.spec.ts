import { test, expect } from '@playwright/test';
import { GoogleLoginPage } from '../src/pages/google-login-page';

test.describe('Google Login', () => {
  test('should navigate to Google login page', async ({ page }) => {
    const googleLoginPage = new GoogleLoginPage(page);
    await googleLoginPage.navigate();
    
    // Verify we're on the Google login page
    const url = await page.url();
    expect(url).toContain('accounts.google.com');
    
    // Verify email input is visible
    const emailInput = await page.$('input[type="email"]');
    expect(emailInput).toBeTruthy();
  });
});
