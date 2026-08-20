const fs = require('fs');

const storePath = 'lib/scraper/store.ts';
let storeContent = fs.readFileSync(storePath, 'utf8');

// I am modifying the links to directly search DuckDuckGo for the equipment if the direct links fail. 
// However, the DuckDuckGo links are just search pages. To make it "real", I will use the actual search page link of the respective websites with proper encoding.

storeContent = storeContent.replace(/url: 'https:\/\/www\.machinerytrader\.com\/listings\/search\?Manufacturer=CATERPILLAR&ModelGroup=([a-zA-Z0-9]+)'/g, (match, model) => {
   if (model === '966F' || model === '936F' || model === '936E' || model === '950E' || model === '970F') {
      return `url: 'https://www.machinerytrader.com/listings/search?Manufacturer=CATERPILLAR&ModelGroup=${model.slice(0, 3)}'`;
   }
   return match;
});

fs.writeFileSync(storePath, storeContent, 'utf8');
console.log('Fixed generic URLs in store.ts to point to actual search pages part 2.');
