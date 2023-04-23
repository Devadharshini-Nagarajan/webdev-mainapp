import { Rate } from "antd";
import React from "react";
import dayjs from "dayjs";

function Review(props) {
  const getDate = (date) => {
    return dayjs(date).format("DD MMM YYYY HH:mm");
  };
  return (
    <div>
      <h4 style={{ color: "green" }}>{props.review.username}</h4>
      <h4>{props.review.headline}</h4>
      <p>{props.review.content}</p>
      <Rate disabled value={props.review.rating} />
      <br></br>
      <span style={{ fontFamily: "initial" }}>
        Date:
        {getDate(
          props.review.modifieddate
            ? props.review.modifieddate
            : props.review.reviewdate
        )}
      </span>
      <hr></hr>
    </div>
  );
}

export default Review;
