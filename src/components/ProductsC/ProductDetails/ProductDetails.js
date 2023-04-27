import { React, useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ProjectContext } from "../../Context";
import axios from "axios";
import "./ProductDetails.scss";
import {
  Rate,
  Button,
  Modal,
  Input,
  message,
  Result,
  Tabs,
  Card,
  Form,
} from "antd";
import dayjs from "dayjs";

import BackButton from "../../BackButton";
import Articles from "../Articles/Articles";
import Review from "./Review";

function ProductDetails() {
  const [state, dispatch] = useContext(ProjectContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [purchased, setPurchased] = useState([]);
  const [myReview, setMyReview] = useState({});
  const [othersReviews, setOthersReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  const { TextArea } = Input;
  useEffect(() => {
    getProdctDetails();
    getPurchasedProducts();
    getReviews();
    return () => {};
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsReviewModalOpen(false);
  };

  const getProdctDetails = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getProductById/${id}`)
      .then((response) => {
        setDetails(response.data);
      })
      .catch((_) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Failed to fetch product details!",
        });
      })
      .finally((_) => setLoading(false));
  };

  const getPurchasedProducts = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getPurchaseProducts/`)
      .then((response) => {
        let filteredData = response.data.filter(
          (el) => el.username === state.login.username && el.productid === id
        );
        let filteredDataForAdmin = response.data.filter(
          (el) => el.productid === id
        );
        setPurchased(state.login.isAdmin ? filteredDataForAdmin : filteredData);
      })
      .catch((_) => {})
      .finally((_) => setLoading(false));
  };

  const onPurchaseProduct = () => {
    setLoading(true);
    let values = {
      purchasedate: new Date().toString(),
      username: state.login.username,
      productid: id,
      productname: details.name,
      category: details.category,
    };
    let apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
    axios
      .post(`${apiEndpoint}/addPurchaseProduct`, values)
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Successfully purchased the product",
        });
        let newPurchased = [...purchased, res.data];
        setPurchased(newPurchased);
      })
      .catch((err) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Product pruchase failed!",
        });
        console.log(err);
      })
      .finally((_) => {
        setLoading(false);
        setIsModalOpen(false);
      });
  };

  const getReviews = () => {
    setLoading(true);
    axios
      .get(`${state.login.companyUrl}/getReviewsByProductId/${id}`)
      .then((response) => {
        let myreview = response.data.find(
          (el) => el.username === state.login.username
        );
        let others = response.data.filter(
          (el) => el.username !== state.login.username
        );
        setMyReview(myreview);
        setOthersReviews(others);
      })
      .catch((_) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Failed to fetch product details!",
        });
      })
      .finally((_) => setLoading(false));
  };

  const onReviewFinish = (values) => {
    setLoading(true);
    values.reviewdate = new Date().toString();
    values.modifieddate = null;
    values.username = state.login.username;
    values.productid = id;
    values.purchaseid = null;
    let apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
    axios
      .post(`${apiEndpoint}/addReview`, values)
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Successfully added the review",
        });
        setMyReview(res.data);
      })
      .catch((err) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Failed to add review!",
        });
        console.log(err);
      })
      .finally((_) => {
        setLoading(false);
        setIsReviewModalOpen(false);
      });
  };

  const getDate = (date) => {
    return dayjs(date).format("DD MMM YYYY HH:mm");
  };

  const getDiscount = () => {
    if (details.price && details.discount)
      return (
        parseInt(details?.price) *
        ((100 - parseInt(details?.discount)) / 100)
      )?.toFixed(2);
  };
  const onScrollReviews = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ margin: "30px" }}>
      {contextHolder}
      <BackButton path="/products" />
      {details.productid ? (
        <>
          <div className="details-content">
            <div>
              <img
                src={`data:image/jpeg;base64,${details.imagefile}`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = `${process.env.PUBLIC_URL}/assets/imgs/noimage.png`;
                }}
                alt="Product Image"
                className="product-img"
              />
            </div>
            <div className="details">
              <h2>{details.name}</h2>
              <h4 style={{ textAlign: "center" }}>
                <span>{details.brand}</span>
              </h4>
              <Rate disabled value={details.rating} />
              <small onClick={onScrollReviews} style={{ cursor: "pointer" }}>
                {othersReviews.length + (myReview ? 1 : 0)} Reviews
              </small>
              <div style={{ marginTop: "15px" }}>
                <strong>${getDiscount()}</strong>&nbsp;&nbsp;
                <span style={{ fontFamily: "fantasy" }}>
                  (Discount: {details.discount}%)
                </span>
                <p>Original Amount $ {details.price}</p>
                <p>{details.sold} sold out</p>
              </div>

              {!state.login.isAdmin && (
                <div className="actions">
                  <Button
                    type="primary"
                    style={{ marginRight: "10px" }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    {purchased.length ? "Order Again" : "Purchase"}
                  </Button>
                </div>
              )}

              <h2>About the product</h2>
              <div className="set2">
                <div>
                  <b>Description: &nbsp;&nbsp;</b>
                  <span>{details.description}</span>
                </div>
                <div>
                  <b>Category: &nbsp;</b>
                  <span>{details.category}</span>
                </div>
                <div>
                  <b>Standard size: &nbsp;</b>
                  <span>{details.quantityml} ml</span>
                </div>
              </div>
              {state.login.isAdmin && (
                <div>
                  <b>Created by</b>&nbsp; {details.createdby}
                </div>
              )}
              <span style={{ fontFamily: "initial" }}>
                Created on: {getDate(details.createdat)}
              </span>
            </div>
          </div>
          <Tabs
            defaultActiveKey="1"
            style={{ marginBottom: "12rem" }}
            items={[
              {
                label: "Reviews",
                key: "1",
                children: (
                  <div ref={ref}>
                    {purchased.length > 0 && !state.login.isAdmin && (
                      <>
                        <h2>My Review</h2>
                        {myReview ? (
                          <Review review={myReview} />
                        ) : (
                          <Button
                            type="primary"
                            onClick={() => setIsReviewModalOpen(true)}
                          >
                            Add Review
                          </Button>
                        )}
                      </>
                    )}

                    <h2>Other Reviews</h2>
                    {othersReviews.length
                      ? othersReviews.map((el) => {
                          return <Review review={el} key={el.reviewid} />;
                        })
                      : "No other reviews yet"}
                  </div>
                ),
              },
              {
                label: "Purchase History",
                key: "2",
                children: (
                  <div>
                    {purchased.length
                      ? purchased.map((el, key) => {
                          return (
                            <Card style={{ marginBottom: "20px" }} key={key}>
                              {el.productname}
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
                ),
              },
              {
                label: "Articles",
                key: "3",
                children: <Articles details={details} />,
              },
            ]}
          />
        </>
      ) : (
        <div>
          <Result
            status="warning"
            title="Product not found."
            extra={
              <Link to="/products">
                <Button type="primary" key="console">
                  Go to Products
                </Button>
              </Link>
            }
          />
        </div>
      )}

      <Modal
        title={purchased.length ? "Re purchase" : "Purchase"}
        open={isModalOpen}
        closable={true}
        onCancel={handleCancel}
        width={400}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={onPurchaseProduct}
          >
            Ok
          </Button>,
        ]}
      >
        Would you like to {purchased.length ? "repurchase" : "purchase"} this
        product?
      </Modal>

      <Modal
        title="Add Review"
        open={isReviewModalOpen}
        closable={true}
        onCancel={handleCancel}
        width={400}
        footer={null}
      >
        <Form onFinish={onReviewFinish}>
          <Form.Item
            name="headline"
            rules={[
              {
                required: true,
                message: "Please input your overview!",
              },
            ]}
          >
            <Input placeholder="Headline" />
          </Form.Item>

          <Form.Item
            name="content"
            rules={[
              {
                required: true,
                message: "Please input your content!",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Content" />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Rating"
            rules={[
              {
                required: true,
                message: "Please input your rating!",
              },
            ]}
          >
            <Rate />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductDetails;
