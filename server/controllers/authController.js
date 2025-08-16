const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();


const signup = async (req, res) => {
    try{
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Generate salt & hash password
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        // If not, create one
        const user = await userModel.create({ email, password : hashedPassword });
        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, email: user.email }
        });
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        console.log(password,email);

        const user = await userModel.findOne({ email });
        console.log(user);
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        console.log(token);

        // 🔑 Send JWT in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            maxAge: 15 * 60 * 1000, 
        });

        res.status(201).json({ 
            message: "Login successful", 
            user: { id: user._id, email: user.email } 
        });
    }
   catch(error) {
    res.status(500).json({ message: "Server error", error: error.message });
}

};
module.exports ={signup , login};