import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import ErrorResponse from '../shared/ErrorResponse';

/*
ATTENTION
This middleware is not ready for production
and provided as an example only.
Possibly contains bugs and vulnerabilities.
*/

const advancedResults = (model: mongoose.Model<any, any>, populate?: string | false) =>
  async (req: Request, res: any, next: NextFunction) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc.)
    // example: /items?rate[gte]=5
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    // Select fields
    // example: /items?select=name,description
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    // example: /items?limit=5&page=2
    const limit = parseInt(req.query.limit, 10);
    if (req.query.limit && ! (limit > 0)) {
      return next(new ErrorResponse('Incorrect limit value', 400));
    }

    let page;
    let startIndex;
    let endIndex;
    let total;

    if (limit) {
      page = (req.query.page === undefined) ? 1 : parseInt(req.query.page, 10);
      if (! (page > 0)) {
        return next(new ErrorResponse('Incorrect page number', 400));
      }

      startIndex = (page - 1) * limit;
      endIndex = page * limit;
      total = await model.countDocuments();

      query = query.skip(startIndex).limit(limit);
    }

    // Populate
    if (populate) {
      query = query.populate(populate);
    }

    // Executing query
    const results = await query;

    // Pagination result
    const pagination: {
      next?: { page: number, limit: number },
      prev?: { page: number, limit: number },
    } = {};

    if (limit) {
      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        }
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        }
      }
    }

    // Response
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };

export default advancedResults;
