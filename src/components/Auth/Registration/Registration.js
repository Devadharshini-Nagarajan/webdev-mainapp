import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Card, Row, Col, Select, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { ProjectContext } from "../../Context";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./Registration.scss";
import UserForm from "../../UsersC/UserForm/UserForm";

const Registration = () => {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { Option } = Select;

  useEffect(() => {
    if (state.login.is_authenticated) {
      navigate("/");
    }
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    let apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
    values.role = "user";
    values.createdat = new Date().toString();
    axios
      .post(`${apiEndpoint}/addUser`, values)
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Successfully registered in",
        });
        navigate("/login");
      })
      .catch((err) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Registration failed. Please try again later",
        });
      })
      .finally((_) => setLoading(false));
  };

  return (
    <div className="registration">
      {contextHolder}
      <Row>
        <Col span={10}></Col>
        <Col span={14}>
          <Card className="section-card">
            <h2>Register here!</h2>
            <UserForm
              loading={loading}
              onFinish={onFinish}
              formValue={{}}
              submitText="Register"
            />
            <Link to="/login">
              <span className="noaccount-text">
                Already have an account? Login here
              </span>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Registration;
