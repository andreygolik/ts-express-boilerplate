import { Request, Response, NextFunction } from 'express';

import asyncHandler from '../middlewares/asyncHandler';
import ErrorResponse from '../shared/ErrorResponse';
import { PlaygroundItemModel } from '../models/PlaygroundItem';
import AdvancedResultsResponse from '../interfaces/AdvancedResultsResponse';

// @desc    Throw Test Error
// @route   GET /playground/throw
// @access  Public
export const throwError = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.params;
    if (+status > 0) {
      throw new ErrorResponse('Test Error', +status);
    } else {
      throw new Error('Test Error');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Echo Request
// @route   ANY /playground/echo
// @access  Public
export const echo = (req: Request, res: Response) => {
  const payload = {
    method: req.method,
    headers: req.headers,
    params: req.params,
    body: req.body,
    cookies: req.cookies,
    path: req.path,
    query: req.query,
    hostname: req.hostname,
    ip: req.ip,
  };

  res.status(200).json(payload);
};

// @desc    Get all items
// @route   GET /playground/items
// @access  Public
export const getItems = asyncHandler(async (req: Request, res: AdvancedResultsResponse) => {
  await PlaygroundItemModel.find();
  return res.status(200).json(res.advancedResults);
});

// @desc    Get single item
// @route   GET /playground/items/:id
// @access  Public
export const getItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const item = await PlaygroundItemModel.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with ID of ${req.params.id}`, 404));
  }

  return res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Create new item
// @route   POST /playground/items
// @access  Public
export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await PlaygroundItemModel.create(req.body);

  return res.status(201).json({
    success: true,
    date: item,
  });
});

// @desc    Update item
// @route   PATCH /playground/items/:id
// @access  Public
export const updateItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const item = await PlaygroundItemModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    return next(new ErrorResponse(`Item not found with ID of ${req.params.id}`, 404));
  }

  return res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Delete item
// @route   DELETE /playground/items/:id
// @access  Public
export const deleteItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const item = await PlaygroundItemModel.findByIdAndDelete(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with ID of ${req.params.id}`, 404));
  }

  return res.status(200).json({
    success: true,
    data: item,
  });
});
