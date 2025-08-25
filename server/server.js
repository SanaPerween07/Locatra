require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoute");
const autosuggestAPI = require("./api/autosuggest");
const geocodeAPI = require("./api/geocode");
const routingAPI = require("./api/routing");
// const distanceMatrixAPI = require("./api/distanceMatrix");

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/autosuggest", autosuggestAPI);
app.use("/api/geocode", geocodeAPI);
app.use("/api/route", routingAPI);
// app.use("/api/distance", distanceMatrixAPI);

const PORT = process.env.SERVER_PORT ;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
