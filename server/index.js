import 'dotenv/config';
import { createApp } from './app.js';
import { readConfig } from './config.js';
try {
  const config = readConfig();
  createApp(config).listen(config.port, () => console.log(`Async Weather Tracker ready at http://localhost:${config.port}`));
} catch (error) { console.error(error.message); process.exitCode = 1; }
