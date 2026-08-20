const https = require('https');

https.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent('site:machinerytrader.com "Caterpillar 966" "For Sale"')}`, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', console.error);
