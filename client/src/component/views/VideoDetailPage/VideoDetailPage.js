import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";

function VideoDetailPage(props) {
  // app.js에서 경로를 video/:videoId로 해둬서 params.videoId를 가져올수있다.
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };

  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log("VideoDetail", response.data);
        setVideoDetail(response.data.videoDetail);
      } else {
        alert("비디오 정보를 가져오길 실패 했습니다.");
      }
    });

    axios.post("/api/comment/getComments", variable).then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
        console.log("Comments", response.data.comments); //뎃글 정보들
      } else {
        alert("코멘트 정보를 가져오는 것을 실패 하였습니다.");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshFunction = (newComment) => {
    setComments(Comments.concat(newComment));
  };

  if (VideoDetail.writer) {
    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem("userId")}
      />
    );
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem, 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath.replace(
                /uploads\\/,
                ""
              )}`}
              controls
            />

            <List.Item actions={[subscribeButton]}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={VideoDetail.writer.image}
                    icon={<UserOutlined />}
                  />
                }
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>
            {/* Comments = 댓글 */}
            <Comment
              refreshFunction={refreshFunction}
              commentList={Comments}
              postId={videoId}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>...Loading</div>;
  }
}

export default VideoDetailPage;
