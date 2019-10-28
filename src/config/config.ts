import dotenv from 'dotenv';
import fs from 'fs';

import logger from './logger';

if (fs.existsSync('.env')) {
  logger.info('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else if (fs.existsSync('.env.example')) {
  logger.warn('Using .env.example file to supply config environment variables');
  dotenv.config({ path: '.env.example' });
}

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const PORT = process.env.NODE_PORT || 3000;

export const APP_NAME = process.env.NODE_APP_NAME || 'Server';

export const CORS = process.env.NODE_ALLOW_CORS === 'true';

// export const { POSTGRES_URI } = process.env;
// if (!POSTGRES_URI) {
//   logger.error('No postgres connection string. Set POSTGRES_URI environment variable.');
//   process.exit(1);
// }

export const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  logger.error('No mongo connection string. Set MONGO_URI environment variable.');
  process.exit(1);
}

export const { JWT_SECRET, JWT_EXPIRE, JWT_COOKIE_EXPIRE } = process.env;
if (! JWT_SECRET || JWT_SECRET.length < 16) {
  logger.error('Bad JWT_SECRET environment variable.');
  process.exit(2);
}
