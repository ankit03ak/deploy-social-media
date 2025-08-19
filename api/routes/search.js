const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } }
      ]
    });

    const posts = await Post.find({
      $or: [
        { content: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } }
      ]
    });

    res.json({ users, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
