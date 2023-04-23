import { React, useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ProjectContext } from "../Context";
import axios from "axios";
import { Pie } from "@ant-design/plots";
import BackButton from "../BackButton";
import { Row, Col, Tabs } from "antd";
import "./Dashboard.scss";

function Dashoboard(props) {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState([]);
  const [productsSoldCategoryPie, setProductsSoldCategoryPie] = useState([]);

  useEffect(() => {
    getPurchasedProducts();
    return () => {};
  }, []);

  const getPurchasedProducts = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getPurchaseProducts/`)
      .then((response) => {
        let filteredData = state.login.isAdmin
          ? response.data
          : response.data.filter((el) => el.username === state.login.username);
        console.log(response.data, filteredData);
        let categories = [
          ...new Set(
            filteredData.map((el) => {
              return el.category;
            })
          ),
        ].map((categ) => {
          return {
            type: categ,
            value: filteredData.filter((fi) => fi.category === categ),
          };
        });
        setPurchased(filteredData);
        setProductsSoldCategoryPie(categories);
      })
      .catch((_) => {})
      .finally((_) => setLoading(false));
  };

  const data = [
    {
      type: "分类一",
      value: 27,
    },
    {
      type: "分类二",
      value: 25,
    },
    {
      type: "分类三",
      value: 18,
    },
    {
      type: "分类四",
      value: 15,
    },
    {
      type: "分类五",
      value: 10,
    },
    {
      type: "其他",
      value: 5,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
  };
  return (
    <div className="dashbord-container">
      <BackButton path="/" />
      {/* <Row>
        <Col span={12}>
          <h2>Products purchased in each category</h2>
        </Col>
        <Col span={12}></Col>
      </Row> */}
      <Tabs
        defaultActiveKey="1"
        style={{ marginBottom: "12rem" }}
        items={[
          {
            label: "Products purchased in each category",
            key: "1",
            children: <Pie {...config} />,
          },
          {
            label: "Users map",
            key: "2",
            children: <div></div>,
          },
        ]}
      />
    </div>
  );
}

export default Dashoboard;
