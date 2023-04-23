import React from "react";
import Router from "./router";

import Context from "./components/Context";
import "leaflet/dist/leaflet.css";
// import "antd/dist/antd.css";
import "./App.css";

function App() {
  return (
    <Context>
      <div className="App">
        <Router />
      </div>
    </Context>
  );
}

export default App;
