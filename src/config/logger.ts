import winston, { format } from 'winston';

const prod = process.env.NODE_ENV === 'production';
const defaultLevel = prod ? 'verbose' : 'debug';
const defaultConsoleLevel = prod ? 'error' : 'debug';

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
    level: defaultConsoleLevel,
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
  level: defaultLevel,
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
