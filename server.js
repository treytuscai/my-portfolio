// server.js - Run with: node server.js
// Install deps: npm install express ws playwright

import express from 'express';
import { WebSocketServer } from 'ws';
import { chromium } from 'playwright';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let browser;
let page;
let browserReady = false;

// Initialize Playwright browser
async function initBrowser() {
    try {
        browser = await chromium.launch();
        page = await browser.newPage();
        await page.goto('https://google.com');
        browserReady = true;
        console.log('Browser initialized');
        await sendScreenshot();
    } catch (error) {
        console.error('Error initializing browser:', error);
    }
}

// Send screenshot to all connected clients
async function sendScreenshot() {
    if (!page || !browserReady) return;
    
    try {
        const screenshot = await page.screenshot({ type: 'png' });
        const base64 = screenshot.toString('base64');
        
        wss.clients.forEach((client) => {
            if (client.readyState === 1) { // OPEN
                client.send(JSON.stringify({
                    type: 'screenshot',
                    data: base64
                }));
            }
        });
    } catch (error) {
        console.error('Error taking screenshot:', error);
    }
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Send initial screenshot
    if (browserReady) {
        sendScreenshot();
    }

    ws.on('message', async (message) => {
        try {
            const action = JSON.parse(message);
            
            switch (action.type) {
                case 'click':
                    await page.mouse.click(action.x, action.y);
                    break;
                    
                case 'type':
                    await page.keyboard.type(action.text);
                    break;
                    
                case 'key':
                    await page.keyboard.press(action.key);
                    break;
                    
                case 'scroll':
                    await page.evaluate((delta) => {
                        window.scrollBy(0, delta);
                    }, action.delta);
                    break;
                    
                case 'navigate':
                    await page.goto(action.url, { waitUntil: 'networkidle', timeout: 30000 });
                    break;
            }
            
            // Send updated screenshot after action
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for page to update
            await sendScreenshot();
            
        } catch (error) {
            console.error('Error handling action:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: error.message
            }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    if (browser) {
        await browser.close();
    }
    server.close();
    process.exit(0);
});

// Start server
const PORT = 8080;
initBrowser();
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});