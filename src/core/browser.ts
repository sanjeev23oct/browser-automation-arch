import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { BrowserOptions } from '../types/browser';

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  constructor(private options: BrowserOptions = {}) {}

  async initialize(): Promise<void> {
    // Launch browser
    this.browser = await chromium.launch({
      headless: this.options.headless ?? false,
      slowMo: this.options.slowMo ?? 0,
      ...this.options.launchOptions
    });

    // Create context
    this.context = await this.browser.newContext({
      viewport: this.options.viewport ?? { width: 1280, height: 720 },
      userAgent: this.options.userAgent,
      ...this.options.contextOptions
    });

    // Create page
    this.page = await this.context.newPage();
    
    // Set default timeout
    if (this.options.defaultTimeout) {
      this.page.setDefaultTimeout(this.options.defaultTimeout);
    }
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }
    return this.page;
  }

  async newPage(): Promise<Page> {
    if (!this.context) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }
    return await this.context.newPage();
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }
}
