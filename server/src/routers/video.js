const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { Video } = require("../models/Video");
const ffmpeg = require("fluent-ffmpeg");
const { auth } = require("../middleware/auth");
const { Subscriber } = require("../models/Subscriber");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  }, //에디에 저장할지 설명, 파일을 업로드하면 uploads파일에 담김
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }, //올린날짜_파일이름
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    console.log("ext", ext);
    if (ext !== ".mp4") {
      //파일 .mp4만 파일 업로드 할 수 있게함.
      //if(ext !== '.mp4' || ext !== '.png') 이렇게 파일을 추가 할 수 있다.
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});
//파일 하나만 넣는거 .single
const upload = multer({ storage: storage }).single("file");

router.post("/uploadfiles", (req, res) => {
  //클라이언트에서 받아온 비디오를 DB에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    //url = file업로드 하면 upload폴더로 보내주는거
    //upload 업로드하면 파일경로, 파일 이름을 저장함.
    return res.status(200).json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.fileName,
    });
  });
});

router.post("/thumbnail", auth, (req, res) => {
  //썸내일 생성하고 비디오 러닝타임도 가져오기

  let filePath = "";
  let fileDuration = "";
  let fileName = "";

  //비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    // console.dir(metadata);
    // console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  //썸내일생성
  ffmpeg(req.body.url)
    //video 파일을 생성
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      filePath = "thumbnails/" + filenames[0];
      fileName = filenames[0];
    })
    //다 썸내일이 생성되고 무엇을 할것인지
    .on("end", function () {
      console.log("Screenshots taken");
      return res.status(200).json({
        success: true,
        url: filePath,
        fileName: fileName,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      console.error(err);
      return res.status(400).json({ successs: false, err });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 1, //1개 까지 썸내일 생성가능
      folder: "uploads/thumbnails", //upload/thumbnaile 폴더안에 저장
      size: "320x240",
      // %b input basename ( filename w/o extension )
      filename: "thumbnail-%b.png", //thumbnail-하고 extension뺀이름이 된다.
    });
});

//비디오 저장
router.post("/uploadVideo", auth, (req, res) => {
  //비디오 정보들을 저장한다.
  //client 에서 보낸 variables에서 보낸 정보를  req.body에 저장시킴.
  const data = { ...req.body, writer: req.user._id };
  const video = new Video(data);

  video.save((err, doc) => {
    if (err) return res.status(401).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

//비디오정보 가져오기
router.get("/getVideos", (req, res) => {
  //비디오를 DB에서 가져와서 client에 보낸다.
  //DB에저장된 video를 찾는일
  //populate을 해둬야 모든 user정보를 가져옴
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

//비디오 하나만 가져오기
router.post("/getVideoDetail", (req, res) => {
  //client에서 보낸 postid를 통해 video를 찾는다.
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

//구독된 비디오 가져오는 코드
router.post("/getSubscriptionVideos", (req, res) => {
  //자신의 아이디를 가지고 구독 하는 사람들을 찾는다.
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).send(err);

      //userTo의 여러명의 정보를 얻어올때
      let subscribedUser = [];

      subscriberInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });
      //찾은 사람들을 비디오를 가지고 온다.
      //여러명일때에는 req.body._id가 안된다, mongoDB에 기능을 이용하여 다수의 사람을 찾아냄
      Video.find({ writer: { $in: subscribedUser } })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    }
  );
});

module.exports = router;
