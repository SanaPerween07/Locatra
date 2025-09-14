const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const mongoose = require("mongoose");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const isProduction = process.env.NODE_ENV === "production";

const signup = async (req, res) => {
    try{
        const { email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

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

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
         // always None for cross-site
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

const googleOAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "No ID token provided" });
        }

        const googleResponse = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = googleResponse.getPayload();
        const { sub: googleId, email } = payload;
        console.log("Google token verified for email:", email);

        if (mongoose.connection.readyState !== 1) {
            console.error("Database not connected. Ready state:", mongoose.connection.readyState);
            return res.status(500).json({ message: "Database connection error" });
        }

        console.log("Querying database for user...");
        let user = await userModel.findOne({ email });
        if (!user) {
            user = new userModel({
                email,
                googleId,
                isGoogleUser: true,
            });
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 15 * 60 * 1000, 
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({
            message: "Google login successful",
            user: { id: user._id, email: user.email },
            token,        
            refreshToken, 
        });
    } 
    catch (error) {
        res.status(500).json({ message: "Google login failed", error: error.message });
    }


};

const refreshToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            const newAccessToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            res.cookie("token", newAccessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "None" : "Lax",
                maxAge: 15 * 60 * 1000,
            });

            res.json({ token: newAccessToken });
        });
    }
    catch(err){

    }
}

module.exports ={signup , login, googleOAuth, refreshToken};