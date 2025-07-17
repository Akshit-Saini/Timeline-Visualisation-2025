// MapView.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Dummy coordinates for known places – update as needed.
const placeCoordinates = {
  Unknown: [53.3498, -6.2603],
  Munster: [52.6680, -8.6305],
  Leinster: [53.2734, -6.1883],
};

const MapView = ({ results }) => {
  return (
    <MapContainer center={[53.3498, -6.2603]} zoom={7} style={{ height: "500px", width: "100%" }}>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {results.map((item, index) => {
        const coords = placeCoordinates[item.birthPlace] || placeCoordinates["Unknown"];
        return (
          <Marker key={index} position={coords}>
            <Popup>
              <strong>{item.name}</strong>
              <br />
              Birth: {item.birth} in {item.birthPlace}
              <br />
              Death: {item.death} in {item.deathPlace}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;