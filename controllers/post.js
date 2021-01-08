var mongoose = require('mongoose');
const Post = require(`../models/Post`);

const ErrorResponse = require(`../utils/errorResponse`);
const asynchandler = require(`../middleware/async`);

//@desc Add a post
//@route POST /api/v1/post
// @access Public
exports.addPost = asynchandler(async (req, res, next) => {
  const { title, description, user, url } = req.body;

  const post = await Post.create({
    title,
    description,
    user,
    url
  });

  // sendTokenResponse(user, 200, res);
  return res.status(200).json({ success: true, data: post });
});

//@desc Get post
//@route GET /api/v1/post
// @access Public
exports.getPosts = asynchandler(async (req, res, next) => {
  // const { title, description, user, url } = req.body;

  const posts = await Post.find({});

  // sendTokenResponse(user, 200, res);
  return res.status(200).json({ success: true, data: posts });
});

//@desc Get post by id
//@route GET /api/v1/post/:id
// @access Public
exports.getPost = asynchandler(async (req, res, next) => {
  // const { title, description, user, url } = req.body;

  const post = await Post.findById(req.params.id);
  if (post) {
    return res.status(200).json({ success: true, data: post });
  } else {
    return next(new ErrorResponse('Could not find the post', 400));
  }

  // sendTokenResponse(user, 200, res);
});

//@desc delete post
//@route DELETE /api/v1/post/:id
// @access Public
exports.deletePost = asynchandler(async (req, res, next) => {
  // const { title, description, user, url } = req.body;

  const post = await Post.findByIdAndDelete(req.params.id);
  if (post) {
    return res.status(200).json({ success: true, data: post });
  } else {
    return next(new ErrorResponse('Could not find the post', 400));
  }

  // sendTokenResponse(user, 200, res);
});
