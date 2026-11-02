const express = require("express");
const router = express.Router();
const {getCart, addToCart, updateCartItem, removeCartItem, clearCart} = require("../controllers/cartcontrollers");
const {protect} = require("../middleware/authmiddleware");
const validateObjectId = require("../middleware/validateobjectId");

router.get("/", protect, getCart);
router.post("/items", protect, addToCart);
router.patch("/items/:foodItemId", protect, validateObjectId("foodItemId"), updateCartItem);
router.delete("/items/:foodItemId", protect, validateObjectId("foodItemId"), removeCartItem);
router.delete("/items", protect, clearCart);

module.exports = router;