const puppeteer = require('puppeteer-core');
const fs = require("fs");

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: false,
    defaultViewport: false
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto('https://www.tokopedia.com/find/pc-rakitan?source=homepage.popular_keywords.0.0&srp_component_id=06.01.01.04',{
    waitUntil: "networkidle2",
  });

  // Function to scroll to the bottom
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100; // scroll distance
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        // Check if we've reached the bottom
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100); // scroll interval
    });
  });


  // Get Product's Data
  await page.waitForSelector(".css-1vknpta")
  await page.waitForSelector(".css-15vayma")
  const productHandles = await page.$$('.css-1vknpta > .css-15vayma');

  let productCount = 0;

  for (const productHandle of productHandles) {
    let text = "NULL";
    let price = "NULL";
    let URL = "Null";
    let thumbnailURL = "NULL";
    
    try {
      text = await page.evaluate(
        (el) => el.querySelector('a > div > div > div > span').textContent,
        productHandle
      );
    } catch (error) {}

    try {
      const priceSelector = await productHandle.waitForSelector('text/Rp',)
      price = await priceSelector.evaluate((el) => el.textContent);
    } catch (error) {}

    try {
      URL = await page.evaluate(
        (el) => el.querySelector('a').getAttribute("href"),
        productHandle
      );
    } catch (error) {}

    try {
      thumbnailURL = await page.evaluate(
        (el) => el.querySelector('[alt="product-image"]').getAttribute("src"),
        productHandle
      );
    } catch (error) {}

    if (text !== "NULL" && text.length > 0) {
      productCount++
      fs.appendFile(
        "results.csv",
        `${text.replace(/,/g, ".")},${price},${URL},${thumbnailURL}\n`,
        function (err) {
          if (err) throw err;
        }
      );
    }
  }

  console.log("Number of Products:", productCount)

  // await browser.close();
})()