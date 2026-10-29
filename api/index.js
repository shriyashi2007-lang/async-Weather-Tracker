import { createApp } from '../server/app.js';
import { readConfig } from '../server/config.js';
export default createApp(readConfig());
