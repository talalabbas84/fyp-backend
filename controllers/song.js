const asynchandler = require(`../middleware/async`);
const ErrorResponse = require(`../utils/errorResponse`);
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// @desc Upload photo for bootcamp
//@route PUT /api/v1/bootcamps/:id/photo

const Song = require('../models/Song');
const asyncHandler = require('../middleware/async');

// @access Private
exports.addSong = asynchandler(async (req, res, next) => {
  // const user = await User.findById(req.params.id);
  console.log(req.body.text);
  const user = req.user;
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user._id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  console.log(file.mimetype);

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('audio/mpeg')) {
    return next(new ErrorResponse(`Please upload a song file`, 400));
  }
  // if (file.size > process.env.MAX_FILE_UPLOAD) {
  //   return next(
  //     new ErrorResponse(
  //       `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //       400
  //     )
  //   );
  // }

  //Create custom filename
  file.name = `audio_${uuidv4()}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    // await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    const song = await Song.create({
      description: req.body.description,
      user: req.user._id,
      url: file.name
    });
    return res.status(200).json({ success: true, data: song });
  });
});

exports.getSongs = asynchandler(async (req, res, next) => {
  const songs = await Song.find({}).populate('user');
  // if (songs) {
  return res.status(200).json({ success: true, data: songs });
  // }
});

exports.getSongById =  asyncHandler(async(req,res,next) => {
  const song = await Song.findById(req.params.id).populate('user');
   return res.status(200).json({ success: true, data: song });
})