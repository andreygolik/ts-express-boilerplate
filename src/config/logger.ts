import * as winston from 'winston';
import { format } from 'winston';

const default_level = 'verbose';
const default_console_level = 'debug';

const transports = {
  console: new winston.transports.Console({
    level: default_console_level,
    // Override file format (colorized, no timestamp)
    format: format.combine(
      format.colorize(),
      format.printf((info) => `${info.level}: ${info.message}`),
    ),
  }),
  combined: new winston.transports.File({
    filename: './logs/combined.log',
  }),
  error: new winston.transports.File({
    level: 'error',
    filename: './logs/error.log',
  }),
  exceptions: new winston.transports.File({
    filename: './logs/exceptions.log',
  }),
}

const logger = winston.createLogger({
  level: default_level,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    transports.console,
    transports.combined,
    transports.error,
  ],
  exceptionHandlers: [
    transports.exceptions,
  ],
  exitOnError: false,
});

export default logger;

export const setConsoleLogLevel = (level: string) => {
  transports.console.level = level;
};
