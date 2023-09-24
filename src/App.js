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
import Timeline from "./components/Timeline";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import PointerComp from "./components/Pointer";
import PointerImg from "./components/Pointer";
import MarkerIcon from "./components/marker.png";


function App() {
  const [cityBuses, setCityBuses] = useState([]);
  const [city, setCity] = useState('Nagpur');
  const [selectedBus, setSelectedBus] = useState(null); // State to track the selected bus

  const [stops, setStops] = useState([
    {
        "name": "City Center",
        "arrivalTime": "2:00 PM"
    },
    {
        "name": "City Center West",
        "arrivalTime": "2:15 PM"
    },
    {
        "name": "Suburb Market",
        "arrivalTime": "2:30 PM"
    },
    {
        "name": "Suburb",
        "arrivalTime": "4:00 PM"
    }
]); // State to track the stops of the selected bus
  const mapRef = useRef(null);

  useEffect(() => {
    // Fetch data whenever city changes
    const getBuses = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/get-buses?city=${city}`);
        // console.log(data);
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
    // console.log(bus.stops);
    setStops((prev)=>{
      return [...bus.stops]
    }); // Set the stops of the selected bus
    // console.log(stops);
  }


  return (


    <div className="App" style={{ display: "flex", justifyContent: 'center', alignItems: 'start', position:"relative"}}>

      {/* <div style={{ marginTop: "10px" }}>
        <Timeline/>
        </div> */}

      <div className="mt-16">



        <VerticalTimeline className="mt-16 flex" lineColor={'black'} layout="1-column-left" >
          {
            stops.map((item) => {
              // console.log(item);
                return (
                  <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff', textAlign: 'left', padding: '10px', width: '200px', height: '100px' }}
                  contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                  date={item.arrivalTime}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  icon={
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', height:'100%' }}>
                      <img src={MarkerIcon} alt=""width='30px' height='30px' />
                    </div>
                  }
                >
                  <h3 className="vertical-timeline-element-title">{item.name}</h3>
                 
                </VerticalTimelineElement>
                )
            }
          )}
        </VerticalTimeline>
      </div>

      <div className="flex flex-col  absolute right-0 ">

        <div>
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
            width: "50vw",
            height: "80vh",
            borderRadius: "15px",
            marginTop: "20px",
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
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
    </div>
  );
}

export default App;
