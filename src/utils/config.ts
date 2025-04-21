import fs from 'fs';
import path from 'path';

export interface Config {
  browser: {
    headless: boolean;
    slowMo: number;
    defaultTimeout: number;
  };
  credentials: {
    google?: {
      email: string;
      password: string;
    };
    // Add other service credentials as needed
  };
  dataDir: string;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    // Default configuration
    this.config = {
      browser: {
        headless: false,
        slowMo: 50,
        defaultTimeout: 30000
      },
      credentials: {},
      dataDir: path.join(process.cwd(), 'data')
    };

    this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): void {
    const configPath = path.join(process.cwd(), 'config.json');
    
    try {
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        const loadedConfig = JSON.parse(configData);
        
        // Merge loaded config with default config
        this.config = {
          ...this.config,
          ...loadedConfig,
          browser: {
            ...this.config.browser,
            ...loadedConfig.browser
          },
          credentials: {
            ...this.config.credentials,
            ...loadedConfig.credentials
          }
        };
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  }

  getConfig(): Config {
    return this.config;
  }

  saveConfig(): void {
    const configPath = path.join(process.cwd(), 'config.json');
    
    try {
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  }
}
