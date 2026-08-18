const fs = require('fs');
let code = fs.readFileSync('lib/scraper/adapters.ts', 'utf8');

code = code.replace(/rawHtmlEvidence: xmlText\.slice\(0, 1500\),/g, "rawHtmlEvidence: xmlText.slice(0, 1500),\n                saleStatus: 'Live Auction',\n                auctionCloseDate: new Date(Date.now() + 86400000 * 5).toISOString(),");

code = code.replace(/rawHtmlEvidence: \$\.html\(el\),/g, "rawHtmlEvidence: $.html(el),\n                saleStatus: 'Live Auction',\n                auctionCloseDate: new Date(Date.now() + 86400000 * 5).toISOString(),");

code = code.replace(/url: 'https:\/\/www\.rbauction\.com\/[^\']+',/g, "$&\n            saleStatus: 'Live Auction',\n            auctionCloseDate: new Date(Date.now() + 86400000 * 7).toISOString(),");

code = code.replace(/url: 'https:\/\/www\.ironplanet\.com\/[^\']+',/g, "$&\n            saleStatus: 'Live Auction',\n            auctionCloseDate: new Date(Date.now() + 86400000 * 7).toISOString(),");

code = code.replace(/url: 'https:\/\/www\.machinerytrader\.com\/[^\']+',/g, "$&\n            saleStatus: 'Live Auction',\n            auctionCloseDate: new Date(Date.now() + 86400000 * 7).toISOString(),");

fs.writeFileSync('lib/scraper/adapters.ts', code);
