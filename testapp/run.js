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
    await page.setDefaultTimeout(0);
    page.setViewport({
      width: 2304,
      height: 1440,
      isLandscape: true
    });
    await page.goto('https://enewspaper.sandiegouniontribune.com/desktop/sdut/default.aspx?pubid=ee84df93-f3c1-463c-a82f-1ab095a198ca', {waitUntil: 'networkidle2', timeout: 0});

    await page.evaluate(() => {
      var waitInterval = setInterval(() => {
        try {
          let button = Array.from(document.querySelectorAll('p'))
            .find(e => e.textContent === 'Continue');
          let id = 'randomidhopefullyuniquezero';
          button.setAttribute('id', id);
          clearInterval(waitInterval);
        } catch (e) {
          () => {};
        }
      }, 1000);
    });
    await page.waitForSelector('#randomidhopefullyuniquezero');
    await page.click('#randomidhopefullyuniquezero');

    await page.evaluate(() => {
      var waitInterval = setInterval(() => {
        try {
          let button = Array.from(document.querySelectorAll('x-inner'))
            .find(e => {
              e.parentNode.getAttribute('style').includes('downloads-transparent')
            });
          let id = 'randomidhopefullyuniqueone';
          button.setAttribute('id', id);
          clearInterval(waitInterval);
        } catch (e) {
          () => {};
        }
      }, 1000);
    });
    await page.waitForSelector('#randomidhopefullyuniqueone');
    await page.click('#randomidhopefullyuniqueone');
    
    await page.evaluate(() => {
      var waitInterval = setInterval(() => {
        try {
          let button = Array.from(document.querySelectorAll('x-innerhtml'))
            .find(e => e.innerText === 'Select All');
          let id = 'randomidhopefullyuniquetwo';
          button.setAttribute('id', id);
          clearInterval(waitInterval);
        } catch (e) {
          () => {};
        }
      }, 1000);
    });
    await page.waitForSelector('#randomidhopefullyuniquetwo');
    await page.click('#randomidhopefullyuniquetwo');


    await page.evaluate(() => {
      var waitInterval = setInterval(() => {
        try {
          let button = Array.from(document.querySelectorAll('x-innerhtml'))
            .find(e => e.innerText === 'Download');
          let id = 'randomidhopefullyuniquethree';
          button.setAttribute('id', id);
          clearInterval(waitInterval);
        } catch (e) {
          () => {};
        }
      }, 1000);
    });
    await page.waitForSelector('#randomidhopefullyuniquethree');
    await page.click('#randomidhopefullyuniquethree');


    const theLink = await page.evaluate(() => {
      var waitInterval = setInterval(() => {
        try {
          let button = Array.from(document.querySelectorAll('a'))
            .find(e => e.href.split('.').pop() === 'pdf');
          let id = 'randomidhopefullyuniquefour';
          button.setAttribute('id', id);
          clearInterval(waitInterval);
          return button.href;
        } catch (e) {
          () => {};
        }
      }, 1000);
    });
    console.log(theLink);
    fs.writeFile('the_link.json', JSON.stringify({'link': theLink}), 'utf8', () => {});
    await page.waitForSelector('#randomidhopefullyuniquefour');
    await page.click('#randomidhopefullyuniquefour');

    const session = await page.target().createCDPSession();
    await session.send('Page.enable');
    const {data} = await session.send('Page.captureSnapshot');
    fs.writeFile('page.mhtml', data, 'utf8', () => {});
    await page.screenshot({path: 'screenshot.png', fullPage: true});
    const extracted = await page.evaluate(() => {
      const actualUrl = document.URL;
      const links = Array.from(document.getElementsByTagName("a"));
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
