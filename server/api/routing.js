const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const { sourceEloc, destEloc } = req.query;
  
      if (!sourceEloc || !destEloc) {
        return res.status(400).json({ error: "Missing eLocs" });
      }
  
      const resources = "route_adv"; 
      const geopositions = `${sourceEloc};${destEloc}`;

  
      const { data } = await axios.get(
        `https://route.mappls.com/route/direction/${resources}/biking/${geopositions}`,
        {
          params: { access_token: process.env.MAPPLS_STATIC_KEY }
        }
      );
  
      res.json(data);
    } 
    catch (err) {
      console.error("Route error:", err.message);
      res.status(500).json({ error: "Failed to fetch route" });
    }
  });
  
  module.exports = router;