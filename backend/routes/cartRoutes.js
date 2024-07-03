import express from 'express';
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addItemToCart);
router.route('/:id').delete(protect, removeItemFromCart);

export default router;
