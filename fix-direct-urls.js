const fs = require('fs');

const storePath = 'lib/scraper/store.ts';
let storeContent = fs.readFileSync(storePath, 'utf8');

// I am modifying the links to directly search DuckDuckGo for the equipment if the direct links fail. 
// However, the DuckDuckGo links are just search pages. To make it "real", I will use the actual search page link of the respective websites with proper encoding.

storeContent = storeContent.replace(/url: 'https:\/\/duckduckgo\.com\/\?q=' \+ encodeURIComponent\('site:machinerytrader\.com "Caterpillar ([a-zA-Z0-9]+)" wheel loader'\)/g, (match, model) => {
   return `url: 'https://www.machinerytrader.com/listings/search?Manufacturer=CATERPILLAR&ModelGroup=${model}'`;
});

storeContent = storeContent.replace(/url: 'https:\/\/duckduckgo\.com\/\?q=' \+ encodeURIComponent\('site:equipmenttrader\.com "Caterpillar 966"'\)/g, 
  `url: 'https://www.equipmenttrader.com/Equipment/equipment-for-sale?keyword=Caterpillar%20966'`
);

storeContent = storeContent.replace(/url: 'https:\/\/duckduckgo\.com\/\?q=' \+ encodeURIComponent\('site:mascus\.com "Caterpillar 966" wheel loader'\)/g, 
  `url: 'https://www.mascus.com/construction/used-wheel-loaders?search=Caterpillar+966'`
);

storeContent = storeContent.replace(/url: 'https:\/\/duckduckgo\.com\/\?q=' \+ encodeURIComponent\('site:rockanddirt\.com "Caterpillar 966" wheel loader'\)/g, 
  `url: 'https://www.rockanddirt.com/search?q=caterpillar+966'`
);

storeContent = storeContent.replace(/url: 'https:\/\/duckduckgo\.com\/\?q=' \+ encodeURIComponent\('site:publicsurplus\.com "Caterpillar 966"'\)/g, 
  `url: 'https://www.publicsurplus.com/sms/browse/search?lowerPrice=0&greaterPrice=0&title=caterpillar+966'`
);

storeContent = storeContent.replace(/url: 'https:\/\/duckduckgo\.com\/\?q=' \+ encodeURIComponent\('site:mylittlesalesman\.com "Caterpillar 966"'\)/g, 
  `url: 'https://www.mylittlesalesman.com/find/caterpillar-966'`
);

storeContent = storeContent.replace(/url: 'https:\/\/duckduckgo\.com\/\?q=' \+ encodeURIComponent\('site:machinio\.com "Caterpillar 966"'\)/g, 
  `url: 'https://www.machinio.com/cat-equipment?search=966'`
);

fs.writeFileSync(storePath, storeContent, 'utf8');
console.log('Fixed URLs in store.ts to point to actual search pages.');
