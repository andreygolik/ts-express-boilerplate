import express from 'express';

import { register, login, getMe, forgotPassword } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

/* Auth Routes ****************************************************************/

router.post('/register', register);             // Register user
router.post('/login', login);                   // Login user
router.get('/me', protect, getMe);              // Get current logged user
router.post('/forgotpassword', forgotPassword); // Send forgot password email

/******************************************************************************/
export default router;
