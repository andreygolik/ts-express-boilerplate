import express from 'express';

import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/users.controller';
import { protect, authorize } from '../middlewares/auth';
import advancedResults from '../middlewares/advancedResults';
import { UserModel } from '../models/User';

const router = express.Router();

/* Users Routes ************************************************************ */

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(UserModel), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

/* ************************************************************************* */
export default router;
