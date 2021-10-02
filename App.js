const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const { response, request } = require("express");
const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
const authRoute = require("./routes/Auth");
const assert = require("assert"); // for validation
const userRoute = require("./routes/User");
const Category = require("./routes/Categories");
const Post = require("./routes/Post");
const multer = require("multer");
// app.use(express.json()); // for listening json format
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(console.log("connected to DB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/category", Category);
app.use("/post", Post);
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("we are live on the server");
});
