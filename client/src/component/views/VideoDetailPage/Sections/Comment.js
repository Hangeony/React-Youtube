import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; //function형이여서 redux-hook사용
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const [CommentValue, setCommentValue] = useState("");
  const user = useSelector((state) => state.user); // stat에 user정보를 변수user에 넣는다.
  const videoId = props.postId; //video 아이디 얻어오는법.

  //이걸로 인하여 텍스트아리아 부분 타이핑 가능
  const handleClick = (event) => {
    setCommentValue(event.currentTarget.value);
  };
  const onSubmit = (event) => {
    event.preventDefault(); //버튼을 눌렀을때 새로고침 방지

    //redux를 사용하여 글쓴이 정보를 알아오는법.
    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: videoId,
    };

    axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log("Comment", response.data.result);
        setCommentValue("");
        props.refreshFunction(response.data.result);
      } else {
        alert("커멘트를 저장하지 못했습니다.");
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />
      {/* Comment List */}

      {props.commentList &&
        props.commentList.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment key={comment._id}>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  postId={videoId}
                />
                <ReplyComment
                  postId={videoId}
                  refreshFunction={props.refreshFunction}
                  parentCommentId={comment._id}
                  commentList={props.commentList}
                />
              </React.Fragment>
            )
        )}

      {/* Root Comment From */}
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px", resize: "none" }}
          onChange={handleClick}
          value={CommentValue}
          placeholder="코멘트를 작성해 주세요"
        />
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
