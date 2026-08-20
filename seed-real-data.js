const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    
    // We will scrape mylittlesalesman as it has clear listings and less aggressive blocking usually
    await page.goto('https://www.mylittlesalesman.com/caterpillar-wheel-loaders-for-sale-c65', { waitUntil: 'networkidle2' });
    
    const listings = await page.evaluate(() => {
      const items = [];
      const cards = document.querySelectorAll('.listing');
      for (const card of cards) {
        if(items.length >= 15) break;
        
        const titleEl = card.querySelector('.title a');
        if(!titleEl) continue;
        
        const url = titleEl.href;
        const title = titleEl.innerText.trim();
        
        let price = 0;
        const priceEl = card.querySelector('.price');
        if (priceEl) {
           const priceText = priceEl.innerText.replace(/[^0-9]/g, '');
           price = parseInt(priceText) || 0;
        }
        
        let year = 2015; // default fallback
        const yearMatch = title.match(/20\d{2}|19\d{2}/);
        if(yearMatch) {
            year = parseInt(yearMatch[0]);
        }
        
        let model = "Equipment";
        const modelMatch = title.match(/Cat(erpillar)?\s+([0-9A-Z]+)/i);
        if(modelMatch && modelMatch[2]) {
            model = modelMatch[2].toUpperCase();
        }

        const imgEl = card.querySelector('img');
        const img = imgEl ? imgEl.src : '';

        items.push({
           manufacturer: 'CAT',
           model,
           year,
           price,
           url,
           title,
           primaryImage: img
        });
      }
      return items;
    });
    
    console.log(JSON.stringify(listings, null, 2));
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
