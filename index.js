const puppeteer = require('puppeteer-core');
// Or import puppeteer from 'puppeteer-core';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: false,
    defaultViewport: false
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto('https://www.tokopedia.com/find/pc-rakitan?source=homepage.popular_keywords.0.0&srp_component_id=06.01.01.04');

  await page.waitForSelector(".css-1vknpta")
  await page.waitForSelector(".css-15vayma")

  const titles = await page.$$('.css-1vknpta > .css-15vayma');

  let productCount = 0;
  for (const title of titles) {
    let text = "NULL"
    
    try {
      text = await page.evaluate(
        (el) => el.textContent,
        title
      );
    } catch (error) {}

    if (text !== "NULL" && text.length > 0) {
      productCount++
    }
  }

  console.log("Number of Products:", productCount)

  // await browser.close();
})()