import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import cron from 'node-cron';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });

  // Setup Scheduler (Scheduler runs in this process)
  console.log('Initializing IRON INTEL Scheduler...');
  
  // Scans run 4 times daily: 12 AM, 6 AM, 12 PM, 6 PM New York time
  cron.schedule('0 0,6,12,18 * * *', async () => {
    console.log('[Scheduler] Running scheduled scans (0,6,12,18)');
    // Since we are running within the server, we can hit our own API route to trigger the background job
    // This allows the job to run in Next's API context, having access to env variables and DB easily.
    try {
      const res = await fetch(`http://${hostname}:${port}/api/cron/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'schedule' })
      });
      console.log('[Scheduler] Scan triggered. Response:', res.status);
    } catch (err) {
      console.error('[Scheduler] Failed to trigger scan:', err);
    }
  }, {
    timezone: "America/New_York"
  });
});
