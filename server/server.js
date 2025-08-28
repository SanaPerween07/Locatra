require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoute");
const autosuggestAPI = require("./api/autosuggest");
const geocodeAPI = require("./api/geocode");
const routingAPI = require("./api/routing");
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options(/.*/, cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: "*",
  credentials: true
}));


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/autosuggest", autosuggestAPI);
app.use("/api/geocode", geocodeAPI);
app.use("/api/route", routingAPI);



const PORT = process.env.SERVER_PORT ;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
