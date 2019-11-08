import express from 'express';

import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

/* Auth Routes ****************************************************************/

router.post('/register', register); // Register user
router.post('/login', login); // Login user
router.get('/me', protect, getMe); // Get current logged user
router.put('/updatedetails', protect, updateDetails); // Update user details
router.put('/updatepassword', protect, updatePassword); // Update password
router.post('/forgotpassword', forgotPassword); // Send forgot password email
router.put('/resetpassword/:token', resetPassword); // Reset password

/******************************************************************************/
export default router;
