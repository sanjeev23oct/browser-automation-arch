import puppeteer from 'puppeteer';
import { ConfigManager } from '../src/utils/config';
import { Logger, LogLevel } from '../src/utils/logger';

async function main() {
  // Initialize logger
  const logger = Logger.getInstance();
  logger.setLogLevel(LogLevel.DEBUG);

  // Get configuration
  const configManager = ConfigManager.getInstance();
  const config = configManager.getConfig();

  // Check if credentials are available
  if (!config.credentials.google) {
    logger.error('Google credentials not found in config');
    return;
  }

  const { email, password } = config.credentials.google;

  // Launch browser
  logger.info('Launching browser');
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1280,720'
    ],
    slowMo: config.browser.slowMo
  });

  try {
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewport({ width: 1280, height: 720 });

    // Set default timeout
    page.setDefaultTimeout(config.browser.defaultTimeout);

    // Navigate to Google login
    logger.info('Navigating to Google login page');
    await page.goto('https://accounts.google.com/signin');

    // Take a screenshot of the login page
    await page.screenshot({ path: 'google-login-page.png' });
    logger.info('Login page screenshot saved');

    try {
      // Enter email
      logger.info(`Logging in with account: ${email}`);
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await page.type('input[type="email"]', email);

      // Click next - using a more generic selector
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const nextButton = buttons.find(button => button.textContent?.includes('Next'));
        if (nextButton) nextButton.click();
        else throw new Error('Next button not found');
      });

      // Wait a bit for the password field to appear
      await page.waitForTimeout(2000);

      // Enter password
      await page.waitForSelector('input[type="password"]', { visible: true, timeout: 5000 });
      await page.type('input[type="password"]', password);

      // Take a screenshot of the password page
      await page.screenshot({ path: 'google-password-page.png' });

      // Click next - using a more generic selector
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const nextButton = buttons.find(button => button.textContent?.includes('Next'));
        if (nextButton) nextButton.click();
        else throw new Error('Next button not found');
      });

      // Wait for navigation to complete
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {
        logger.warn('Navigation timeout, but continuing...');
      });

      logger.info('Login attempt completed');
    } catch (error) {
      const loginError = error as Error;
      logger.warn(`Login process error: ${loginError.message}`);
    }

    // Take a final screenshot regardless of login success
    await page.screenshot({ path: 'final-page.png' });
    logger.info('Final screenshot saved');

    // Navigate to demo complete page
    logger.info('Navigating to demo complete page');
    await page.goto('file:///app/src/static/demo-complete.html');
    logger.info('Demo complete page loaded');
  } catch (error) {
    logger.error('Error during Google login', error as Error);
  } finally {
    // Keep the browser open for demonstration
    logger.info('Browser will remain open for demonstration');
    // Don't close the browser: await browser.close();
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
