const router = require("express").Router();
const { verifyRefreshToken } = require("../middleware/authMiddleware");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

router.post("/", verifyRefreshToken, async (req, res) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  const decodedToken = jwt.decode(token);
  const { accessToken, refreshToken } = generateToken(res, decodedToken);
  const decodeRefreshToken = jwt.decode(refreshToken);

  const user = await User.findOne({ _id: decodedToken._id });
  const updateUser = await user.updateOne({
    refreshToken: [
      ...user.refreshToken.filter((rt) => rt !== decodedToken.rtId),
      decodeRefreshToken.rtId,
    ],
  });

  res.json({ accessToken, refreshToken });
});

module.exports = router;
