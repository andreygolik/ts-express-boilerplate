"use strict";

import * as winston from "winston";

// winston.emitErrs = true;

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: "debug",
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: false,
      json: false,
      colorize: "all",
    }),
    new (winston.transports.File)({
      name: "debug-file",
      level: "debug",
      filename: "./logs/debug.log",
      maxSize: 1000000,
      maxFiles: 10,
      tailable: true,
      zippedArchive: false,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
      json: false,
      colorize: false,
    }),
    new (winston.transports.File)({
      name: "info-file",
      level: "info",
      filename: "./logs/info.log",
      maxSize: 1000000,
      maxFiles: 10,
      tailable: true,
      zippedArchive: false,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
      json: false,
      colorize: false,
    }),
    new (winston.transports.File)({
      name: "error-file",
      level: "error",
      filename: "./logs/error.log",
      maxSize: 1000000,
      maxFiles: 10,
      tailable: true,
      zippedArchive: false,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
      json: false,
      colorize: false
    }),
  ],
  exitOnError: false,
});
