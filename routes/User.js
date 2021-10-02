const router = require("express").Router();
const Users = require("../models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const Post = require("../models/Post");
// update route
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updateUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true } // new:true is for hot reflection on user data write after update
      );
      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await Users.findById(req.params.id);
      console.log(user);
      try {
        await Post.deleteMany({ username: user.username });
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).json("deletedUser");
      } catch (err) {
        res.status(500).json("user not found");
      }
    } catch (error) {
      res.status(400).json("error: you cant delete. ");
    }
  }
});

// fetch user information
router.get("/:id", async (req, res) => {
  try {
    // if (req.body.userId === req.params.id) {
    const user = await Users.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(error).json("not found");
  }
});

module.exports = router;
