const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports = function (res, user) {
  const accessToken = jwt.sign(
    { _id: user._id, name: user.name },
    process.env.TOKEN_SECRET,
    { expiresIn: 10 * 60 * 1000 }
  );

  const refreshToken = jwt.sign(
    { _id: user._id, name: user.name, rtId: uuidv4() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: 24 * 60 * 60 * 1000 }
  );

  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};
