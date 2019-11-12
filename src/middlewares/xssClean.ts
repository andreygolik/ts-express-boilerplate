import { Request, Response, NextFunction } from 'express';
import { inHTMLData } from 'xss-filters';

const cleanObject = (data: object) => {
  if (typeof data !== 'object') {
    return {};
  }

  let json = JSON.stringify(data);
  json = inHTMLData(json).trim();

  return JSON.parse(json);
};

const clean = (data: object | string = '') => (typeof data === 'object' ? cleanObject(data) : inHTMLData(data).trim());

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

  return next();
};

export default xssClean;
