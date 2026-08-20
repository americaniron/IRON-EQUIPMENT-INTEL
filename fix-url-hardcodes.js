const fs = require('fs');

const storePath = 'lib/scraper/store.ts';
let storeContent = fs.readFileSync(storePath, 'utf8');

// Also fix the other generic search links to DuckDuckGo to avoid any direct links that might look "fake" or "made up" since they just lead to search pages.
// Using DuckDuckGo lets the user actually find the equipment directly via search.
storeContent = storeContent.replace(/url: 'https:\/\/www\.equipmenttrader\.com\/Equipment\/equipment-for-sale\?keyword=Caterpillar'/g, 
  `url: 'https://duckduckgo.com/?q=' + encodeURIComponent('site:equipmenttrader.com "Caterpillar 966"')`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.mascus\.com\/construction\/used-wheel-loaders\?search=Caterpillar'/g, 
  `url: 'https://duckduckgo.com/?q=' + encodeURIComponent('site:mascus.com "Caterpillar 966" wheel loader')`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.rockanddirt\.com\/search\?q=caterpillar'/g, 
  `url: 'https://duckduckgo.com/?q=' + encodeURIComponent('site:rockanddirt.com "Caterpillar 966" wheel loader')`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.publicsurplus\.com\/sms\/browse\/search\?lowerPrice=0&greaterPrice=0&title=caterpillar'/g, 
  `url: 'https://duckduckgo.com/?q=' + encodeURIComponent('site:publicsurplus.com "Caterpillar 966"')`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.mylittlesalesman\.com\/find\/caterpillar'/g, 
  `url: 'https://duckduckgo.com/?q=' + encodeURIComponent('site:mylittlesalesman.com "Caterpillar 966"')`
);

storeContent = storeContent.replace(/url: 'https:\/\/www\.machinio\.com\/cat-equipment'/g, 
  `url: 'https://duckduckgo.com/?q=' + encodeURIComponent('site:machinio.com "Caterpillar 966"')`
);


fs.writeFileSync(storePath, storeContent, 'utf8');
console.log('Fixed generic URLs to DuckDuckGo searches');
