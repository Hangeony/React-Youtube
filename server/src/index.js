const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/key");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 5000;

//mongodb연결
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.log(err));
//cors 브라우저에서 보내는 정보를 안 막음
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//application/x-www-form-urlencoded 이렇게 된 것을 분석해서 가져오는것
app.use(bodyParser.urlencoded({ extended: true }));
//application /json타입으로 된것을 가져오기함.
app.use(bodyParser.json());
app.use(cookieParser());

//모든 service의 api들을 index.js를 모두 넣어놔야하는데
//router의 정의를 해둬서 분활 시켜두는것을 의미.
app.use("/", express.static(path.join(__dirname, "../../uploads")));
// console.log(path.join(__dirname, '../../uploads'));
app.use("/api/users", require("./routers/users"));
app.use("/api/video", require("./routers/video"));
app.use("/api/subscribe", require("./routers/subscribe"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
