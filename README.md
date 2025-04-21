# Browser Automation Architecture

A scalable architecture for browser automation using Playwright and VNC for visual debugging.

## Features

- TypeScript-based architecture
- Page Object Model design pattern
- Docker containerization with VNC support
- Configurable browser settings
- Logging utilities
- Credential management

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose (for containerized execution)
- VNC Viewer (for visual debugging)

## Getting Started

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a configuration file:
   ```
   cp config.json.example config.json
   ```

3. Edit the `config.json` file with your credentials and settings.

4. Run a script:
   ```
   npm start
   ```

### Docker Execution

#### Standard Setup (Playwright)

1. Build and start the container:
   ```
   docker-compose up --build
   ```

2. Access the browser via web interface:
   - Open your web browser
   - Navigate to `http://localhost:8080`
   - You'll see the browser running in your web browser

3. Alternatively, connect via a VNC client:
   - Open your VNC viewer
   - Connect to `localhost:5900`
   - No password is required

#### Lightweight Setup (Puppeteer + Alpine)

1. Build and start the lightweight container:
   ```
   npm run docker:build:light
   npm run docker:up:light
   ```

2. Access the browser via web interface:
   - Open your web browser
   - Navigate to `http://localhost:8081`
   - You'll see the browser running in your web browser

3. Alternatively, connect via a VNC client:
   - Open your VNC viewer
   - Connect to `localhost:5901`
   - No password is required

## Project Structure

```
browser-automation-arch/
├── src/
│   ├── core/           # Core browser management
│   ├── pages/          # Page Object Models
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utilities (logging, config, etc.)
├── scripts/            # Automation scripts
├── data/               # Data storage
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── docker-entrypoint.sh # Docker entry point script
├── tsconfig.json       # TypeScript configuration
├── package.json        # Node.js dependencies
└── config.json         # Application configuration
```

## Creating New Page Objects

1. Create a new file in the `src/pages` directory
2. Extend the `BasePage` class
3. Define selectors and methods for interacting with the page

Example:

```typescript
import { Page } from 'playwright';
import { BasePage } from './base-page';

export class MyNewPage extends BasePage {
  // Selectors
  private myButtonSelector = 'button.my-button';

  constructor(page: Page) {
    super(page);
  }

  async clickMyButton(): Promise<void> {
    await this.page.click(this.myButtonSelector);
  }
}
```

## Creating New Scripts

1. Create a new file in the `scripts` directory
2. Import the necessary classes and utilities
3. Implement your automation logic

## Cloud Deployment

### Hugging Face Spaces

This project can be deployed to Hugging Face Spaces:

1. Create a new Space on Hugging Face:
   - Go to https://huggingface.co/spaces
   - Click "Create new Space"
   - Select "Docker" as the Space SDK
   - Give your Space a name (e.g., "browser-automation-demo")
   - Set visibility (public or private)
   - Click "Create Space"

2. Push your code to the Space:
   ```
   git remote add space https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
   git push --force space main
   ```

3. Hugging Face will automatically build and deploy your Docker container.

### Railway

This project can also be deployed to Railway:

1. Create a new project on Railway:
   - Go to https://railway.app/
   - Sign up or log in
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. Connect your GitHub repository and deploy.

## License

MIT
