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
    await page.goto('https://enewspaper.sandiegouniontribune.com/desktop/sdut/default.aspx?pubid=ee84df93-f3c1-463c-a82f-1ab095a198ca', {waitUntil: 'networkidle2'});
    let buttonId = await page.evaluate(() => {
      let button = Array.from(document.querySelectorAll('p'))
        .find(el => el.textContent === 'Continue');
      let id = "randomidhopefullyunique";
      button.setAttribute("id", id);
      return id;
    });
    console.log("buttonId is " + buttonId);
//    await page.waitForSelector('#ext-element-388 > #ext-container-111 > #ext-element-426 #ext-element-439')
//    await page.click('#ext-element-388 > #ext-container-111 > #ext-element-426 #ext-element-439')
//    await page.waitForSelector('#ext-element-388 > #ext-container-111 > #ext-element-426 #ext-element-439');
//    await page.click('#ext-element-388 > #ext-container-111 > #ext-element-426 #ext-element-439');
//    await page.waitForSelector('#ext-container-145 > #ext-element-511 > #ext-container-146 #ext-element-522');
//    await page.click('#ext-container-145 > #ext-element-511 > #ext-container-146 #ext-element-522');
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
