import express from 'express';

import * as playgroundController from '../controllers/playground.controller';
import advancedResults from '../middlewares/advancedResults';
import { PlaygroundItemModel } from '../models/PlaygroundItem';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

/* Playground Routes **********************************************************/

// Throw test error
router.get('/throw', playgroundController.throwError);
router.get('/throw/:status', playgroundController.throwError);

// Test Items
router.route('/items')
  .get(advancedResults(PlaygroundItemModel), playgroundController.getItems)
  .post(protect, authorize('owner', 'admin'), playgroundController.createItem);
router.route('/items/:id')
  .get(playgroundController.getItem)
  .put(protect, authorize('owner', 'admin'), playgroundController.updateItem)
  .delete(protect, authorize('owner', 'admin'), playgroundController.deleteItem);

/******************************************************************************/
export default router;
