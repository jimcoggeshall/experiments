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
    await page.goto('https://enewspaper.sandiegouniontribune.com/desktop/sdut/default.aspx?pubid=ee84df93-f3c1-463c-a82f-1ab095a198ca', {waitUntil: 'networkidle2', timeout: 0});

    await page.evaluate(() => {
      let button = Array.from(document.querySelectorAll('p'))
        .find(e => e.textContent === 'Continue');
      let id = 'randomidhopefullyuniqueone';
      button.setAttribute('id', id);
    });
    await page.click('#randomidhopefullyuniqueone');
    
    await page.waitForSelector('#ext-element-993', {timeout: 0});
    await page.click('#ext-element-993');
    await page.waitForSelector('#ext-element-1137', {timeout: 0});
    await page.click('#ext-element-1137');
    await page.waitForSelector('#ext-element-1143', {timeout: 0});
    await page.click('#ext-element-1143');

    await page.waitForNavigation({waitUntil: 'networkidle2', timeout: 0});

    const contents = await page.content();
    console.log(contents);

    const session = await page.target().createCDPSession();
    await session.send('Page.enable');
    const {data} = await session.send('Page.captureSnapshot');
    fs.writeFile('page.mhtml', data, 'utf8', () => {});

    await browser.close();

  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
