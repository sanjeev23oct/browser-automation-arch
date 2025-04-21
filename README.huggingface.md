# Browser Automation Demo

This Space demonstrates browser automation with a visual interface. You can watch the automation in action and interact with the browser after the demo completes.

## How It Works

1. A Chromium browser runs inside the container
2. Puppeteer automates the browser to perform tasks
3. The browser display is streamed through VNC
4. You can view and interact with the browser through your web browser

## Getting Started

1. Click the "App" tab above to access the demo
2. Click "Connect" in the noVNC interface
3. Watch the automation demo run
4. After the demo completes, you can interact with the browser

## Features

- Real-time visual feedback of browser automation
- Interactive browser access after the demo
- Lightweight Alpine-based container
- Puppeteer for browser automation

## Technical Details

This demo uses:
- Node.js with Puppeteer
- Chromium browser
- Xvfb virtual display
- x11vnc server
- noVNC HTML5 client

The source code is available on GitHub: [browser-automation-arch](https://github.com/yourusername/browser-automation-arch)
