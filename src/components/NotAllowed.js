import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

export const NotAllowed = () => (
  <Result
    status="404"
    title="Restricted"
    subTitle="Only admins can access this page."
    extra={
      <Link to="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
);

export default NotAllowed;
