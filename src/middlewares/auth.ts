import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import asyncHandler from './asyncHandler';
import ErrorResponse from '../shared/ErrorResponse';
import { UserModel, IUser } from '../models/User';
import IRequest from '../interfaces/request';
import { JWT_SECRET, JWT_COOKIE } from '../config/config';

// Protect routes
export const protect = asyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('JWT ')) {
    token = req.headers.authorization.split(' ')[1];
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
    const decoded: any = jwt.verify(token, JWT_SECRET);

    req.user = await UserModel.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized', 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return next(new ErrorResponse(`User role '${role}' is not authorized to access this resource`, 403));
    }
    next();
  };
};
