import { React, useState, useContext, useEffect } from "react";
import "./UserDetails.scss";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ProjectContext } from "../../Context";
import axios from "axios";
import BackButton from "../../BackButton";
import UserForm from "../../UsersC/UserForm/UserForm";
import { Button, message, Modal, Result } from "antd";
import NotAllowed from "../../NotAllowed";

function UserDetails(props) {
  const [state, dispatch] = useContext(ProjectContext);
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [details, setDetails] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getuserDetails();
    return () => {};
  }, []);

  const getuserDetails = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getUserByUsername/${username}`)
      .then((response) => {
        setDetails(response.data);
      })
      .catch((_) => {})
      .finally((_) => setLoading(false));
  };

  const onFinish = (values) => {
    setLoading(true);
    let form = {
      ...values,
      role: details.role,
    };
    axios
      .put(`${state.login.companyUrl}/updateUser`, form)
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Successfully updated the user",
        });
        setDetails(res.data);
        setReadOnly(true);
        if (state.login.username === username) {
          dispatch({
            type: "updateLogin",
            payload: { ...state.login, ...res.data },
          });
        }
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

  const deleteUser = () => {
    setLoading(true);
    axios
      .delete(`${state.login.companyUrl}/deleteUser/${username}`)
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Successfully deleted the user",
        });
        navigate("/users");
      })
      .catch((err) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Failed to delete. Try again later. ",
        });
      })
      .finally((_) => setLoading(false));
  };

  return (
    <div className="userdetails-content">
      {contextHolder}
      <BackButton path="/users" />
      {state.login.isAdmin ||
      (state.login.username === username && !loading) ? (
        <>
          {details.userid ? (
            <div>
              <div className="editform-row">
                <Button
                  type="primary"
                  onClick={() => setReadOnly(false)}
                  disabled={!readOnly || loading}
                >
                  Edit Form
                </Button>
                {state.login.isAdmin && details.role !== "admin" && (
                  <Button
                    type="primary"
                    danger
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={loading}
                    style={{ marginLeft: "5px" }}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <UserForm
                loading={loading}
                onFinish={onFinish}
                formValue={details}
                readOnly={readOnly}
                disabledUser={true}
                submitText="Update"
              />
            </div>
          ) : (
            <Result
              status="warning"
              title="User not found."
              extra={
                <Link to="/users">
                  <Button type="primary" key="console">
                    Go to users
                  </Button>
                </Link>
              }
            />
          )}
          <Modal
            title="Delete"
            open={isDeleteModalOpen}
            onOk={deleteUser}
            onCancel={() => setIsDeleteModalOpen(false)}
          >
            Are you you want to delete the user?
          </Modal>
        </>
      ) : (
        <NotAllowed />
      )}
    </div>
  );
}

export default UserDetails;
