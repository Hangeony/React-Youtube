import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

function ReplyComment(props) {
  console.log("props commentList", props.commentList);

  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComment, setOpenReplyComment] = useState(false);

  useEffect(() => {
    let commentNumber = 0;

    props.commentList.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        console.log("CommentList", props.commentList);
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentList, props.parentCommentId]);

  const renderReplyComment = (parentCommentId) =>
    props.commentList.map((comment, index) => (
      <React.Fragment key={comment._id}>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: "80%", marginLeft: "40px" }}>
            <SingleComment
              refreshFunction={props.refreshFunction}
              comment={comment}
              postId={props.videoId}
            />
            <ReplyComment
              refreshFunction={props.refreshFunction}
              commentList={props.commentList}
              postId={props.videoId}
              parentCommentId={comment._id}
            />
          </div>
        )}
      </React.Fragment>
    ));

  const onHandleChange = () => {
    setOpenReplyComment(!OpenReplyComment);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: 0, color: "gray" }}
          onClick={onHandleChange}
        >
          View {ChildCommentNumber} more comment(s)
        </p>
      )}
      {/* 답글 여러개일 수있으니까 변수로 받아온다*/}
      {OpenReplyComment && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
//props의 기본값을 할당함.
ReplyComment.defaultProps = {
  commentList: [],
};
