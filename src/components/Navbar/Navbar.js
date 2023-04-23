import { React, useState, useContext } from "react";
import { Row, Col, Modal } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { ProjectContext } from "../Context";
import "./Navbar.scss";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Navbar(props) {
  const [state, dispatch] = useContext(ProjectContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    dispatch({
      type: "updateLogout",
      payload: {},
    });
    navigate("/login");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className="header">
      <Row className="content">
        <Col span={4} className="brand">
          <Link to="/" style={{ color: "white" }}>
            Be You
          </Link>
        </Col>
        <Col span={4}></Col>
        <Col span={16} className="navitems">
          <Link to="/profile" style={{ color: "white" }}>
            <UserOutlined />
            <span
              style={{
                marginRight: "10px",
                fontFamily: "fangsong",
                marginLeft: "5px",
              }}
            >
              {state.login.username}
            </span>
          </Link>
          {location.pathname != "/" && (
            <span style={{ marginRight: "20px" }} onClick={navigateHome}>
              &nbsp;Home
            </span>
          )}
          <span onClick={showModal}>
            <LogoutOutlined />
            &nbsp;Logout
          </span>
        </Col>
      </Row>
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Are you sure you want to logout of this application?
      </Modal>
    </div>
  );
}

export default Navbar;
