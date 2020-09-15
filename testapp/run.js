const puppeteer = require('puppeteer-core');
const axios = require('axios');
const fs = require('fs');

const url = process.argv[2];

(async() => {
  try {
    const response = await axios.get('http://localhost:9222/json/version');
    const {webSocketDebuggerUrl} = response.data;
    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl, 
      defaultViewport: {
        width: 2304,
        height: 1440,
        isLandscape: true
      }
    });
    const page = await browser.newPage();
    page.setViewport({
      width: 2304,
      height: 1440,
      isLandscape: true
    });
    page.goto(url, {timeout: 0});
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
