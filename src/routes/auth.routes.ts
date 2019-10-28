import express from 'express';
import { Request, Response, NextFunction } from 'express';

import { register, login } from '../controllers/auth.controller';

const router = express.Router();

/* Auth Routes ****************************************************************/

// Register user
router.post('/register', register);
// Login user
router.post('/login', login);

/******************************************************************************/
export default router;
