const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { Comment } = require("../models/Comment");

//뎃글 저장하기
router.post("/saveComment", auth, (req, res) => {
  //클라이언트에서 모든 정보를 DB에 저장
  const data = { ...req.body, writer: req.user._id };
  const comment = new Comment(data);

  comment.save((err, comment) => {
    if (err) return res.status(400).json({ success: false, err });
    //comment 로 했을경우 writer의 정보를 못저장해서,
    //.save()를 사용하면 .poulate()를 못씀.
    //model Comment로 저장
    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComments", (req, res) => {
  Comment.find({ postId: req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
