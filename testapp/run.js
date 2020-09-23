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
    page.on('console', msg => console.log('PAGE LOG:', msg.text());
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



    await page.waitForSelector('.toolbarRightContainer > .x-inner > .toolbarIconRight');
    await page.waitForTimeout(3000);
    const toolbarButtons = await page.$$('.toolbarRightContainer > .x-inner > .toolbarIconRight');
    const downloadButton = toolbarButtons.find(async button => {
      await page.evaluate(b => {
        window.getComputedStyle(b)
          .getPropertyValue('background-image')
          .includes('downloads-transparent');
      }, button);
    });
    await downloadButton.click();



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
