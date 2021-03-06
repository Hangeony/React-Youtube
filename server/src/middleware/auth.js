const { User } = require("../models/User");
let auth = (req, res, next) => {
  //인증처리 하는곳
  //클라이언트에서 토큰을 가져옴.
  let token = req.cookies.x_auth;
  console.log("token", token);
  if (!token) {
    return next();
  }

  //토큰을 복호화 한후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req, (token = token);
    req.user = user;
    console.log("reqUser", req.user);
    next();
  });
  //유저가 있으면 okay

  //유저가 없으면 no
};

module.exports = { auth };
