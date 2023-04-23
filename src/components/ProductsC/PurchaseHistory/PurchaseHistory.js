import { React, useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ProjectContext } from "../../Context";
import axios from "axios";
import { message, Card } from "antd";
import dayjs from "dayjs";

import BackButton from "../../BackButton";

function PurchaseHistory(props) {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [purchased, setPurchased] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPurchasedProducts();
    return () => {};
  }, []);

  const getPurchasedProducts = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getPurchaseProducts/`)
      .then((response) => {
        let filteredData = response.data.filter(
          (el) => el.username === state.login.username
        );
        setPurchased(state.login.isAdmin ? response.data : filteredData);
      })
      .catch((_) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Failed to fetch purchase history!",
        });
      })
      .finally((_) => setLoading(false));
  };

  const getDate = (date) => {
    return dayjs(date).format("DD MMM YYYY");
  };

  return (
    <div style={{ margin: "30px" }}>
      {contextHolder}
      <BackButton path="/products" />
      <div>
        {purchased.length
          ? purchased.map((el) => {
              return (
                <Card style={{ marginBottom: "20px" }}>
                  <Link to={`/product/${el.productid}`}>{el.productname}</Link>
                  <br></br>
                  <span style={{ fontFamily: "initial" }}>
                    Created on: {getDate(el.purchasedate)}
                  </span>
                  <br></br>
                  {state.login.isAdmin && (
                    <span style={{ fontFamily: "initial" }}>
                      Created by: {el.username}
                    </span>
                  )}
                </Card>
              );
            })
          : "No items has been purchased yet"}
      </div>
    </div>
  );
}

export default PurchaseHistory;
