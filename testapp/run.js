const puppeteer = require('puppeteer-core');
const axios = require('axios');
const fs = require('fs');

const url = process.argv[2];

(async() => {
  try {
    const response = await axios.get('http://localhost:9222/json/version');
    const {webSocketDebuggerUrl} = response.data;
    const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});
    const page = await browser.newPage();
    await page.goto(url, {timeout: 30000});
    const session = await page.target().createCDPSession();
    await session.send('Page.enable');
    const {data} = await session.send('Page.captureSnapshot');
    fs.writeFile('page.mhtml', data, 'utf8', () => {});
    await page.screenshot({path: 'screenshot.png', fullPage: true});
    await browser.close();
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
