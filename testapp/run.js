const puppeteer = require('puppeteer-core');
const axios = require('axios');
const fs = require('fs');

(async() => {
  try {
    const response = await axios.get('http://localhost:9222/json/version');
    const {webSocketDebuggerUrl} = response.data;
    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl, 
      defaultViewport: {
        width: 1365,
        height: 729,
        isLandscape: true
      }
    });
    const page = await browser.newPage();
    page.setViewport({
      width: 1365,
      height: 729,
      isLandscape: true
    });
    await page.goto('https://enewspaper.sandiegouniontribune.com/desktop/sdut/default.aspx?pubid=ee84df93-f3c1-463c-a82f-1ab095a198ca', {waitUntil: 'networkidle2', timeout: 60000});

    await page.evaluate(() => {
      while (true) {
        try {
          let button = Array.from(document.querySelectorAll('p'))
            .find(e => e.textContent === 'Continue');
          let id = 'randomidhopefullyuniqueone';
          button.setAttribute('id', id);
          break;
        } catch (e) {
          continue;
        }
      }
    });
    await page.click('#randomidhopefullyuniqueone');
    
    await page.waitForSelector('#ext-element-993', {timeout: 60000});
    await page.click('#ext-element-993');
    await page.waitForSelector('#ext-element-1137', {timeout: 60000});
    await page.click('#ext-element-1137');
    await page.waitForSelector('#ext-element-1143', {timeout: 60000});
    await page.click('#ext-element-1143');

    const theLink = await page.evaluate(() => {
      while (true) {
        try {
          let button = Array.from(document.querySelectorAll('a'))
            .find(e => e.href.split('.').pop() === 'pdf');
          let id = 'randomidhopefullyuniquetwo';
          button.setAttribute('id', id);
          return button.href;
        } catch (e) {
          continue;
        }
      }
    });
    console.log(theLink);
    await page.click('#randomidhopefullyuniquetwo');

    await browser.close();

  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
