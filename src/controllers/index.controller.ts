import { Request, Response } from 'express';

// @desc    Index page
// @route   GET /
// @access  Public
export const index = (req: Request, res: Response) => {
  res.render('index', { title: 'Index Page' });
};

// @desc    Home page
// @route   GET /home
// @access  Private
export const home = (req: Request, res: Response) => {
  res.render('home', { title: 'Home Page' });
};
