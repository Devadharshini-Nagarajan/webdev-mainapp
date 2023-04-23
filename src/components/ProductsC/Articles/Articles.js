import { React, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProjectContext } from "../../Context";
import axios from "axios";
import { Card } from "antd";

function Articles(props) {
  const [state, dispatch] = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    // getArticles();
    return () => {};
  }, []);

  const getArticles = () => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_ARTICLES_ENDPOINT}/articlesearch.json?q=skincare ${props.details.category}&api-key=${process.env.REACT_APP_API_ARTICLES_API_KEY}`
        //    ' https://api.nytimes.com/svc/search/v2/articlesearch.json?q=beauty of joseon relief sun&api-key=jNAdMAq8mpRyGMUAOYUcqTIiqIZ9LL06'
      )
      .then((response) => {
        setArticleList(response?.data?.response?.docs);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((_) => setLoading(false));
  };

  const openNewTab = (url) => {
    window.open(url);
  };

  return (
    <div style={{ margin: "30px" }}>
      <div>
        {articleList.length
          ? articleList.map((el) => {
              return (
                <Card style={{ marginBottom: "20px" }}>
                  <Link onClick={() => openNewTab(el.web_url)}>
                    {el.headline.main}
                  </Link>
                  <br></br>
                  <span style={{ fontFamily: "initial" }}>{el.abstract}</span>
                </Card>
              );
            })
          : "No articles found"}
      </div>
    </div>
  );
}

export default Articles;
