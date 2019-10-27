import express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as playgroundController from '../controllers/playground.controller';

const router = express.Router();

/* Playground Routes **********************************************************/

// Throw test error
router.get('/throw', playgroundController.throwError);
router.get('/throw/:status', playgroundController.throwError);

// Test Items
router.get('/items', playgroundController.getItems);
router.get('/items/:id', playgroundController.getItem);
router.post('/items', playgroundController.createItem);
router.put('/items/:id', playgroundController.updateItem);
router.delete('/items/:id', playgroundController.deleteItem);

/******************************************************************************/
export default router;
