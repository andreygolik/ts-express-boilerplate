import express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as playgroundController from '../controllers/playground.controller';
import advancedResults from '../middlewares/advancedResults';
import PlaygroundItem from '../models/PlaygroundItem';

const router = express.Router();

/* Playground Routes **********************************************************/

// Throw test error
router.get('/throw', playgroundController.throwError);
router.get('/throw/:status', playgroundController.throwError);

// Test Items
router.route('/items')
  .get(advancedResults(PlaygroundItem), playgroundController.getItems)
  .post(playgroundController.createItem);
router.route('/items/:id')
  .get(playgroundController.getItem)
  .put(playgroundController.updateItem)
  .delete(playgroundController.deleteItem);

/******************************************************************************/
export default router;
