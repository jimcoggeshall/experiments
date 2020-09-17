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
    await page.goto('https://enewspaper.sandiegouniontribune.com/desktop/sdut/default.aspx?pubid=ee84df93-f3c1-463c-a82f-1ab095a198ca', {waitUntil: 'networkidle2'});

    await page.evaluate(() => {
      let button = Array.from(document.querySelectorAll('p'))
        .find(e => e.textContent === 'Continue');
      let id = 'randomidhopefullyuniqueone';
      button.setAttribute('id', id);
    });
    await page.click('#randomidhopefullyuniqueone');
    
    await page.evaluate(() => {
      let button = Array.from(document.querySelectorAll('.toolbar'))
        .find(e => e.getAttribute('style').includes('menu-transparent'));
      let id = 'randomidhopefullyuniquetwo';
      button.setAttribute('id', id);
    });
    await page.click('#randomidhopefullyuniquetwo');

    await page.evaluate(() => {
      let button = Array.from(document.querySelectorAll('.x-innerhtml'))
        .find(e => e.textContent === 'Download');
      let id = 'randomidhopefullyuniquethree';
      button.setAttribute('id', id);
    });
    await page.click('#randomidhopefullyuniquethree');
    
    await page.evaluate(() => {
      let button = Array.from(document.querySelectorAll('.x-innerhtml'))
        .find(e => e.textContent === 'Select All');
      let id = 'randomidhopefullyuniquefour'
      button.setAttribute('id', id);
    });
    await page.click('#randomidhopefullyuniquefour');

    await page.evaluate(() => {
      let button = Array.from(document.querySelectorAll('.x-innerhtml'))
        .find(e => e.textContent === 'Download');
      let id = 'randomidhopefullyuniquefive';
      button.setAttribute('id', id);
    });
    await page.click('#randomidhopefullyuniquefive');

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
