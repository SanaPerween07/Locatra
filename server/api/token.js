const axios = require("axios");

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const res = await axios.post(
    "https://outpost.mappls.com/api/security/oauth/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.MAPPLS_CLIENT_ID,
      client_secret: process.env.MAPPLS_CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  accessToken = res.data.access_token;
  tokenExpiry = Date.now() + res.data.expires_in * 1000;
  return accessToken;
}

module.exports = getAccessToken;
