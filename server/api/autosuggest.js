const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json({ suggestedLocations: [] });

    const { data } = await axios.get(
      "https://search.mappls.com/search/places/autosuggest/json",
      {
        params: {
          query,
          access_token: process.env.MAPPLS_STATIC_KEY,
        },
      }
    );

    res.json({ suggestedLocations: data.suggestedLocations || [] });
  } 
  catch (err) {
    console.error("Autosuggest error:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

module.exports = router;