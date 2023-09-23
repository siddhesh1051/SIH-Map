import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import busIcon from "./bus.png";
import busIcon2 from "./bus2.png"; // Import the second bus icon
import React, { useEffect, useState, useRef } from "react";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import axios from 'axios';

function App() {
  const [cityBuses, setCityBuses] = useState([]);
  const [city, setCity] = useState('Nagpur');
  const [selectedBus, setSelectedBus] = useState(null); // State to track the selected bus
  const mapRef = useRef(null);

  useEffect(() => {
    // Fetch data whenever city changes
    const getBuses = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/get-buses?city=${city}`);
        console.log(data);
        setCityBuses(data);

        // Set the map viewport to focus on the selected city and zoom in
        const bounds = calculateBoundingBox(data);
        if (bounds) {
          mapRef.current.getMap().fitBounds([[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getBuses();
  }, [city]);

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity);
  }

  // Helper function to calculate the bounding box of bus locations
  const calculateBoundingBox = (data) => {
    if (data.length === 0) {
      return null;
    }

    const lngs = data.map((bus) => bus.lng);
    const lats = data.map((bus) => bus.lat);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    return {
      minLng,
      maxLng,
      minLat,
      maxLat,
    };
  };

  // Function to handle bus marker click
  const handleBusClick = (bus) => {
    setSelectedBus(bus); // Set the selected bus when clicked
    mapRef.current.getMap().flyTo({ // Fly to the bus location
      center: [bus.lng, bus.lat],
      zoom: 16
    });
  }

  return (
    <div className="App" style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ marginTop: "5px" }}>
        <label
          htmlFor="city-select"
          style={{
            marginRight: "10px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Select a city:
        </label>
        <select
          id="city-select"
          value={city}
          onChange={handleCityChange}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "2px solid #f4D7f7",
            backgroundColor: "#f7f7f7",
            color: "#333",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="Nagpur" >Nagpur</option>
          <option value="Hamirpur">Hamirpur</option>
          <option value="Una">Una</option>
          <option value="Imphal">Imphal</option>
          <option value="Pune">Pune</option>
          <option value="Jaipur">Jaipur</option>
        </select>
      </div>

      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.REACT_APP_MAP_KEY}
        style={{
          width: "90vw",
          height: "80vh",
          borderRadius: "15px",
          marginTop: "20px",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {
          cityBuses.map((bus) => (
            <Marker key={bus.index} longitude={bus.lng} latitude={bus.lat}>
              <img
                src={selectedBus === bus ? busIcon2 : busIcon} // Use busIcon2 when selected
                alt="Bus Marker"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={() => handleBusClick(bus)} // Handle click event
              />
            </Marker>
          ))
        }
        <NavigationControl position="bottom-right" />
        <FullscreenControl />
        <GeolocateControl />
      </Map>
    </div>
  );
}

export default App;
