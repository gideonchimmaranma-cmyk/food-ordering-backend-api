const Category = require("../models/category");
const getCategories = async(req,res)=>{
    try {
        const categories = await Category.find();
        res.status(200).json({count:categories.length,categories});
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({message:"Error fetching categories"});
    }
};

const createCategory = async(req,res)=>{
    try {
        const {name, description} = req.body;
        if(!name || !name.trim()){
            return res.status(400).json({message:"Category name is required"});
        }
        const existingCategory = await Category.findOne({name:name.trim()});
        if(existingCategory){
            return res.status(409).json({message:"Category with this name already exists"});
        }
        const category = await Category.create({name:name.trim(), description:description || ""});
        res.status(201).json({message:"Category created successfully",category});
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({message:"Failed to create category"});
    }
};

const getCategoryById = async(req,res)=>{
    try{
        const {category} = await
        Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        res.status(200).json({category});   
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({message:"Error fetching category"});
    }
};

const updateCategory = async(req,res)=>{
    try {
        const {name, description} = req.body;
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        if (name !== undefined) {
            if(typeof name !== 'string' || !name.trim()){
                return res.status(400).json({message:"Category name must be a non-empty string"});
            }
            category.name = name.trim();
        }
        if (description !== undefined) {
            if(typeof description !== 'string'){
                return res.status(400).json({message:"Category description must be a string"});
            }
            category.description = description.trim();
        }
        const updatedCategory = await category.save();
        res.status(200).json({message:"Category updated successfully",category:updatedCategory});
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({message:"Invalid category ID"});
        }
        if (error.code === 11000) {
            return res.status(409).json({message:"Category with this name already exists"});
        }
        console.error('Error updating category:', error);
        res.status(500).json({message:"Failed to update category"});
    }
};

const deleteCategory = async(req,res)=>{
    try {
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        await category.remove();
        res.status(200).json({message:"Category deleted successfully"});
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({message:"Invalid category ID"});
        }
        console.error('Error deleting category:', error);
        res.status(500).json({message:"Failed to delete category"});
    }
};



module.exports = {getCategories, createCategory, getCategoryById, updateCategory, deleteCategory};