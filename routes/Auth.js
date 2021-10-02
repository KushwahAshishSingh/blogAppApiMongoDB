const router = require("express").Router();
const Users = require("../models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

//register routes
router.post("/register", async (req, res) => {
  // for whole bunch of data
  // const addData = new User(req.body);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const addData = new Users({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });
    await addData.save();
    res.send(addData);
    //res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// login route
router.post("/login", async (req, res) => {
  const username = req.body.username;
  const userpass = req.body.password;
  Users.findOne({ username: username }, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        const validated = bcrypt.compare(userpass, user.password);
        if (validated) {
          console.log("success");
          const { password, ...others } = user._doc; // ._doc is for extracting required bunch of info. (other then password)
          res.status(200).json(others);
        } else console.log("first");
      } else console.log("first");
    }
  });
});

module.exports = router;
