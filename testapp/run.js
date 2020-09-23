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
        width:2304,
        height: 1440,
        isLandscape: true
      }
    });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.setDefaultTimeout(300000);
    page.setViewport({
      width: 2304,
      height: 1440,
      isLandscape: true
    });
    await page.goto('https://enewspaper.sandiegouniontribune.com/desktop/sdut/default.aspx?pubid=ee84df93-f3c1-463c-a82f-1ab095a198ca', {waitUntil: 'networkidle2'});


    await page.waitForSelector('.btn');
    await page.waitForTimeout(3000);

    const continueButton = await page.$('#ext-viewport > .x-body > .btn');
    await continueButton.click();

    await page.waitForTimeout(3000);
    await page.mouse.wheel({deltaY: -121});
    await page.waitForTimeout(1000);
    await page.mouse.wheel({deltaY: 121});

    await page.waitForSelector('.toolbarRightContainer > .x-inner > .toolbarIconRight');
    await page.hover('.toolbarRightContainer > .x-inner > .toolbarIconRight');

    await page.waitForTimeout(3000);

    const toolbarButtonFake = await page.$$eval(
      '.toolbarRightContainer > .x-inner > .toolbarIconRight',
      arr => arr.map(e => JSON.stringify({
        'id': e.getAttribute('id'),
        'backgroundImage': window.getComputedStyle(e).getPropertyValue('background-image')
      }))
    );
    const downloadButtonIdFake = toolbarButtonFake.map(b => JSON.parse(b))
      .find(b => b.backgroundImage.includes('downloads-transparent')).id;
    const downloadButtonIdSelectorFake = '#' + downloadButtonIdFake;
    await page.waitForSelector(downloadButtonIdSelectorFake);
    await page.hover(downloadButtonIdSelectorFake);
    await page.waitForTimeout(1000);

    const toolbarButton = await page.$$eval(
      '.toolbarRightContainer > .x-inner > .toolbarIconRight',
      arr => arr.map(e => JSON.stringify({
        'id': e.getAttribute('id'),
        'backgroundImage': window.getComputedStyle(e).getPropertyValue('background-image')
      }))
    );
    const downloadButtonId = toolbarButton.map(b => JSON.parse(b))
      .find(b => b.backgroundImage.includes('downloads-transparent')).id;
    const downloadButtonIdSelector = '#' + downloadButtonId;
    await page.waitForSelector(downloadButtonIdSelector);
    await page.hover(downloadButtonIdSelector);
    await page.waitForTimeout(1000);
    await page.evaluate((selector) => document.querySelector(selector).click(), downloadButtonIdSelector);


    await page.waitForSelector('.x-innerhtml');
    await page.waitForTimeout(3000);
    const selectAllButtons = await page.$$('.x-innerhtml');
    const selectAllButton = selectAllButtons.find(async button => {
      let innerText = await button.evaluate(e => e.innerText);
      return innerText === 'Select All';
    });
   await selectAllButton.click();


    await page.waitForSelector('.x-innerhtml');
    await page.waitForTimeout(3000);
    const reallyDownloadButtons = await page.$$('.x-innerhtml');
    const reallyDownloadButton = reallyDownloadButtons.find(async button => {
      let innerText = await button.evaluate(e => e.innerText);
      return innerText === 'Download';
    });
   await reallyDownloadButton.click();

   await page.waitForTimeout(60000);

    const extracted = await page.evaluate(() => {
      const actualUrl = document.URL;
      const links = Array.from(document.getElementsByTagName('a'));
      return JSON.stringify(links.map((n) => {
        return {
          "actualUrl": actualUrl,
          "href": n.getAttribute("href"),
          "innerHTML": n.innerHTML,
          "hreflang": n.getAttribute("hreflang"),
          "ping": n.getAttribute("ping"),
          "referrerpolicy": n.getAttribute("referrerpolicy"),
          "rel": n.getAttribute("rel"),
          "target": n.getAttribute("target")
        };
      }));
    });
    fs.writeFile('extracted.json', extracted,'utf8', () => {});

    await browser.close();

  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
