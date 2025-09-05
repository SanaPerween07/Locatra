const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng } = req.query;

    if (!sourceLat || !sourceLng || !destLat || !destLng) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const waypoints = `${sourceLat},${sourceLng}|${destLat},${destLng}`;

    console.log( waypoints);

    const { data } = await axios.get("https://api.geoapify.com/v1/routing", {
      params: {
        waypoints,
        mode: "drive",
        apiKey: process.env.GEOAPIFY_KEY, 
      },
    });

    res.json({data})
  } 
  catch (err) {
    console.error("Geoapify Route error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

module.exports = router;
