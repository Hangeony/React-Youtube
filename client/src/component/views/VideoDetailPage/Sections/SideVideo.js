import React, { useEffect, useState } from "react";
import axios from "axios";

function SideVideo() {
  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        console.log("GetVideos", response.data);
        setSideVideos(response.data.videos);
      } else {
        alert("비디오 정보를 가져오는데 실패했습니다.");
      }
    });
  }, []);

  const renderSideVideo = SideVideos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      // key를 써서 에러 방지
      <div
        key={index}
        style={{ display: "flex", marginBottom: "1rem", padding: "0 2rem" }}
      >
        <div style={{ width: "40%", marginRight: "1rem" }}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>
        <div style={{ width: "50%" }}>
          <a style={{ color: "gray" }} href={`/video/${video._id}`}>
            <span style={{ fontSize: "1rem", color: "black" }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span> <br />
            <span>{video.views} Views</span> <br />
            <span>
              {minutes} : {seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return (
    //여러개의 영상을 가져와야 함으로 Map 메소드를 사용
    <React.Fragment>
      <div style={{ marginTop: "3rem" }} />
      {renderSideVideo}
    </React.Fragment>
  );
}

export default SideVideo;
