import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const DermatologistsMap = () => {
  const [location, setLocation] = useState(null);
  const [dermatologists, setDermatologists] = useState([]);

  // Get User's Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });

      // Fetch nearby dermatologists using OpenStreetMap's Nominatim API
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=dermatologist+near+${pos.coords.latitude},${pos.coords.longitude}`
      )
        .then((res) => res.json())
        .then((data) => setDermatologists(data));
    });
  }, []);

  return (
    <div style={{ height: "300px", width: "300px" }}>
      {location && (
        <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "300px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>You are here!</Popup>
          </Marker>
          {dermatologists.map((place, idx) => (
            <Marker key={idx} position={[place.lat, place.lon]}>
              <Popup>{place.display_name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default DermatologistsMap;
