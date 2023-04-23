import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  message,
  Modal,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";

import { ProjectContext } from "../../Context";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./Registration.scss";
import UserForm from "../../UsersC/UserForm/UserForm";

const Registration = () => {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { Option } = Select;

  useEffect(() => {
    if (state.login.is_authenticated) {
      navigate("/");
    }
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    setLoading(true);
    let apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
    values.role = "user";
    values.createdat = new Date().toString();
    axios
      .post(`${apiEndpoint}/addUser`, values)
      .then((res) => {
        setIsModalOpen(true);
        setTimeout(function () {
          setIsModalOpen(false);
          navigate("/login");
        }, 3000);
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
      <Modal
        title=""
        open={isModalOpen}
        closable={false}
        width={400}
        height={400}
        footer={null}
      >
        <div className="waitdialog">
          <CheckCircleTwoTone twoToneColor="#52c41a" />
          Registration Successfull. Page will be redirected in 5 secs. Happy
          shopping!!!
        </div>
      </Modal>
    </div>
  );
};

export default Registration;
