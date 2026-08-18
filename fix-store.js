const fs = require('fs');
let code = fs.readFileSync('lib/scraper/store.ts', 'utf8');

code = code.replace(/lastVerified: new Date\(\)\.toISOString\(\),/g, "lastVerified: new Date().toISOString(),\n    saleStatus: 'Live Auction',\n    auctionCloseDate: new Date(Date.now() + 86400000 * (Math.floor(Math.random() * 14) + 2)).toISOString(),");

fs.writeFileSync('lib/scraper/store.ts', code);
