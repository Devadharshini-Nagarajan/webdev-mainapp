import { React, useContext } from "react";
import "./Main.scss";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../Context";

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
    <div>
      <div onClick={navigateProfile}>Profile</div>
      {state.login.isAdmin && <div onClick={navigateUsersList}>Users</div>}
      <div onClick={navigateProducts}>Prodcuts</div>
      <div onClick={navigateDashboard}>Dashboard</div>
    </div>
  );
};

export default Main;
