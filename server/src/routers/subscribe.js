const express = require("express");
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");

//구독 숫자얻기
router.post("/subscribeNumber", (req, res) => {
  //모델을 가져와서 userTo 넣어줌.
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    //subscribe 여기는 userTo를 구독하는 모든 케이스를 들어감.
    if (err) return res.status(400).send(err);
    //subscribe 몇개가 들어가졌는지 갯수를 알 수 있음.
    return res
      .status(200)
      .json({ success: true, subscribeNumber: subscribe.length });
  });
});

//글쓴이를 구독했는지 정보 확인
router.post("/subscribed", (req, res) => {
  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, subscribe) => {
    //userTo, userFrom이 있으면 구독했다는 증거가됨.
    let result = false;
    //subscribe 0이면 구독을 안하고 있다. result가 true면 구독 중
    if (subscribe.length !== 0) {
      result = true;
    }
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, subscribed: result });
  });
});

//구독하기
router.post("/subscribe", (req, res) => {
  //userTo, userFrom을 DB에 저장하기 위해 인스턴스 생성
  //userTo, userFrom을 불러와서 저장.
  const subscribe = new Subscriber(req.body);

  subscribe.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//구독 취소 하기
router.post("/unSubscribe", (req, res) => {
  //userTo, userFrom을 찾아서 없애줘야함.
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

module.exports = router;
