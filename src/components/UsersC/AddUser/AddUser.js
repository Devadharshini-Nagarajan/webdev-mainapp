import { React, useState, useContext, useEffect } from "react";
import "./AddUser.scss";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../../Context";
import { message } from "antd";
import axios from "axios";
import NotAllowed from "../../NotAllowed";
import UserForm from "../../UsersC/UserForm/UserForm";
import BackButton from "../../BackButton";

function AddUser(props) {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [prevUsernames, setPrevUsernames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getUsers`)
      .then((res) => {
        let filteredData = res.data.map((el) => {
          return el.username;
        });
        setPrevUsernames(filteredData);
      })
      .catch((_) => {})
      .finally((_) => setLoading(false));
  }, []);

  const onFinish = (values) => {
    if (prevUsernames.includes(values.username)) {
      messageApi.open({
        type: "error",
        content: "Username already exists. Please change it",
      });
      return;
    }
    setLoading(true);
    let form = {
      ...values,
      role: "user",
      createdat: new Date().toString(),
    };
    axios
      .post(`${state.login.companyUrl}/addUser`, form)
      .then((res) => {
        console.log(res);
        messageApi.open({
          type: "success",
          content: "Successfully logged in",
        });
        navigate("/users");
      })
      .catch((err) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Failed to update. Try again later. ",
        });
        console.log(err);
      })
      .finally((_) => setLoading(false));
  };
  return (
    <div className="adduser-content">
      {contextHolder}
      <BackButton path="/users" />
      {state.login.isAdmin ? (
        <UserForm
          loading={loading}
          onFinish={onFinish}
          formValue={{}}
          submitText="Save"
        />
      ) : (
        <NotAllowed />
      )}
    </div>
  );
}

export default AddUser;
