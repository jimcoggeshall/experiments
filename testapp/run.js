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
