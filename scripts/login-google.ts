import { BrowserManager } from '../src/core/browser';
import { GoogleLoginPage } from '../src/pages/google-login-page';
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

  // Initialize browser
  const browserManager = new BrowserManager({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo,
    defaultTimeout: config.browser.defaultTimeout
  });

  try {
    logger.info('Initializing browser');
    await browserManager.initialize();
    
    const page = browserManager.getPage();
    const googleLoginPage = new GoogleLoginPage(page);

    logger.info(`Logging in to Google with account: ${email}`);
    await googleLoginPage.login(email, password);
    
    logger.info('Login successful');
    
    // Take a screenshot after login
    await page.screenshot({ path: 'google-login-success.png' });
    
    logger.info('Screenshot saved');
  } catch (error) {
    logger.error('Error during Google login', error as Error);
  } finally {
    // Close browser
    await browserManager.close();
    logger.info('Browser closed');
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
