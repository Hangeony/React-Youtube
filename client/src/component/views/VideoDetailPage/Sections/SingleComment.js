import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  //togle방식으로 뎃글창생성.
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply); //OpenReply 가 ture일때만 보이게 설정.
  };

  const onHandleChange = (event) => {
    setCommentValue(event.currentTarget.CommentValue);
  };

  const actions = [
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];

  const onSubmit = (event) => {
    event.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log("Comment", response.data.result);
        props.refreshFunction(response.data.result);
        setCommentValue("");
      } else {
        alert("커멘트를 저장하지 못했습니다.");
      }
    });
  };

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={
          <Avatar
            icon={<UserOutlined />}
            src={props.comment.writer.image}
            alt="image"
          />
        }
        content={<p>{props.comment.content}</p>}
      />
      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: "100%", borderRadius: "5px", resize: "none" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="코멘트를 작성해 주세요"
          />
          <br />
          <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
