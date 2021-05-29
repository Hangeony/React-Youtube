import React, { useState } from "react";
import { Typography, Button, Form, Input, message } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];
const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: "Music" },
  { value: 0, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (event) => {
    setVideoTitle(event.currentTarget.value);
  };
  const onDescriptionChange = (event) => {
    setDescription(event.currentTarget.value);
  };

  const onPrivateChange = (event) => {
    setPrivate(event.currentTarget.value);
  };
  const onCategoryChange = (event) => {
    setCategory(event.currentTarget.value);
  };
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        console.log("uploadfiles : ", response.data); //영상이 잘 올라 왔는지 확인

        let variable = {
          url: response.data.url, //서버에서 받은 url
          fileName: response.data.fileName,
        };
        setFilePath(response.data.url);

        //variable에 파일 url, 파일 이름을 받아옴
        axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            console.log("thumbnail :", response.data);
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert("썸네일 생성에 실패 했습니다.");
          }
        });
      } else {
        alert("비디오 업로드에 실패하였습니다.");
      }
    });
  };
  const onSubmit = (event) => {
    //원래 하려고 했던것들을 방지
    event.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Number(Private),
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    axios
      .post("/api/video/uploadVideo", variables)
      .then((response) => {
        if (response.data.success) {
          console.log("uploadVideo :", response.data);

          message.success("성공적으로 비디오를 업로드 했습니다.");
          setTimeout(() => {
            props.history.push("/");
          }, 3000);
        } else {
          alert("비디오 업로드를 실패했습니다.");
        }
      })
      .catch((err) => {
        alert("비디오 업로드를 실패했습니다.");
      });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* drop zone */}
          {/* multiple 파일 한개만 올릴 건지 여러개 올릴건지,한개만 = false, 여러개 true */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <PlusOutlined />
              </div>
            )}
          </Dropzone>

          {/* Thumbnail */}
          {/* ThumbnailPath 가 있을때만 나오게 하기 */}
          {ThumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
