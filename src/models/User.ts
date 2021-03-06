import { Document, Schema, Model, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { JWT_SECRET, JWT_EXPIRE } from '../config/config';

export interface UserDocument extends Document {
  email: string;
  name: string;
  role: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

export interface User extends UserDocument {
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): Promise<string>;
  clearResetPasswordToken(): boolean;
}

export const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(this: User, next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(): string {
  return jwt.sign({ id: this.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

export const RESET_TOKEN_LENGTH = 32;

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = async function(): Promise<string> {
  // Generate token
  const resetToken = crypto.randomBytes(RESET_TOKEN_LENGTH).toString('hex');

  // Hash token and save it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15min

  return resetToken;
};

// Remove password reset token
UserSchema.methods.clearResetPasswordToken = function(): boolean {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpire = undefined;

  return true;
};

export const UserModel: Model<User> = model<UserDocument, Model<User>>('User', UserSchema);
