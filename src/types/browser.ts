import { LaunchOptions, BrowserContextOptions, ViewportSize } from 'playwright';

export interface BrowserOptions {
  headless?: boolean;
  slowMo?: number;
  defaultTimeout?: number;
  viewport?: ViewportSize;
  userAgent?: string;
  launchOptions?: LaunchOptions;
  contextOptions?: BrowserContextOptions;
}
