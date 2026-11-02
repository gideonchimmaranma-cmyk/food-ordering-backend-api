const express = require("express");
const router = express.Router();
const {createOrder, getMyOrders, getOrderById, cancelOrder}= require("../controllers/ordercontrollers");
const {protect} = require("../middleware/authmiddleware");
const validateObjectId = require("../middleware/validateobjectId");


router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, validateObjectId("id"), getOrderById);
router.patch("/:id", protect, validateObjectId("id"), cancelOrder);

module.exports = router;