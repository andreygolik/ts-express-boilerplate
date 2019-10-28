import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import asyncHandler from '../middlewares/asyncHandler';
import ErrorResponse from '../shared/ErrorResponse';
import { IUser, UserModel } from '../models/User';
import { JWT_COOKIE_EXPIRE, ENVIRONMENT } from '../config/config';

// Get token from model, create cookie and send response
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  // Create token
  const token = user.getSignedJwtToken();

  const expiresMs = +JWT_COOKIE_EXPIRE ? +JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 : 0;
  const options = {
    expires: new Date(Date.now() + expiresMs),
    httpOnly: true,
    secure: true
  }

  // Allow http in development
  if (ENVIRONMENT === 'development') {
    options.secure = false;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
}

// @desc    Register user
// @route   POST /api/v1/register
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
// @route   POST /api/v1/login
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
