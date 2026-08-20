const https = require('https');
const cheerio = require('cheerio'); // We have cheerio installed

function search(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  const html = await search('site:machinerytrader.com "Caterpillar 966" "For Sale"');
  const $ = cheerio.load(html);
  const results = [];
  
  $('.result').each((i, el) => {
    const title = $(el).find('.result__title').text().trim();
    const snippet = $(el).find('.result__snippet').text().trim();
    const href = $(el).find('.result__url').attr('href');
    
    // Extract real URL from duckduckgo redirect
    let url = href;
    if (url && url.includes('uddg=')) {
      const match = url.match(/uddg=([^&]+)/);
      if (match) {
        url = decodeURIComponent(match[1]);
      }
    }
    
    if (url && url.includes('machinerytrader.com')) {
      results.push({ title, snippet, url });
    }
  });
  
  console.log(JSON.stringify(results, null, 2));
})();
