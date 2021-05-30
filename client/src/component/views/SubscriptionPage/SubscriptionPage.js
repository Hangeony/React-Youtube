import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Card, Avatar, Col, Typography, Row } from "antd";

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [Video, setVideo] = useState([]);
  //구독 한 사람들을 찾고 비디오를 찾는다.
  useEffect(() => {
    const subscriptionVariables = {
      userFrom: localStorage.getItem("userId"),
    };

    axios
      .post("/api/video/getSubscriptionVideos", subscriptionVariables)
      .then((response) => {
        if (response.data.success) {
          console.log("getSubscriptionVideos", response.data);
          setVideo(response.data.videos);
        } else {
          alert("비디오 정보를 가져오는데 실패했습니다.");
        }
      });
  }, []);

  const renderCards = Video.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24} key={video._id}>
        <a href={`/video/${video._id}`}>
          <div style={{ position: "relative " }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}{" "}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
        />
        <span>{video.writer.name} </span>
        <br />
        <span style={{ marginLeft: "3rem" }}> {video.views}</span>-{" "}
        <span> {moment(video.createdAt).format("MMM Do YY")} </span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}> Subscription </Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default LandingPage;
