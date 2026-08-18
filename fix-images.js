const fs = require('fs');
let code = fs.readFileSync('lib/scraper/store.ts', 'utf8');

code = code.replace(/1541888946425-d0fbb18086f6/g, '1579829366248-204fe8413f31');
code = code.replace(/1508873696983-2df5293cb32b/g, '1581092160607-ee22621dd758');
code = code.replace(/1581092335397-9583fe92d232/g, '1578328819058-b69f3a3b0f6b');

fs.writeFileSync('lib/scraper/store.ts', code);
