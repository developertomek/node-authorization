const router = require("express").Router();
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, (req, res) => {
  res.json({
    posts: [
      {
        title: "Hello",
        description: "test description",
      },
      {
        title: "Hello2",
        description: "test description2",
      },
    ],
  });
});

module.exports = router;
