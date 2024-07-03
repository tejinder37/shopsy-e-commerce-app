import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/cartModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { product, name, qty, price, image } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const existItem = cart.cartItems.find(
      (x) => x.product.toString() === product
    );

    if (existItem) {
      existItem.qty = qty;
    } else {
      const newItem = {
        product,
        name,
        qty,
        price,
        image,
      };
      cart.cartItems.push(newItem);
    }

    await cart.save();
    res.status(201).json(cart);
  } else {
    const cart = new Cart({
      user: req.user._id,
      cartItems: [{ product, name, qty, price, image }],
    });

    await cart.save();
    res.status(201).json(cart);
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.cartItems = cart.cartItems.filter(
      (x) => x.product.toString() !== req.params.id
    );

    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});
export { getCart, addItemToCart, removeItemFromCart };
