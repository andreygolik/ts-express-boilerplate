import express from 'express';

import * as indexController from './controllers/index.controller';

const router = express.Router();

/* Index Routes ***************************************************************/

// Index page
router.get('/', indexController.index);

// Home page
router.get('/home', indexController.home);

/******************************************************************************/
export default router;
