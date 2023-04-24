import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  redType: {
    hex: "#CC1034",
    rgb: "rgb(204,16,52)",
    half_op: "rgba(204,15,52,0.5)",
    multiplier: 300000,
  },
  greenType: {
    hex: "#7dd71d",
    rgb: "rgb(125,215,29)",
    half_op: "rgba(125,215,29,0.5)",
    multiplier: 1000,
  },
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// circles on map with tooltip
export const showDataOnMap = (data) =>
  data?.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors.redType.hex}
      fillColor={casesTypeColors.redType.hex}
      radius={Math.sqrt(country["count"]) * casesTypeColors.redType.multiplier}
    >
      <Popup>
        <div className="info-container">
          <img src={`${country.countryInfo.flag}`} className="info-flag" />
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Count: {numeral(country.count).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
