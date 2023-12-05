const Post = require("../models/post");

const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({ message: "Post successfully fetched", posts, totalItems });
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, please correct you input data");
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = "images/" + req.file.filename;
  }

  if (!imageUrl) {
    const error = new Error("Image not provided");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No post found");
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Post updated sucessfully", post: result });
    })
    .catch((err) => next(err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find a post");
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Deleted successfully" });
    });
};
const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
