import express from 'express';

import { index, home } from '../controllers/index.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

/* Index Routes ************************************************************ */

// Index page
router.get('/', index);

// Home page
router.get('/home', protect, home);

/* ************************************************************************* */
export default router;
