import { Request, Response, NextFunction } from 'express';

import ErrorResponse from '../shared/ErrorResponse';
import logger from '../config/logger';

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate field
  if (err.code === 11000) {
    const message = 'Duplicate field value';
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values((<any>err).errors)
      .map((val: any) => val.message)
      .toString();
    error = new ErrorResponse(message, 400);
  }

  // Default status 500 (if not provided or invalid)
  if (!+error.statusCode || error.statusCode < 200 || error.statusCode > 999) {
    error.statusCode = 500;
  }

  // For server errors
  if (error.statusCode >= 500) {
    if (process.env.NODE_ENV === 'development') {
      // Log and provide the stack in development
      logger.debug(err.stack);
      error.stack = err.stack;
    } else {
      // Hide details if not in development
      error.message = 'Server Error';
    }
  }

  // Response
  res.status(error.statusCode);

  res.format({
    json: () => {
      res.json({
        success: false,
        status: error.statusCode,
        error: error.message,
        stack: error.stack,
      });
    },
    html: () => {
      res.locals.error = error;
      res.render('error');
    },
    default: () => {
      res.type('text').send(error.message);
    },
  });
};

export default errorHandler;
