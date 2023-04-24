import React from "react";
import "./Map.scss";
import { MapContainer, TileLayer } from "react-leaflet";
import { showDataOnMap } from "./utils";

function Map({ countries, center, zoom }) {
  return (
    <div className="map">
      <MapContainer center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries)}
      </MapContainer>
    </div>
  );
}

export default Map;
