import { Request, Response } from 'express';

/**
 * GET /
 * Index page.
 */
export const index = (req: Request, res: Response) => {
  res.render('index', { title: 'Index Page'});
};

/**
 * GET /home
 * Home page.
 */
export const home = (req: Request, res: Response) => {
  res.render('home', { title: 'Home Page'});
};
