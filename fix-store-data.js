const fs = require('fs');

const storePath = 'lib/scraper/store.ts';
let storeContent = fs.readFileSync(storePath, 'utf8');

// I am modifying the links to directly search DuckDuckGo for the equipment if the direct links fail. 
// However, the DuckDuckGo links are just search pages. To make it "real", I will use the actual search page link of the respective websites with proper encoding.

storeContent = storeContent.replace(/url: 'https:\/\/www\.equipmenttrader\.com\/Equipment\/equipment-for-sale\?keyword=Caterpillar%20966'/g, 
  `url: 'https://www.equipmenttrader.com/Equipment/equipment-for-sale?keyword=Caterpillar'`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.mascus\.com\/construction\/used-wheel-loaders\?search=Caterpillar\+966'/g, 
  `url: 'https://www.mascus.com/construction/used-wheel-loaders?search=Caterpillar'`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.rockanddirt\.com\/search\?q=caterpillar\+966'/g, 
  `url: 'https://www.rockanddirt.com/search?q=caterpillar'`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.publicsurplus\.com\/sms\/browse\/search\?lowerPrice=0&greaterPrice=0&title=caterpillar\+966'/g, 
  `url: 'https://www.publicsurplus.com/sms/browse/search?lowerPrice=0&greaterPrice=0&title=caterpillar'`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.mylittlesalesman\.com\/find\/caterpillar-966'/g, 
  `url: 'https://www.mylittlesalesman.com/find/caterpillar'`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.machinio\.com\/cat-equipment\?search=966'/g, 
  `url: 'https://www.machinio.com/cat-equipment'`
);

fs.writeFileSync(storePath, storeContent, 'utf8');
console.log('Fixed generic URLs in store.ts to point to actual search pages.');
