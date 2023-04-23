import { React, useState, useContext, useEffect } from "react";
import {
  Card,
  notification,
  Rate,
  Button,
  Input,
  Switch,
  Tooltip,
  Result,
  Carousel,
  Row,
  Col,
  Collapse,
  theme,
  Radio,
  Space,
  Checkbox,
} from "antd";
import "./ProductsList.scss";
import axios from "axios";
import { ProjectContext } from "../../Context";
import { Link } from "react-router-dom";
import BackButton from "../../BackButton";
import {
  CheckOutlined,
  CloseOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

const ProductsList = () => {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    search: '',
    price: null,
    brand: null,
    category: null,
    rating: null,
    discount: null,
    isFav: null,
  });
  const { Search } = Input;
  const { Panel } = Collapse;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getProducts/`)
      .then((res) => {
        let filteredData = res.data;
        dispatch({
          type: "updateAllProducts",
          payload: filteredData,
        });
        // brand
        let brandsList = [
          ...new Set(
            filteredData
              .map((el) => {
                return { label: el.brand, value: el.brand };
              })
              .map((item) => item.label)
          ),
        ];
        setBrandList(brandsList);
        // category
        let categoryList = [
          ...new Set(
            filteredData
              .map((el) => {
                return { label: el.category, value: el.category };
              })
              .map((item) => item.label)
          ),
        ];
        setCategoryList(categoryList);
        filterTable(selectedFilters, filteredData);
      })
      .catch((_) => {
        notification.error({
          key: "api_error",
          message: "Failed to fetch products list",
          description: "Try again later.",
        });
      })
      .finally((_) => setLoading(false));
  };

  const filterTable = (searchtext, allProducts) => {
    let mainData = allProducts;
    // let value = searchtext.toLowerCase();
    // if (value) {
    //   let newData = mainData.filter(
    //     (el) =>
    //       el.name.toLowerCase().includes(value) ||
    //       el.description.toLowerCase().includes(value) ||
    //       el.brand.toLowerCase().includes(value)
    //   );
    //   setTableData(newData);
    // } else {
      setTableData(mainData);
    // }
  };

  const onFilterChange = (e, name) => {
    let finalvalue = null;
    if (
      name === "price" ||
      name === "rating" ||
      name === "discount" ||
      name === "search"
    ) {
      finalvalue = e.target.value;
    } else if (name === "brand" || name === "category") {
      finalvalue = e;
    }
    let newFilter = {
      ...selectedFilters,
      [name]: finalvalue,
    };
    setSelectedFilters(newFilter);
  };

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  return (
    <div className="list-content">
      <Carousel autoplay>
        <div>
          <img
            className="img-carousel"
            src={`${process.env.PUBLIC_URL}/assets/imgs/producstlanding.avif`}
          />
          <img
            className="img-carousel"
            src="https://www.sephora.com/contentimages/2023-april-skin-bundle-c-site-home-page-hero-banner-beauty-only-us-can-image-only.jpg?imwidth=1090"
          />
          <img
            className="img-carousel"
            src="https://www.sephora.com/contentimages/2023-4-5-rare-beauty-summer-newness-site-desktop-mobile-home-page-rwd-hero-banner-1000x750-can.jpg?imwidth=1090"
          />
        </div>
        <div>
          <img
            className="img-carousel"
            src="https://www.sephora.com/contentimages/2023-4-9-jo-malone-london-sakura-cherry-blossom-cologne-site-desktop-mobile-home-page-rwd-hero-banner-1000x750-en-us-can.jpg?imwidth=1090"
          />
          <img
            className="img-carousel"
            src="https://www.sephora.com/contentimages/2023-04-07-slotting-bestsellers-v2-site-responsive-home-page-hero-banner-2022-xxXxx-slotting-bestsellers-v2-site-mobile-home-page-hero-banner-US_01.jpg?imwidth=1090"
          />
          <img
            className="img-carousel"
            src="https://www.sephora.com/contentimages/2023-4-1-sc-sku-site-desktop-home-page-rwd-marketing-banner-800x256-en-us-can.jpg?imwidth=800"
          />
        </div>
        <div>
          <img
            className="img-carousel"
            src="https://www.sephora.com/contentimages/2023-04-14-mascara-mbc-site-desktop-mobile-home-page-marketing-banner-800x256-image-only-can-en.jpg?imwidth=800"
          />
          <img
            className="img-carousel"
            src="https://www.sephora.com/contentimages/2023-4-1-sc-sku-site-desktop-home-page-rwd-marketing-banner-800x256-en-us-can.jpg?imwidth=800"
          />
        </div>
      </Carousel>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          margin: "0 25px 30px 0",
          marginTop: "1rem",
        }}
      >
        <div>
          <Search
            placeholder="Search"
            onChange={(e) => onFilterChange(e, "search")}
            value={selectedFilters.search}
            style={{
              width: 200,
              marginLeft: "20px",
              marginRight: "20px",
            }}
          />
          <Link to="/purchasehistory">
            <Button type="primary">Purchase History</Button>
          </Link>
        </div>
      </div>
      <Row>
        <Col span={6} className="filterscolumn">
          <Collapse
            bordered={false}
            // defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{
              background: token.colorBgContainer,
            }}
            expandIconPosition="end"
          >
            <Panel header="Price" key="1" style={panelStyle}>
              <Radio.Group
                onChange={(e) => onFilterChange(e, "price")}
                value={selectedFilters.price}
              >
                <Space direction="vertical">
                  <Radio value={1}>Under $25</Radio>
                  <Radio value={2}>$25 to $50</Radio>
                  <Radio value={3}>$50 to $100</Radio>
                  <Radio value={4}>$100 and above</Radio>
                </Space>
              </Radio.Group>
            </Panel>
            <Panel header="Brand" key="2" style={panelStyle}>
              <Checkbox.Group
                options={brandList}
                defaultValue={selectedFilters.brand}
                onChange={(e) => onFilterChange(e, "brand")}
              />
            </Panel>
            <Panel header="Category" key="3" style={panelStyle}>
              <Checkbox.Group
                options={categoryList}
                defaultValue={selectedFilters.category}
                onChange={(e) => onFilterChange(e, "category")}
              />
            </Panel>
            <Panel header="Rating" key="4" style={panelStyle}>
              <Radio.Group
                onChange={(e) => onFilterChange(e, "rating")}
                value={selectedFilters.rating}
              >
                <Space direction="vertical" className="ratingList">
                  <Radio value={4}>
                    <Rate disabled value={4} /> 4 & up
                  </Radio>
                  <Radio value={3}>
                    <Rate disabled value={3} /> 3 & up
                  </Radio>
                  <Radio value={2}>
                    <Rate disabled value={2} /> 2 & up
                  </Radio>
                  <Radio value={1}>
                    <Rate disabled value={1} /> 1 & up
                  </Radio>
                </Space>
              </Radio.Group>
            </Panel>
            <Panel header="Discount" key="5" style={panelStyle}>
              <Radio.Group
                onChange={(e) => onFilterChange(e, "discount")}
                value={selectedFilters.discount}
              >
                <Space direction="vertical">
                  <Radio value={1}>50% and above</Radio>
                  <Radio value={2}>40% to 50%</Radio>
                  <Radio value={3}>20% to 40%</Radio>
                  <Radio value={4}>Below 20%</Radio>
                </Space>
              </Radio.Group>
            </Panel>
          </Collapse>
        </Col>
        <Col span={18}>
          {tableData.length ? (
            <div className="cardlist-row">
              {tableData?.map((product) => {
                return (
                  <div span={6} key={product.productid}>
                    <Card className="card" loading={loading}>
                      <div className="card-row">
                        <img
                          src={`data:image/jpeg;base64,${product.imagefile}`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = `${process.env.PUBLIC_URL}/assets/imgs/noimage.png`;
                          }}
                          alt={product.name}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Link to={`/product/${product.productid}`}>
                            <span>{product.name}</span>
                          </Link>
                          <span>{product.brand}</span>
                          <span>$ {product.price}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <Result
              className="result-products"
              status="warning"
              title="No data found"
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductsList;
