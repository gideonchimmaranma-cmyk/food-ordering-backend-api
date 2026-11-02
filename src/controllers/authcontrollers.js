const User = require("../models/user");
const jwt = require("jsonwebtoken");
const registerUser = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"Please provide all required fields"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({email:normalizedEmail});
        if(existingUser){
            return res.status(400).json({message:"An account with this email already exists"});
        }
        const user = await User.create({name:name.trim(),email:normalizedEmail,password, role:"customer"});
        res.status(201).json({message:"Account created successfully",user:{id:user._id,name:user.name,email:user.email,role:user.role,createdAt:user.createdAt,updatedAt:user.updatedAt}});
    }catch (error) {
        if(error.code === 11000){
            return res.status(400).json({message:"An account with this email already exists"});
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({message:"Invalid input data"});
        }
        console.error('Error during user registration:', error);
        res.status(500).json({message:"An internal error occurred"});
    }
};

const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please provide both email and password"});
        }
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({email:normalizedEmail});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const ispasswordValid = await bcrypt.comparePassword(password, user.password);
        if(!ispasswordValid){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token = jwt.sign({id:user._id,email:user.email,role:user.role}, process.env.JWT_SECRET, {expiresIn:"1h"});    
        return res.status(200).json({message:"Login successful",token,user:{id:user._id,name:user.name,email:user.email,role:user.role,createdAt:user.createdAt,updatedAt:user.updatedAt}});
    }catch (error) {    
        console.error('Error during user login:', error);
        res.status(500).json({message:"An unexpected error occurred"});
    }
};

module.exports = {registerUser, loginUser};
