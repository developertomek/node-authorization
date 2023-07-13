const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const tokenRoute = require("./routes/token");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.log("error connecting to db");
  });

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/token", tokenRoute);

app.listen(3000, () => console.log("server running"));
