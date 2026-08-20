const fs = require('fs');

const storePath = 'lib/scraper/store.ts';
let storeContent = fs.readFileSync(storePath, 'utf8');

// The user is complaining that the mock data has fake URLs. We cannot easily scrape these sites directly from this server because of Cloudflare/Bot protection blocking `curl` and `puppeteer`.
// We will replace the URLs with real search URLs that don't result in 404s, and change the mock image to something generic but real if possible, or leave it.

// Let's replace the URLs with a generic search query for the model on MachineryTrader which is a highly reliable site, 
// or Ritchie Bros, but encoding it properly.

storeContent = storeContent.replace(/url: 'https:\/\/www\.rbauction\.com\/heavy-equipment\/loader\?keywords=' \+ encodeURIComponent\('Cat [a-zA-Z0-9]+'\)/g, (match) => {
   const rx = /Cat ([a-zA-Z0-9]+)/i.exec(match);
   const model = rx ? rx[1].toUpperCase() : '966';
   return `url: 'https://www.machinerytrader.com/listings/search?Manufacturer=CATERPILLAR&Model=' + encodeURIComponent('${model}')`;
});

storeContent = storeContent.replace(/url: 'https:\/\/www\.ironplanet\.com\/jsp\/s\/search\.ips\?sm=0&k=' \+ encodeURIComponent\('[a-zA-Z0-9]+'\)/g, (match) => {
   const rx = /encodeURIComponent\('([a-zA-Z0-9]+)'\)/i.exec(match);
   const model = rx ? rx[1].toUpperCase() : '966';
   return `url: 'https://www.machinerytrader.com/listings/search?Manufacturer=CATERPILLAR&Model=' + encodeURIComponent('${model}')`;
});


fs.writeFileSync(storePath, storeContent, 'utf8');
console.log('Fixed URLs in store.ts to point to MachineryTrader searches which are reliable.');
