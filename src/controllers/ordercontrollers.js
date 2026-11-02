const Order = require("../models/order");
const Cart = require("../models/cart");
const FoodItem = require("../models/fooditem");

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { deliveryAddress } = req.body;
        if (!deliveryAddress || !deliveryAddress.trim()) {
            return res.status(400).json({ message: "Delivery address is required" });
        }
        const cart = await Cart.findOne({user: req.user._id}).populate("items.foodItem");
        if (!cart || cart.items.length === 0){
            return res.status(400).json({message: "Your cart is empty. Please add items to your cart before placing an order."});
        }
        let totalPrice = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const foodItem = await FoodItem.findById(item.foodItem);
            if (!foodItem) {
                return res.status(404).json({ message: `Food item with ID ${item.foodItem} not found.` });
            }
            if(!foodItem.isAvailable){
                return res.status(400).json({ message: `Food item ${foodItem.name} is not available.` });
            }
            const itemTotal = foodItem.price * item.quantity;
            totalPrice += itemTotal;
            orderItems.push({
                foodItem: foodItem._id,
                foodName: foodItem.name,
                quantity: item.quantity,
                price: foodItem.price
            });
            totalPrice += foodItem.price * item.quantity;
        }
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount: totalPrice,
            deliveryAddress: deliveryAddress.trim()
        });
        cart.items = [];
        await cart.save();
        res.status(201).json({ message: "Order placed successfully.", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to place order." });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json({ message: "Orders retrieved successfully.", count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve orders." });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Your orders retrieved successfully.", count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve your orders." });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email").populate("items.foodItem");
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        const isAdmin = req.user.role === "admin";
        const isOwner = order.user._id.toString() === req.user._id.toString();
        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: "You are not authorized to view this order." });
        }
        res.status(200).json({ message: "Order retrieved successfully.", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve order." });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status." });
        }
        const order = await Order.findByIdAndUpdate(
            req.params.id,   
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        order.status = status;
        await order.save();
        res.status(200).json({ message: "Order status updated successfully.", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status." });
    }
};

    const cancelOrder = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: "Order not found." });
            }
            if (order.user. toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "You are not authorized to cancel this order." });
            }
           if (order.status !== "Pending") {
                return res.status(400).json({ message: "Only pending orders can be cancelled." });
            }
            order.status = "Cancelled";
            await order.save();
            res.status(200).json({ message: "Order cancelled successfully.", order });
        } catch (error) {
            res.status(500).json({ message: "Failed to cancel order." });
        }
    };

    module.exports = { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus, cancelOrder };
         
         
         
    
    
    
    
    
    
    