import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

function BackButton(props) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <Link
        // to={props.path}
        onClick={goBack}
        style={{ textDecoration: "none", color: "#1677ff", fontWeight: "600" }}
      >
        <div style={{ display: "flex", margin: "0 20px 20px 20px" }}>
          <ArrowLeftOutlined />
          &nbsp;
          <span>Back</span>
        </div>
      </Link>
    </div>
  );
}

export default BackButton;
