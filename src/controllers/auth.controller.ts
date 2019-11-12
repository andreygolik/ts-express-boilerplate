import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

import asyncHandler from '../middlewares/asyncHandler';
import ErrorResponse from '../shared/ErrorResponse';
import IRequest from '../interfaces/request';
import { IUser, UserModel } from '../models/User';
import { sendEmail, IEmailOptions } from '../utils/sendEmail';
import { JWT_COOKIE_EXPIRE, ENVIRONMENT, JWT_COOKIE } from '../config/config';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user: IUser = await UserModel.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user: IUser = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log out user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: IRequest, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get current logged user
// @route   POST /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: IRequest, res: Response) => {
  const user = await UserModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
export const updateDetails = asyncHandler(async (req: IRequest, res: Response) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await UserModel.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword && !newPassword) {
    return next(new ErrorResponse('Please provide currentPassword and newPassword', 400));
  }

  const user = await UserModel.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("Can't find that email, sorry.", 404));
  }

  // Get reset token
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset Link
  const resetLink = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const emailOptions: IEmailOptions = {
    email: user.email,
    subject: 'Password Reset Link',
    message: `Please make a PUT request with password to: ${resetLink}`,
  };

  try {
    await sendEmail(emailOptions);

    res.status(200).json({
      success: true,
      data: 'Email sent',
    });
  } catch (_) {
    user.clearResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password with token
// @route   GET /api/v1/auth/resetpassword/:token
// @access  Public
export const resetPassword = asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
  // Ignore short tokens (for extra security)
  if (!req.params.token || req.params.token.length < 32) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  // Hash received token before comparing
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user: IUser = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  if (!req.body.password) {
    return next(new ErrorResponse('Please provide password', 400));
  }

  user.password = req.body.password;
  user.clearResetPasswordToken();
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      message: 'password updated',
    },
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Send JWT cookie (if enabled)
  if (JWT_COOKIE) {
    const expiresMs = +JWT_COOKIE_EXPIRE ? +JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 : 0;
    const options = {
      expires: new Date(Date.now() + expiresMs),
      httpOnly: true,
      secure: true,
    };

    // Allow http in development
    if (ENVIRONMENT === 'development') {
      options.secure = false;
    }

    res.cookie('token', token, options);
  }

  res.status(statusCode).json({
    success: true,
    token,
  });
};
