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
  Tag,
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
    search: "",
    price: null,
    brand: [],
    category: [],
    rating: null,
    discount: null,
    isFav: null,
  });
  const { Search } = Input;
  const { Panel } = Collapse;

  const priceMatch = {
    1: "Under $25",
    2: "$25 to $50",
    3: "$50 to $100",
    4: "$100 and above",
  };

  const discountMatch = {
    1: "50% and above",
    2: "40% to 50%",
    3: "20% to 40%",
    4: "Below 20%",
  };

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

  const filterTable = (filters, allProducts) => {
    let mainData = allProducts;
    let searchValue = filters.search?.toLowerCase();
    // search
    if (searchValue) {
      mainData = mainData.filter(
        (el) =>
          el.name.toLowerCase().includes(searchValue) ||
          el.description.toLowerCase().includes(searchValue) ||
          el.brand.toLowerCase().includes(searchValue)
      );
    }
    // brand
    if (filters.brand.length) {
      mainData = mainData.filter((el) => filters.brand?.includes(el.brand));
    }
    // category
    if (filters.category.length) {
      mainData = mainData.filter((el) =>
        filters.category?.includes(el.category)
      );
    }
    // price
    if (filters.price !== null) {
      switch (parseInt(filters.price)) {
        case 1:
          mainData = mainData.filter((el) => parseInt(el.price) < 25);
          break;

        case 2:
          mainData = mainData.filter(
            (el) => parseInt(el.price) >= 25 && parseInt(el.price) < 50
          );
          break;

        case 3:
          mainData = mainData.filter(
            (el) => parseInt(el.price) >= 50 && parseInt(el.price) < 100
          );
          break;

        case 4:
          mainData = mainData.filter((el) => parseInt(el.price) >= 100);
          break;

        default:
          mainData = mainData;
          break;
      }
    }

    // rating
    if (filters.rating !== null) {
      console.log(parseInt(filters.rating), mainData);
      switch (parseInt(filters.rating)) {
        case 4:
          mainData = mainData.filter((el) => parseInt(el.rating) >= 4);
          console.log(mainData);
          break;

        case 3:
          mainData = mainData.filter((el) => parseInt(el.rating) >= 3);
          break;

        case 2:
          mainData = mainData.filter((el) => parseInt(el.rating) >= 2);
          break;

        case 1:
          mainData = mainData.filter((el) => parseInt(el.rating) >= 1);
          break;

        default:
          mainData = mainData;
          break;
      }
    }

    // discount
    if (filters.discount !== null) {
      switch (parseInt(filters.discount)) {
        case 1:
          mainData = mainData.filter((el) => parseInt(el.discount) >= 50);
          break;

        case 2:
          mainData = mainData.filter(
            (el) => parseInt(el.discount) > 40 && parseInt(el.discount) < 50
          );
          break;

        case 3:
          mainData = mainData.filter(
            (el) => parseInt(el.discount) > 20 && parseInt(el.discount) <= 40
          );
          break;

        case 4:
          mainData = mainData.filter((el) => parseInt(el.discount) <= 20);
          break;

        default:
          mainData = mainData;
          break;
      }
    }
    setTableData(mainData);
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
    filterTable(newFilter, state.allProducts);
  };

  const clearFilters = () => {
    let filter = {
      search: "",
      price: null,
      brand: [],
      category: [],
      rating: null,
      discount: null,
      isFav: null,
    };
    setSelectedFilters(filter);
    filterTable(filter, state.allProducts);
  };

  const getTagFilters = () => {
    let tags = [];
    Object.keys(selectedFilters).forEach((el) => {
      if (selectedFilters[el]) {
        if (el === "price") {
          tags.push(priceMatch[selectedFilters[el]]);
        }
        if (el === "brand") {
          tags.push(...selectedFilters[el]);
        }
        if (el === "category") {
          tags.push(...selectedFilters[el]);
        }
        if (el === "discount") {
          tags.push(discountMatch[selectedFilters[el]]);
        }
        if (el === "rating") {
          tags.push(`${selectedFilters[el]} & up`);
        }
      }
    });
    return tags;
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
          justifyContent: "space-between",
          margin: "25px",
          marginTop: "1rem",
        }}
      >
        <div>
          {getTagFilters().length > 0 && (
            <>
              <span>Filters: </span>

              <Space size={[0, 8]} wrap>
                {getTagFilters().map((el, key) => {
                  return (
                    <Tag
                      color={
                        "#" +
                        (((1 << 24) * Math.random()) | 0)
                          .toString(16)
                          .padStart(6, "0")
                      }
                      key={key}
                    >
                      {el}
                    </Tag>
                  );
                })}
              </Space>

              <Button onClick={clearFilters}>Clear all</Button>
            </>
          )}
        </div>
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
            defaultActiveKey={["1", "2"]}
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
                  {Object.keys(priceMatch).map((el) => {
                    return (
                      <Radio value={el} key={priceMatch[el]}>
                        {priceMatch[el]}
                      </Radio>
                    );
                  })}
                </Space>
              </Radio.Group>
            </Panel>
            <Panel header="Brand" key="2" style={panelStyle}>
              <Checkbox.Group
                options={brandList}
                value={selectedFilters.brand}
                onChange={(e) => onFilterChange(e, "brand")}
              />
            </Panel>
            <Panel header="Category" key="3" style={panelStyle}>
              <Checkbox.Group
                options={categoryList}
                value={selectedFilters.category}
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
                  {Object.keys(discountMatch).map((el) => {
                    return (
                      <Radio value={el} key={discountMatch[el]}>
                        {discountMatch[el]}
                      </Radio>
                    );
                  })}
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
