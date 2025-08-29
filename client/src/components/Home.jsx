import { useEffect, useState } from "react";
import axios from "axios";
import polyline from "@mapbox/polyline";


const MapplsMap = () => {

  const apiBase = import.meta.env.VITE_API_BASE;

  const [mapObj, setMapObj] = useState(null);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [routePolyline, setRoutePolyline] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/${
      import.meta.env.VITE_MAPPLS_REST_KEY
    }/map_sdk?layer=vector&v=3.0&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    window.initMap = () => {
      if (!window.mappls) return console.error("Mappls SDK not loaded!");
      const map = new window.mappls.Map("map", {
        center: [28.6139, 77.209],
        zoom: 5,
      });
      setMapObj(map);
    };

    return () => {
      document.body.removeChild(script);
      delete window.initMap;
    };
  }, []);

  const getSuggestions = async (query, setter) => {
    if (!query) return setter([]);
    try {
      const res = await axios.get(`${apiBase}/api/autosuggest`, {
        params: { query },
      });
      setter(res.data.suggestedLocations || []);
    } 
    catch (err) {
      console.error("Autosuggest error:", err.response?.data || err.message);
    }
  };

  const geocodeAddress = async (address) => {
    if (!address) return null;
    console.log("Frontend sending address to geocode:", address); 
  
    try {
      const res = await axios.get(`${apiBase}/api/geocode`, {
        params: { address },
      });
     
      return res.data;
    } 
    catch (err) {
      console.error("Geocode error:", err.response?.data || err.message);
      return null;
    }
  };

  const getRoute = async () => {
    if (!source || !destination) {
      alert("Please enter both source and destination!");
      return;
    }

    try {
      const src = await geocodeAddress(source);
      const dest = await geocodeAddress(destination);

      console.log("Source eLoc:", src); 
      console.log("Destination eLoc:", dest); 

      if (!src?.eLoc || !dest?.eLoc) {
        alert("Could not find eLocs for given addresses");
        return;
      }

      const routeRes = await axios.get(`${apiBase}/api/route`, {
        params: { sourceEloc: src.eLoc, destEloc: dest.eLoc },
      });

      const routeData = routeRes.data;
      console.log("Route API Response:", routeData);

      const coords = polyline.decode(routeData.routes[0].geometry); 

      if (!coords.length) {
        alert("No route found!");
        return;
      }

      const route = routeData.routes[0];
      const distance = route.distance;
      const duration = route.duration;
      
      const distanceKm = (distance / 1000).toFixed(2);
      const durationMinutes = Math.round(duration / 60);
      
      setRouteInfo({
        distance: distanceKm,
        duration: durationMinutes,
        distanceMeters: distance,
        durationSeconds: duration
      });

      if (routePolyline) {
        routePolyline.setMap(null);
      }

      const newPolyline = new window.mappls.Polyline({
        map: mapObj,
        path: coords.map(([lat, lng]) => ({ lat, lng })), 
        strokeColor: "#1976D2",
        strokeWeight: 5,
      });

      setRoutePolyline(newPolyline);

      mapObj.fitBounds(coords.map(([lat, lng]) => [ lng, lat]));

    } 
    catch (err) {
        console.error("Route error:", err.response?.data || err.message);
        alert("Failed to fetch route");
    }
  };
  
  return (
    <div>
      <div className="p-3 bg-gray-100 flex gap-2">

        <div className="relative">
          <input
            type="text"
            placeholder="Enter Source"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              getSuggestions(e.target.value, setSourceSuggestions);
            }}
            className="px-2 py-1 border rounded w-64"
          />

          {sourceSuggestions.length > 0 && (
            <ul className="absolute bg-white border w-64 max-h-40 overflow-y-auto z-10">
              {sourceSuggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSource(s.placeName || s.placeAddress);
                    setSourceSuggestions([]);
                  }}
                >
                  {s.placeName} - {s.placeAddress}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Enter Destination"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              getSuggestions(e.target.value, setDestSuggestions);
            }}
            className="px-2 py-1 border rounded w-64"
          />

          {destSuggestions.length > 0 && (
            <ul className="absolute bg-white border w-64 max-h-40 overflow-y-auto z-10">
              {destSuggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setDestination(s.placeName || s.placeAddress);
                    setDestSuggestions([]);
                  }}
                >
                  {s.placeName} - {s.placeAddress}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={getRoute} className="px-4 py-2 bg-blue-600 text-white rounded">
          Get Route
        </button>
      </div>

      {routeInfo && (
        <div>
          <div>
            <div>
              <span>Distance:</span>
              <span>{routeInfo.distance} km</span>
            </div>
            <div>
              <span>Duration:</span>
              <span>{routeInfo.duration} minutes</span>
            </div>
          </div>
        </div>
      )}

      <div
        id="map"
        style={{ width: "100%", height: "90vh", border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default MapplsMap;