import express from 'express';

import { register, login, getMe } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

/* Auth Routes ****************************************************************/

router.post('/register', register); // Register user
router.post('/login', login);       // Login user
router.get('/me', protect, getMe);           // Get current logged user

/******************************************************************************/
export default router;
