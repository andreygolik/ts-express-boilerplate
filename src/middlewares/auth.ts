import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

import asyncHandler from './asyncHandler';
import ErrorResponse from '../shared/ErrorResponse';
import { UserModel } from '../models/User';
import UserRequest from '../interfaces/UserRequest';
import { JWT_SECRET, JWT_COOKIE } from '../config/config';

// Protect routes
export const protect = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('JWT ')) {
    token = req.headers.authorization.slice(4);
  } else if (JWT_COOKIE && req.cookies) {
    token = req.cookies.token;
  }

  try {
    // Make sure token exists
    if (!token) {
      // delegate the catch to generate a default error
      throw new Error();
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== 'object') {
      throw new Error();
    }

    const { id } = decoded as { id?: string };

    req.user = await UserModel.findById(id);

    return next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized', 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return next(new ErrorResponse(`User role '${role}' is not authorized to access this resource`, 403));
    }
    return next();
  };
};
