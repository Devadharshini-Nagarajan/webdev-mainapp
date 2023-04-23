import { React, useState, useContext, useEffect } from "react";
import { ProjectContext } from "../../Context";
import "./Profile.scss";
import BackButton from "../../BackButton";
import { Button } from "antd";
import { Link } from "react-router-dom";

function Profile() {
  const [state, dispatch] = useContext(ProjectContext);
  const [details, setDetails] = useState({});

  useEffect(() => {
    setDetails(state.login);
    console.log(state.login);
  }, []);

  return (
    <div className="profile-content">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <BackButton path="/" />
        <Link to={`/user/${state.login.username}`}>
          <Button type="primary">Edit Details</Button>
        </Link>
      </div>
      <div className="detail-row">
        <span>Username</span>
        <span>{details.username}</span>
      </div>
      <div className="detail-row">
        <span>First Name</span>
        <span>{details.firstname}</span>
      </div>
      <div className="detail-row">
        <span>Last Name</span>
        <span>{details.lastname}</span>
      </div>
      <div className="detail-row">
        <span>Email</span>
        <span>{details.email}</span>
      </div>
      <div className="detail-row">
        <span>Phone Number</span>
        <span>{details.phonenumber}</span>
      </div>
      <div className="detail-row">
        <span>Address</span>
        <span>
          {details.address1} {details.address2},<br></br> {details.city},{" "}
          {details.province}, {details.zipcode}{" "}
        </span>
      </div>
    </div>
  );
}

export default Profile;
