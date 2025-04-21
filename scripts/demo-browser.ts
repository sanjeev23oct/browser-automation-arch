import puppeteer from 'puppeteer';
import { ConfigManager } from '../src/utils/config';
import { Logger, LogLevel } from '../src/utils/logger';
import fs from 'fs';
import path from 'path';

async function main() {
  // Initialize logger
  const logger = Logger.getInstance();
  logger.setLogLevel(LogLevel.DEBUG);

  // Get configuration
  const configManager = ConfigManager.getInstance();
  const config = configManager.getConfig();

  // Create demo HTML file
  const demoHtmlPath = path.join(process.cwd(), 'demo.html');
  const demoHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Browser Automation Demo</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f5f5f5;
          }
          .container {
              max-width: 800px;
              margin: 0 auto;
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
              color: #333;
              text-align: center;
          }
          .demo-section {
              margin-top: 20px;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 4px;
          }
          .success {
              color: #4CAF50;
              font-weight: bold;
          }
          .button {
              display: inline-block;
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              text-align: center;
              text-decoration: none;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 10px;
          }
          .button:hover {
              background-color: #45a049;
          }
          #counter {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
          }
          #result {
              margin-top: 20px;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Browser Automation Demo</h1>
          <p>This is a demonstration of browser automation with Puppeteer running in a Docker container.</p>
          
          <div class="demo-section">
              <h2>Demo 1: Counter</h2>
              <p>Watch as the counter increments automatically:</p>
              <div id="counter">0</div>
              <button class="button" id="increment">Increment Manually</button>
          </div>
          
          <div class="demo-section">
              <h2>Demo 2: Form Submission</h2>
              <form id="demoForm">
                  <div>
                      <label for="name">Name:</label>
                      <input type="text" id="name" name="name" required>
                  </div>
                  <div style="margin-top: 10px;">
                      <label for="email">Email:</label>
                      <input type="email" id="email" name="email" required>
                  </div>
                  <button type="submit" class="button" style="margin-top: 10px;">Submit</button>
              </form>
              <div id="result"></div>
          </div>
          
          <div class="demo-section">
              <h2>Information</h2>
              <p>This browser is running inside a Docker container and is being streamed to your browser via VNC.</p>
              <p>You can interact with this page just like a normal browser.</p>
              <p class="success">✓ Demo is running successfully</p>
          </div>
      </div>
      
      <script>
          // Counter demo
          let count = 0;
          const counterElement = document.getElementById('counter');
          const incrementButton = document.getElementById('increment');
          
          function updateCounter() {
              counterElement.textContent = count;
          }
          
          function incrementCounter() {
              count++;
              updateCounter();
          }
          
          incrementButton.addEventListener('click', incrementCounter);
          
          // Auto increment every 2 seconds
          setInterval(incrementCounter, 2000);
          
          // Form submission demo
          const form = document.getElementById('demoForm');
          const resultDiv = document.getElementById('result');
          
          form.addEventListener('submit', function(e) {
              e.preventDefault();
              const name = document.getElementById('name').value;
              const email = document.getElementById('email').value;
              
              resultDiv.innerHTML = \`
                  <p><strong>Form submitted successfully!</strong></p>
                  <p>Name: \${name}</p>
                  <p>Email: \${email}</p>
              \`;
          });
      </script>
  </body>
  </html>
  `;
  
  fs.writeFileSync(demoHtmlPath, demoHtml);
  logger.info(`Demo HTML file created at ${demoHtmlPath}`);

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
    
    // Navigate to demo page
    logger.info('Navigating to demo page');
    await page.goto(`file://${demoHtmlPath}`);
    logger.info('Demo page loaded');
    
    // Take a screenshot
    await page.screenshot({ path: 'demo-page.png' });
    logger.info('Screenshot saved');
    
    // Fill out the form
    logger.info('Filling out the form');
    await page.type('#name', 'Demo User');
    await page.type('#email', 'demo@example.com');
    
    // Submit the form
    logger.info('Submitting the form');
    await page.click('#demoForm button[type="submit"]');
    
    // Wait for result to appear
    await page.waitForSelector('#result');
    
    // Take another screenshot
    await page.screenshot({ path: 'form-submitted.png' });
    logger.info('Form submission screenshot saved');
    
    // Keep the browser open for demonstration
    logger.info('Browser will remain open for demonstration');
    // Don't close the browser: await browser.close();
    
  } catch (error) {
    logger.error('Error during demo', error as Error);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
