const jwt = require("jsonwebtoken");
const User = require("../model/User");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token") || req.cookies.token;
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    req.user = verified;
    const decodedToken = jwt.decode(token);
    const user = await User.findOne({ _id: decodedToken._id });
    const tokenExists = user.refreshToken.includes(decodedToken.rtId);

    if (!tokenExists) {
      throw new Error("Token does not exist");
    }
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = {
  verifyToken,
  verifyRefreshToken,
};
