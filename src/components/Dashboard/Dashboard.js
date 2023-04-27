import { React, useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ProjectContext } from "../Context";
import axios from "axios";
import { Pie } from "@ant-design/plots";
import BackButton from "../BackButton";
import { Row, Col, Tabs } from "antd";
import "./Dashboard.scss";
import Map from "./Map";

function Dashoboard(props) {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState([]);
  const [productsSoldCategoryPie, setProductsSoldCategoryPie] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 14.80746,
    lng: 40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getPurchasedProducts();
    fetchAllUsers();
    return () => {};
  }, []);

  const fetchAllUsers = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getUsers/`)
      .then((response) => {
        let users = response.data.filter((el) => el.role !== "admin");
        setAllUsers(users);
        fetchCountries(users);
      })
      .catch((_) => {})
      .finally((_) => setLoading(false));
  };

  const fetchCountries = (users) => {
    axios.get("https://disease.sh/v3/covid-19/countries").then((res) => {
      const groupCountByCountry = users.reduce((acc, obj) => {
        const country = obj.country;
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      const countries = res.data.map((el) => ({
        country: el.country,
        countryInfo: el.countryInfo,
        count: groupCountByCountry[el.country] ?? 0,
        continent: el.continent,
      }));
      dispatch({
        type: "updateAllCountries",
        payload: countries,
      });

      console.log(countries);
      setMapCountries(countries);
    });
  };

  const getPurchasedProducts = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getPurchaseProducts/`)
      .then((response) => {
        let filteredData = state.login.isAdmin
          ? response.data
          : response.data.filter((el) => el.username === state.login.username);

        let categories = [
          ...new Set(
            filteredData.map((el) => {
              return el.category;
            })
          ),
        ].map((categ) => {
          return {
            type: categ,
            value: filteredData.filter((fi) => fi.category === categ).length,
          };
        });
        setPurchased(filteredData);
        setProductsSoldCategoryPie(categories);
      })
      .catch((_) => {})
      .finally((_) => setLoading(false));
  };

  const getConfig = () => {
    return {
      appendPadding: 10,
      data: productsSoldCategoryPie,
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
  };

  return (
    <div className="dashbord-container">
      <BackButton path="/" />
      <Tabs
        defaultActiveKey="1"
        style={{ marginBottom: "12rem" }}
        items={[
          {
            label: state.login.isAdmin ? "Products Sold" : "Purchased Products",
            key: "1",
            children: (
              <div>
                {productsSoldCategoryPie.length > 0 && <Pie {...getConfig()} />}
              </div>
            ),
          },
          state.login.isAdmin && {
            label: "Users map",
            key: "2",
            children: (
              <div>
                <h2>No of Users: {allUsers.length} </h2>
                {state.login.isAdmin && mapCountries.length > 0 && (
                  <Map
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                  />
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

export default Dashoboard;
