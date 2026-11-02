const fooditem = require("../models/fooditem");
const category = require("../models/category");

const createFoodItem = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category: categoryId } = req.body;
        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ message: "Name is required and must be a string." });
        }
        if (
            price === undefined ||
            price === null ||
            price === "" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            return res.status(400).json({ message: "Price is required and must be a non-negative number." });
        }
        if (
            typeof category !== "string" ||
            !/^[0-9a-fA-F]{24}$/ .test(category)
        ) {
            return res.status(400).json({ message: "A valid category ID is required" });
        }
        const categoryExists = await category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }
        if (description !== undefined && typeof description !== "string") {
            return res.status(400).json({ message: "Description must be a string." });
        }
        if (imageUrl !== undefined && typeof imageUrl !== "string") {
            return res.status(400).json({ message: "Image URL must be a string." });
        }
        if (isAvailable !== undefined && typeof isAvailable !== "boolean") {
            return res.status(400).json({ message: "isAvailable must be a boolean." });
        }
        const foodItem = await fooditem.create({
            name: name.trim(),
            description,
            price: Number(price),
            imageUrl,
            category,
            isAvailable
        });
        res.status(201).json({ message: "Food item created successfully", foodItem });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create food item" });
    }
}

const getAllFoodItems = async (req, res) => {
    try {
        const foodItems = await fooditem.find();
        res.status(200).json({ message: "Food items retrieved successfully", count: foodItems.length, foodItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve food items" });
    }
};
const getFoodItemById = async (req, res) => {
    try {
        const {id} = req.params;
        const foodItem = await fooditem.findById(id);
        if (!foodItem) {
            return res.status(404).json({message: "Food item not found"});
        } 
        res.status(200).json({message: "Food item retrieved successfully", foodItem});  
    }catch (error) 
    {console.error(error);
        res.status(500).json({message: "Failed to retrieve food item"});
    }
};
const updateFoodItem = async (req, res) => {
    try{
        const {id} = req.params;
        const updatedFoodItem = await fooditem.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFoodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.status(200).json({ message: "Food item updated successfully", foodItem: updatedFoodItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update food item" });
    }
};
const deleteFoodItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFoodItem = await fooditem.findByIdAndDelete(id);
        if (!deletedFoodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.status(200).json({ message: "Food item deleted successfully", foodItem: deletedFoodItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete food item" });
    }
};

const getFoodItems = async (req, res) => {
    try {
        const { search, category, availability } = req.query;
        let filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (category) {
            filter.category = category;
        }
        if (availability === "true") {
            filter.isAvailable = true;
        }
        const foodItems = await FoodItem.find(filter).populate("category", "name");
        res.status(200).json({ message: "Food items retrieved successfully", count: foodItems.length, foodItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve food items" });
    }
};

const getFoodItemsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const foodItems = await FoodItem.find({ category: categoryId }).populate("category", "name");
        res.status(200).json({ message: "Food items retrieved successfully", count: foodItems.length, foodItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve food items by category" });
    }
};
module.exports = { createFoodItem, getAllFoodItems, getFoodItemById, updateFoodItem, deleteFoodItem, getFoodItems, getFoodItemsByCategory };