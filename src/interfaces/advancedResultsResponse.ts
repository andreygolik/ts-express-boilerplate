import { Response } from 'express';

interface IAdvancedResultsResponse extends Response {
  advancedResults: {
    success: boolean;
    count: number;
    pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    };
    data: any;
  };
}

export default IAdvancedResultsResponse;
