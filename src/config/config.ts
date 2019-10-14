import dotenv from 'dotenv';
import fs from 'fs';

import log from './logger';
import { setConsoleLogLevel } from './logger';

if (fs.existsSync('.env')) {
  log.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else if (fs.existsSync('.env.example')) {
  log.warn('Using .env.example file to supply config environment variables');
  dotenv.config({ path: '.env.example' });
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

if (prod) {
  setConsoleLogLevel('warn');
}

export const PORT = process.env.NODE_PORT || 3000;

export const { POSTGRES_URI } = process.env;
if (!POSTGRES_URI) {
  log.error('No postgres connection string. Set POSTGRES_URI environment variable.');
  process.exit(1);
}
