import { Page } from 'playwright';
import { BasePage } from './base-page';

export class GoogleLoginPage extends BasePage {
  // Selectors
  private emailInputSelector = 'input[type="email"]';
  private passwordInputSelector = 'input[type="password"]';
  private nextButtonSelector = 'button:has-text("Next")';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Google login page
   */
  async navigate(): Promise<void> {
    await super.navigate('https://accounts.google.com/signin');
  }

  /**
   * Enter email address
   */
  async enterEmail(email: string): Promise<void> {
    await this.page.fill(this.emailInputSelector, email);
    await this.page.click(this.nextButtonSelector);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    // Wait for password field to be visible
    await this.page.waitForSelector(this.passwordInputSelector, { state: 'visible' });
    await this.page.fill(this.passwordInputSelector, password);
    await this.page.click(this.nextButtonSelector);
  }

  /**
   * Complete login process
   */
  async login(email: string, password: string): Promise<void> {
    await this.navigate();
    await this.enterEmail(email);
    await this.enterPassword(password);
    // Wait for navigation to complete after login
    await this.waitForNavigation();
  }
}
