import { Page } from 'playwright';

export abstract class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a URL
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}
