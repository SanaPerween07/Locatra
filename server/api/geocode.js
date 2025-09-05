const express = require("express"); 
const axios = require("axios"); 
const router = express.Router(); 
router.get("/", async (req, res) => {
  try { 
    const { text } = req.query; 
    if (!text) return res.status(400).json({ error: "Address required" }); 

    const { data } = await axios.get( "https://api.geoapify.com/v1/geocode/search",
      { 
        params: { 
          text, 
          apiKey: process.env.GEOAPIFY_KEY
        }, 
      } 
    ); 

    const [lng, lat] = data.features[0].geometry.coordinates;
    res.json({ lat, lng: lng });
    
    // if (!data.copResults || data.copResults.length === 0) {
    //   return res.status(404).json({ error: "No results found for this address" });
    // }

    // const { eLoc } = data.copResults[0];
    // res.json({ eLoc });

    // Check if copResults exists and has eLoc
    // if (!data.copResults || !data.copResults.eLoc) {
    //   return res.status(404).json({ 
    //     error: "No eLoc found for this address",
    //     response: data
    //   });
    // }

    // const { eLoc } = data.copResults;
    // res.json({ eLoc })

  } 
  catch (err) { 
    console.error(err.response?.data || err.message); 
    res .status(err.response?.status || 500) .json(err.response?.data || { error: err.message }); 
  } 
});

module.exports = router;