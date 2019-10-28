import express from 'express';
import { Request, Response, NextFunction } from 'express';

import { index, home } from '../controllers/index.controller';

const router = express.Router();

/* Index Routes ***************************************************************/

// Index page
router.get('/', index);

// Home page
router.get('/home', home);

/******************************************************************************/
export default router;
