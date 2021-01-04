const crypto = require('crypto');
var mongoose = require('mongoose');
const User = require(`../models/User`);

const ErrorResponse = require(`../utils/errorResponse`);
const asynchandler = require(`../middleware/async`);

//@desc Register user
//@route POST /api/v1/auth/register
// @access Public
exports.register = asynchandler(async (req, res, next) => {
  const { name, email, password, gender } = req.body;

  // const email1 = email.toLowerCase();

  //Create user
  const user = await User.create({
    name,
    email,
    password,
    gender
  });

  sendTokenResponse(user, 200, res);
});

// @desc Login user
//@route POST /api/v1/auth/login
// @access Public
exports.login = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;
  // const email1 = email.toLowerCase();
  //Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  //Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(
      new ErrorResponse('Email Doesnt exist. Please click on join now', 401)
    );
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Email and Password dont match', 401));
  }

  user.password = '';

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken(user);

  res.status(statusCode).json({ success: true, token, user });
};
