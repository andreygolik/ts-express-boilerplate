import express from 'express';
import { Request, Response, NextFunction } from 'express';

import { register } from '../controllers/auth.controller';

const router = express.Router();

/* Auth Routes ****************************************************************/

// Register user
router.post('/register', register);


/******************************************************************************/
export default router;
