const express = require("express");
const router = express.Router();
const { createFoodItem, getAllFoodItems, getFoodItemById, updateFoodItem, deleteFoodItem } = require("../controllers/foodcontrollers");
const {protect, adminOnly} = require("../middleware/authmiddleware");
const validateObjectId = require("../middleware/validateobjectId");

//Get all food items                      
router.get("/fooditems", getAllFoodItems);
//Get a single food item by id
router.get("/fooditems/:id", validateObjectId("id"), getFoodItemById);
//Admin only: Create a new food item
router.post("/fooditems", protect, adminOnly, createFoodItem);
//Admin only: Update a food item by id
router.put("/fooditems/:id", protect, adminOnly, validateObjectId("id"), updateFoodItem);
//Admin only: Delete a food item by id
router.delete("/fooditems/:id", protect, adminOnly, validateObjectId("id"), deleteFoodItem);



module.exports = router;