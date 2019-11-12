import express from 'express';

import {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth';
import { ALLOW_REGISTRATION } from '../config/config';

const router = express.Router();

/* Auth Routes ************************************************************* */

router.post('/login', login); // Login user
router.get('/logout', logout); // Logout user / clear cookie
router.get('/me', protect, getMe); // Get current logged user
router.put('/updatedetails', protect, updateDetails); // Update user details
router.put('/updatepassword', protect, updatePassword); // Update password
router.post('/forgotpassword', forgotPassword); // Send forgot password email
router.put('/resetpassword/:token', resetPassword); // Reset password

if (ALLOW_REGISTRATION) {
  router.post('/register', register); // Register new user
}

/* ************************************************************************* */
export default router;
