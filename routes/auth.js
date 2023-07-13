const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../utils/validation");
const generateToken = require("../utils/generateToken");
const hash = require("../utils/hashData");
const { verifyRefreshToken } = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  const hashPassword = await hash(req.body.password);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ name: savedUser.name });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email or password is wrong");
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("Email or password is wrong");
  }

  const { refreshToken, accessToken } = generateToken(res, user);

  const decodedRt = jwt.decode(refreshToken);

  const saveToken = await user.updateOne({
    refreshToken: [...user.refreshToken, decodedRt.rtId],
  });

  res.header("auth-token", accessToken).json({ accessToken, refreshToken });
});

router.post("/logout", verifyRefreshToken, async (req, res) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  const decodedToken = jwt.decode(token);

  const user = await User.findOne({ _id: decodedToken._id });
  const updateUser = await user.updateOne({
    refreshToken: user.refreshToken.filter((rt) => rt !== decodedToken.rtId),
  });

  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.send("Successfully logged out");
});

module.exports = router;
