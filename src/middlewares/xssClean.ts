// Inspired by https://github.com/jsonmaur/xss-clean

import { Request, Response, NextFunction } from 'express';
import { inHTMLData } from 'xss-filters';

const xssClean = () => (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = clean(req.body);
  }

  if (req.query) {
    req.query = clean(req.query);
  }

  if (req.params) {
    req.params = clean(req.params);
  }

  next();
};

/**
 * Clean for xss.
 * @param {string/object} data - The value to sanitize
 * @return {string/object} The sanitized value
 */
const clean = (data: any = '') => {
  let isObject = false;
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = inHTMLData(data).trim();
  if (isObject) {
    data = JSON.parse(data);
  }

  return data;
};

export default xssClean;
