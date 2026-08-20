const https = require('https');
const cheerio = require('cheerio');

https.get('https://www.purplewave.com/search/loader', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const links = [];
    $('a').each((i, el) => {
       const href = $(el).attr('href');
       if (href && href.includes('/auction/')) {
          links.push(href);
       }
    });
    console.log(Array.from(new Set(links)));
  });
}).on('error', console.error);
