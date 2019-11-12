import * as winston from 'winston';
import { format } from 'winston';

const prod = process.env.NODE_ENV === 'production';
const default_level = prod ? 'verbose' : 'debug';
const default_console_level = prod ? 'error' : 'debug';

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => {
    const message = typeof info.message === 'object' ? JSON.stringify(info.message) : info.message;
    return `${info.timestamp} ${info.level}: ${message}`;
  })
);

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => {
    const message = typeof info.message === 'object' ? JSON.stringify(info.message) : info.message;
    return prod ? `${info.timestamp} ${info.level}: ${message}` : `${info.level}: ${message}`;
  })
);

const transports = {
  console: new winston.transports.Console({
    level: default_console_level,
    format: consoleFormat,
  }),
  combined: new winston.transports.File({
    filename: './logs/combined.log',
  }),
  error: new winston.transports.File({
    level: 'error',
    filename: './logs/error.log',
  }),
  // exceptions: new winston.transports.File({
  //   level: 'error',
  //   filename: './logs/exceptions.log',
  // }),
};

const options: winston.LoggerOptions = {
  level: default_level,
  format: fileFormat,
  transports: [transports.console, transports.combined, transports.error],
  exceptionHandlers: [
    transports.console,
    transports.combined,
    transports.error,
    // transports.exceptions,
  ],
  exitOnError: false,
};

const logger = winston.createLogger(options);

export default logger;
