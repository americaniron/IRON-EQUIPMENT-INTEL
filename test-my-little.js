const https = require('https');

https.get('https://www.mylittlesalesman.com/caterpillar-wheel-loaders-for-sale-c65', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = [];
    const regex = /href="(\/[^"]+-wheel-loader-[^"]+)"/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      urls.push('https://www.mylittlesalesman.com' + match[1]);
    }
    console.log(Array.from(new Set(urls)));
  });
}).on('error', console.error);
