const express = require("express"); 
const axios = require("axios"); 
const router = express.Router(); 
router.get("/", async (req, res) => {
  try { 
    const { address } = req.query; 
    if (!address) return res.status(400).json({ error: "Address required" }); 

    
    const { data } = await axios.get( "https://search.mappls.com/search/address/geocode",
      { 
        params: { 
          address, 
          access_token: process.env.MAPPLS_STATIC_KEY, 
          region: "ind",
        }, 
      } 
    ); 


    // if (!data.copResults || data.copResults.length === 0) {
    //   return res.status(404).json({ error: "No results found for this address" });
    // }

    // const { eLoc } = data.copResults[0];
    // res.json({ eLoc });

    // Check if copResults exists and has eLoc
    if (!data.copResults || !data.copResults.eLoc) {
      return res.status(404).json({ 
        error: "No eLoc found for this address",
        response: data
      });
    }

    const { eLoc } = data.copResults;
    res.json({ eLoc })

  } 
  catch (err) { 
    console.error(err.response?.data || err.message); 
    res .status(err.response?.status || 500) .json(err.response?.data || { error: err.message }); 
  } 
});

module.exports = router;