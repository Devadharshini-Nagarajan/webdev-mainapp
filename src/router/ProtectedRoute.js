import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { ProjectContext } from "../components/Context";

const ProtectedRoute = () => {
  const [state] = useContext(ProjectContext);

  return state.login.is_authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
