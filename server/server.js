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
const allowedOrigins = ["https://locatra.vercel.app", "http://localhost:5173"];
app.use(cors({
  origin: allowedOrigins, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options(/.*/, cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: "*",
  credentials: true
}));


connectDB();

app.get('/', (req, res) => {
  res.send("API working")
})
app.use("/api/auth", authRoutes);
app.use("/api/autosuggest", autosuggestAPI);
app.use("/api/geocode", geocodeAPI);
app.use("/api/route", routingAPI);



const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
