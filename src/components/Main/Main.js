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
            Rwandom content header tos howcase here about this app
          </Row>
          <div className="details-desc">
            Just detailed stuff availavble sections Just detailed stuff
            availavble sections Just detailed stuff availavble sections Just
            detailed stuff availavble sections
          </div>
        </Col>
        <Col span={12} className="cardsection">
          <Card onClick={navigateProfile}>Profile</Card>
          {state.login.isAdmin && (
            <Card onClick={navigateUsersList}>Users</Card>
          )}
          <Card onClick={navigateProducts}>Prodcuts</Card>
          <Card onClick={navigateDashboard}>Dashboard</Card>
        </Col>
      </Row>
    </div>
  );
};

export default Main;
