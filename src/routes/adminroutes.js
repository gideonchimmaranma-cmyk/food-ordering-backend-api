const express = require("express");
const router = express.Router();
const {getAllOrders,updateOrderStatus} = require("../controllers/ordercontrollers");
const {protect, adminOnly} = require("../middleware/authmiddleware");
const validateObjectId = require("../middleware/validateobjectId");

router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id", protect, adminOnly, validateObjectId("id"), updateOrderStatus);

module.exports = router;