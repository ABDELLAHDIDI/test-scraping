const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Product = require('../models/Product'); 

require('dotenv').config();


(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  );

  

  await page.goto(process.env.URI);
 
  await page.waitForSelector('.s-result-list');

  const products = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.s-result-item[data-asin]'));
    return items.slice(1, 11).map(el => {
      const name = el.querySelector('h2 span')?.innerText;
      const url = el.querySelector('h2 a')?.href;
      const image = el.querySelector('img')?.src;
      // const price = el.querySelector('.a-price-whole')?.innerText || el.querySelector('.a-color-base')?.innerText;

    const allBaseElements = el.querySelectorAll('.a-color-base');
    const priceEl = Array.from(allBaseElements).find(span =>
      /€/.test(span.innerText)
    );
    const price = el.querySelector('.a-price-whole')?.innerText ||  priceEl?.innerText   //.replace(/[^\d,]/g, '').replace(',', '.');


      // const availability = el.querySelector('.a-size-base.a-color-secondary')?.innerText ;
      const availability = Array.from(el.querySelectorAll('*')).find(span =>
  span.className === 'a-size-base a-color-secondary'
)?.innerText || ''; 
console.log("availability"+availability)

      return {
        name,
        url,
        image,
        offers: [{
          price: parseFloat(price?.replace(',', '.')) || null,
          availability,
        }]
      };
    });
  });
  
  console.log(products);

 

 mongoose.connect(process.env.MONGODB_URI)

  await Product.insertMany(products);
  console.log('Data saved to MongoDB');


  await browser.close();
})();
