const fs = require('fs');

const storePath = 'lib/scraper/orchestrator.ts';
let storeContent = fs.readFileSync(storePath, 'utf8');

// I am modifying the orchestrator to not override the store with mock data.
storeContent = storeContent.replace(/const MOCK_MODE_ENABLED = true;/g, 'const MOCK_MODE_ENABLED = false;');

fs.writeFileSync(storePath, storeContent, 'utf8');
