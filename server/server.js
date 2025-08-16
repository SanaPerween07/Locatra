require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/authRoute.js");
const  connectDB  = require("./config/db.js");
const cookieParser = require("cookie-parser");

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());  

// CORS config
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  maxAge: 3600,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
