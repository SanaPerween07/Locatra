import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const MapplsMap = () => {

  const [mapObj, setMapObj] = useState(null);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [routePolyline, setRoutePolyline] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API_BASE}/api/auth/home`);
        setLoading(false);
      } 
      catch {
        console.log("User not authorized!");
        navigate("/"); 
      }
    };
    checkAuth();
  }, [navigate]);


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
      const res = await axios.get(`${API_BASE}/api/autosuggest`, {
        params: { query },
      });
      setter(res.data.suggestedLocations || []);
    } 
    catch (err) {
      console.error("Autosuggest error:", err.response?.data || err.message);
    }
  };

  const geocodeAddress = async (text) => {
    if (!text) return null;
    console.log("Frontend sending address to geocode:", text); 
  
    try {
      const res = await axios.get(`${API_BASE}/api/geocode`, {
        params: { 
          text ,
        },
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

      if (!src?.lat || !src?.lng || !dest?.lat || !dest?.lng) {
        alert("Could not find coordinates for given addresses");
        return;
      }

      const res = await axios.get(`${API_BASE}/api/route`, {
        params: {
          sourceLat: src.lat,
          sourceLng: src.lng,
          destLat: dest.lat,
          destLng: dest.lng,
        },
      });

      const routeData = res.data.data; 

      if (!routeData?.features?.length) {
        alert("No route found!");
        return;
      }

      const lineCoords = routeData.features[0].geometry.coordinates[0];

      const path = lineCoords.map(([lng, lat]) => ({ lat, lng }));

      const newPolyline = new window.mappls.Polyline({
        map: mapObj,
        path,
        strokeColor: "#1976D2",
        strokeWeight: 5,
      });

      setRoutePolyline(newPolyline);

      mapObj.fitBounds(lineCoords.map(([lng, lat]) => [lng, lat]));

      const feature = routeData.features[0];

      const distanceMeters = feature.properties.distance; 
      const distanceKm = (distanceMeters / 1000).toFixed(2); 

      const timeSeconds = feature.properties.time;         

      const hours = Math.floor(timeSeconds / 3600);
      const minutes = Math.floor((timeSeconds % 3600) / 60);

      const formattedTime =
        hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

      setRouteInfo({
        distance: distanceKm,
        time: formattedTime,
      });

    } 
    catch (err) {
      console.error("Route error:", err.response?.data || err.message);
      alert("Failed to fetch route");
    }
  };
  
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        id="map"
        style={{ width: "100%", height: "100vh", border: "1px solid #ccc" }}
      />
      <div className="card shadow"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "300px",
          zIndex: 1000,
        }}
      >
        <div className="card-body">
          <div className="mb-3">
              <input
                type="text"
                placeholder="Enter Source"
                value={source}
                className="form-control"
                onChange={(e) => {
                  setSource(e.target.value);
                  getSuggestions(e.target.value, setSourceSuggestions);
                }}
              />

              {sourceSuggestions.length > 0 && (
                <ul className="list-group mt-2" style={{ maxHeight: "120px", overflowY: "auto" }}>
                  {sourceSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
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

            <div className="mb-3">
              <input
                type="text"
                placeholder="Enter Destination"
                className="form-control"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  getSuggestions(e.target.value, setDestSuggestions);
                }}
              />

              {destSuggestions.length > 0 && (
                <ul className="list-group mt-2" style={{ maxHeight: "120px", overflowY: "auto" }}>
                  {destSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
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

            <button  className="btn btn-success w-100 mb-2" onClick={getRoute} >
              Get Route
            </button>

            {routeInfo && (
              <div className="alert alert-info p-2 mb-0">
                <div>
                  <div>
                    <span>Distance: </span>
                    <span>{routeInfo.distance} km</span>
                  </div>
                  <div>
                    <span>Duration: </span>
                    <span>{routeInfo.time} </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>         
    </div>

  );
};

export default MapplsMap;