import { React, useState, useContext, useEffect } from "react";
import "./UsersList.scss";
import { Link } from "react-router-dom";
import { ProjectContext } from "../../Context";
import axios from "axios";
import { notification, Table, Space, Button, Input } from "antd";
import NotAllowed from "../../NotAllowed";
import BackButton from "../../BackButton";

function UsersList(props) {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const { Search } = Input;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getUsers`)
      .then((res) => {
        let filteredData = res.data.filter(
          (el) => el.username !== state.login.username
        );
        dispatch({
          type: "updateAllUsers",
          payload: filteredData,
        });
        setTableData(filteredData);
      })
      .catch((_) => {
        notification.error({
          key: "api_error",
          message: "Failed to fetch products list",
          description: "Try again later.",
        });
      })
      .finally((_) => setLoading(false));
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, record) => <span>{record.role?.toUpperCase()}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a href={`/user/${record.username}`}>View</a>
        </Space>
      ),
    },
  ];

  const onSearch = (e) => {
    let value = e.target.value.toLowerCase();
    if (value) {
      let newData = state.allUsers.filter(
        (el) =>
          el.username.toLowerCase().includes(value) ||
          el.firstname.toLowerCase().includes(value) ||
          el.lastname.toLowerCase().includes(value) ||
          el.email.toLowerCase().includes(value)
      );
      setTableData(newData);
    } else {
      setTableData(state.allUsers);
    }
  };

  return (
    <div className="userslist-content">
      <BackButton path="/" />
      <div className="table-content">
        {state.login.isAdmin ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link to={`/addUser`}>
                <Button type="primary" className="addbtn">
                  Add User
                </Button>
              </Link>
              <Search
                placeholder="Search"
                onChange={onSearch}
                style={{
                  width: 200,
                }}
              />
            </div>
            <Table columns={columns} dataSource={tableData} rowKey="userid" />
          </>
        ) : (
          <NotAllowed />
        )}
      </div>
    </div>
  );
}

export default UsersList;
