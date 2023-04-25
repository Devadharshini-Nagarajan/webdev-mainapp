import { React, useContext } from "react";
import "./Main.scss";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../Context";
import { Card, Col, Row } from "antd";

const Main = () => {
  const [state, dispatch] = useContext(ProjectContext);
  const navigate = useNavigate();

  const navigateProducts = () => {
    navigate("/products");
  };

  const navigateUsersList = () => {
    navigate("/users");
  };

  const navigateProfile = () => {
    navigate("/profile");
  };

  const navigateDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="home-content">
      <Row>
        <Col span={12} className="detailssection">
          <Row className="detail-title">
            Glow up with us. Your ultimate skincare companion.
          </Row>
          <div className="details-desc">
            Skincare isn't just about looking good – it's about feeling
            confident in your own skin. With{" "}
            <b style={{ fontFamily: "cursive", fontSize: "26px" }}>Be You</b> ,
            you'll find the right products to nourish and protect your skin, so
            you can feel great every day.
          </div>
        </Col>
        <Col span={12} className="cardsection">
          <Card onClick={navigateProfile}>Profile</Card>
          {state.login.isAdmin && (
            <Card onClick={navigateUsersList}>Users</Card>
          )}
          <Card onClick={navigateProducts}>Products</Card>
          <Card onClick={navigateDashboard}>Dashboard</Card>
        </Col>
      </Row>
    </div>
  );
};

export default Main;
