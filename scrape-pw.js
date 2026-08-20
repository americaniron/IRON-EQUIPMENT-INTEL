const https = require('https');
const cheerio = require('cheerio');

https.get('https://www.purplewave.com/search/wheel%20loader', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const listings = [];
    $('.pw-result').each((i, el) => {
       const url = 'https://www.purplewave.com' + $(el).find('a.btn-block').attr('href');
       const title = $(el).find('h4').text().trim();
       const image = $(el).find('img').attr('src');
       if(url && title) {
          listings.push({title, url, image});
       }
    });
    console.log(JSON.stringify(listings, null, 2));
  });
}).on('error', console.error);
