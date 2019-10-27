import { Request, Response, NextFunction } from 'express';

import asyncHandler from '../middlewares/asyncHandler';
import ErrorResponse from '../shared/ErrorResponse';
import PlaygroundItem from '../models/PlaygroundItem';

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

// @desc    Get all items
// @route   GET /playground/items
// @access  Public
export const getItems = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const items = await PlaygroundItem.find();

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

// @desc    Get single item
// @route   GET /playground/items/:id
// @access  Public
export const getItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const item = await PlaygroundItem.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with ID of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Create new item
// @route   POST /playground/items
// @access  Public
export const createItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const item = await PlaygroundItem.create(req.body);

  res.status(201).json({
    success: true,
    date: item,
  });
});

// @desc    Update item
// @route   PATCH /playground/items/:id
// @access  Public
export const updateItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const item = await PlaygroundItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    return next(new ErrorResponse(`Item not found with ID of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Delete item
// @route   DELETE /playground/items/:id
// @access  Public
export const deleteItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const item = await PlaygroundItem.findByIdAndDelete(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with ID of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});
