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


    <div className="App" style={{ display: "flex", justifyContent: 'center', alignItems: 'start' }}>

      {/* <div style={{ marginTop: "10px" }}>
        <Timeline/>
        </div> */}

      <div className="mt-16">



        <VerticalTimeline className="mt-16" lineColor={'black'} layout="1-column-left" >
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Creative Director</h3>
            <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
            <p>
              Creative Direction, User Experience, Visual Design, Project Management, Team Leading
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2010 - 2011"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Art Director</h3>
            <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
            <p>
              Creative Direction, User Experience, Visual Design, SEO, Online Marketing
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2008 - 2010"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">Los Angeles, CA</h4>
            <p>
              User Experience, Visual Design
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2006 - 2008"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
            <p>
              User Experience, Visual Design
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="April 2013"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Content Marketing for Web, Mobile and Social Media</h3>
            <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
            <p>
              Strategy, Social Media
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="November 2012"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Agile Development Scrum Master</h3>
            <h4 className="vertical-timeline-element-subtitle">Certification</h4>
            <p>
              Creative Direction, User Experience, Visual Design
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2002 - 2006"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            icon={PointerImg}
          >
            <h3 className="vertical-timeline-element-title">Bachelor of Science in Interactive Digital Media Visual Imaging</h3>
            <h4 className="vertical-timeline-element-subtitle">Bachelor Degree</h4>
            <p>
              Creative Direction, Visual Design
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
          />
        </VerticalTimeline>
      </div>
      <div className="flex flex-col justify-start items-center ">

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
            width: "50vw",
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
    </div>
  );
}

export default App;
