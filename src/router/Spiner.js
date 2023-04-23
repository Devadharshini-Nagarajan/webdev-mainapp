import React from "react";

import Spin from "antd/es/spin/index";

const Spiner = () => {
  return (
    <div style={{position:"absolute",top:"45%",left:"50%"}}>
      <Spin />
    </div>
  );
};

export default Spiner;
