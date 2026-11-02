const Cart = require("../models/cart");
const FoodItem = require("../models/fooditem");

const getCart = async (req, res) => {
    try{
        let cart = await Cart.findOne({user: req.user._id}).populate("items.foodItem", "name price imageUrl isAvailable");
        if (!cart) {
            cart = await Cart.create({user: req.user._id, items: []});
        }
        const totalAmount = cart.items.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0);
        res.status(200).json({message: "Cart retrieved successfully", cart, totalAmount});
    }catch(error){
        res.status(500).json({message: "Failed to retrieve cart"});
    }
};

const addToCart = async (req, res) => {
    try{
        const { foodItemId, quantity } = req.body;
        if(!foodItemId || !quantity || quantity < 1){
            return res.status(400).json({message: "Food item ID and quantity are required, and quantity must be at least 1"});
        }
        const foodItem = await FoodItem.findById(foodItemId);
        if(!foodItem){
            return res.status(404).json({message: "Food item not found"});
        }
        if(!foodItem.isAvailable){
            return res.status(400).json({message: "Food item is not available"});
        }
        let cart = await Cart.findOne({user: req.user._id});
        if(!cart){
            cart = await Cart.create({user: req.user._id, items: []});
        }
        const existingItem= cart.items.find(item => item.foodItem.toString() === foodItemId);
        if(existingItem){
            existingItem.quantity += quantity;
        } else {
            cart.items.push({foodItem: foodItemId, quantity});
        }
        await cart.save();
        await cart.populate("items.foodItem", "name price imageUrl isAvailable");
        const totalAmount = cart.items.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0);
        res.status(200).json({message: "Item added to cart successfully", cart, totalAmount});
    }catch(error){
        res.status(500).json({message: "Failed to add item to cart"});
    };
};

const updateCartItem = async (req, res) => {
    try{
        const {quantity } = req.body;
        const { foodItemId } = req.params;
        if(!quantity || quantity < 1){
            return res.status(400).json({message: "Quantity is required and must be at least 1"});
        }
        const cart = await Cart.findOne({user: req.user._id});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        const item = cart.items.find(item => item.foodItem.toString() === foodItemId);
        if(!item){
            return res.status(404).json({message: "Item not found in cart"});
        }
        item.quantity = quantity;
        await cart.save();
        await cart.populate("items.foodItem", "name price imageUrl isAvailable");
        const totalAmount = cart.items.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0);
        res.status(200).json({message: "Cart item updated successfully", cart, totalAmount});
    }catch(error){
        res.status(500).json({message: "Failed to update cart item"});
    }
};

const removeCartItem = async (req, res) => {
    try{
        const { foodItemId } = req.params;
        const cart = await Cart.findOne({user: req.user._id});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.foodItem.toString() !== foodItemId);
        if(cart.items.length === initialLength){
            return res.status(404).json({message: "Item not found in cart"});
        }
        await cart.save();
        await cart.populate("items.foodItem", "name price imageUrl isAvailable");
        const totalAmount = cart.items.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0);
        res.status(200).json({message: "Cart item removed successfully", cart, totalAmount});
    }catch(error){
        res.status(500).json({message: "Failed to remove cart item"});
    }
};

const clearCart = async (req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user._id});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        cart.items = [];
        await cart.save();
        res.status(200).json({message: "Cart cleared successfully"});
    }catch(error){
        res.status(500).json({message: "Failed to clear cart"});
    }
};

module.exports = {getCart, addToCart, updateCartItem, removeCartItem, clearCart};