import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Card, Avatar, Col, Typography, Row } from "antd";

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [Video, setVideo] = useState([]);

  //dom이 로드 되자마자 무서을 한번할것인지 정해줌
  useEffect(() => {
    axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        console.log("GetVideos", response.data);
        setVideo(response.data.videos);
      } else {
        alert("비디오 정보를 가져오는데 실패했습니다.");
      }
    });
  }, []);

  const renderCards = Video.map((video, index) => {
    //video에서 duration을 가져와서 /60을 나누면 minutes가 되구
    //모든  minute을  60을 곱한뒤  video duration을 빼면 초가 됨
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        <a href={`/video/post/${video._id}`}>
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
          avatar={<Avatar src="{{video.writer.image}}" />}
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
      <Title level={2}> Recommended </Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default LandingPage;
