const https = require('https');

https.get('https://html.duckduckgo.com/html/?q=' + encodeURIComponent('site:machinerytrader.com "Caterpillar 966"'), {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = [];
    const regex = /href="\/\/duckduckgo.com\/l\/\?uddg=([^"]+)"/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      urls.push(decodeURIComponent(match[1]));
    }
    console.log(Array.from(new Set(urls.filter(u => u.includes('machinerytrader.com')))).slice(0, 5));
  });
}).on('error', console.error);
