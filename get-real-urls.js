const https = require('https');

function search(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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
  const urls = [];
  const regex = /href="\/\/duckduckgo.com\/l\/\?uddg=([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = decodeURIComponent(match[1]);
    if (url.includes('machinerytrader.com')) urls.push(url);
  }
  console.log(urls);
})();
