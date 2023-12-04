const Post = require("../models/post");

const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  Post.find().then((posts) => {
    if (!posts) {
      const error = new Error("Could not fetch posts!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Posts successfully fetched!", posts });
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  const { title, content } = req.body;
  // Create post in db
  if (!errors.isEmpty()) {
    console.log(errors.array());
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw err;
  }

  console.log(req.file);
  const post = new Post({
    title,
    content,
    imageUrl: "images/" + req.file.filename,
    creator: {
      name: "Akuna444",
    },
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => next(err));
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not found a post!");
        error.statusCode = 422;
        throw error;
      }
      res.status(200).json({
        message: "Post fetched sucessfully",
        post,
      });
    })
    .catch((err) => console.log(err));
};
