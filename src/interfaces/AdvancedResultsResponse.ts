/* eslint semi: 0 */

import { Response } from 'express';

export default interface AdvancedResultsResponse extends Response {
  advancedResults: {
    success: boolean;
    count: number;
    pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    };
    data: object;
  };
}
