const asynchandler = require(`../middleware/async`);
const ErrorResponse = require(`../utils/errorResponse`);
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const WaveFile = require('wavefile').WaveFile;
const tone = require('tonegenerator');
const wav = require('wav');

const cloudinary = require('cloudinary').v2;
// @desc Upload photo for bootcamp
//@route PUT /api/v1/bootcamps/:id/photo

cloudinary.config({
  cloud_name: 'dkmctcivw',
  api_key: '684775128763765',
  api_secret: 'SSNzQQozA412eYAEgUae502s4lg'
});

CLOUDINARY_URL =
  'cloudinary://684775128763765:SSNzQQozA412eYAEgUae502s4lg@dkmctcivw';

const Song = require('../models/Song');
const asyncHandler = require('../middleware/async');

// @access Private
exports.addSong = asynchandler(async (req, res, next) => {
  // const user = await User.findById(req.params.id);
  // console.log(req.body.text);
  const user = req.body._id;
  console.log(user);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
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
      user: req.body._id,
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

exports.getSongById = asyncHandler(async (req, res, next) => {
  const song = await Song.findById(req.params.id).populate('user');
  return res.status(200).json({ success: true, data: song });
});

exports.getSongbyLyrics = asyncHandler(async (req, res, next) => {
  const lyrics = req.body.lyrics;

  let dataa = {};

  axios
    .get(`http://localhost:5000/generate?lyrics=${lyrics}`)
    .then(async response => {
      console.log('Cloudinary');
      console.log(response.data);
      song_url_from_api = '';
      dataa = await cloudinary.uploader.upload(
        '/home/remu/Desktop/FYP/fyp-model-backend/test.wav',
        {
          resource_type: 'video',
          overwrite: true
        },
        function (error, result) {
          if (result) {
            song_url_from_api = result.url;
          }
        }
      );

      if (dataa) {
        return res.status(200).json({
          success: true,
          data: song_url_from_api,
          duration: dataa.duration
        });
      }

      // console.log(response);
      // console.log();
      // fs.
      // var buf = new Buffer(response, 'base64'); // decode
      // fs.writeFile('temp/test.wav', buf, function (err) {
      //   if (err) {
      //     console.log('err', err);
      //   } else {
      //     return res.json({ status: 'success' });
      //   }
      // });
      // fs.writeFile('<fileName>',<contenet>, callbackFunction)
      // console.log(response.data);
      // let wav = new WaveFile(response.toString());
      // console.log(wav.container);
      // console.log(wav.chunkSize);
      // console.log(wav.fmt.chunkId);
      // console.log(response.toString())
      // const test = fs.readFileSync(response);
      // test.mv(`${process.env.FILE_UPLOAD_PATH}/test`, async err => {});
      // const test = fs.writeFileSync('test.wav', response.data);
      // const writer = new wav.FileWriter(response.data);

      // writer.write(new Buffer(tone(220, 5))); // 220Hz for 5 seconds
      // writer.end();
      // console.log(test);
    })
    .catch(e => {
      return next(
        new ErrorResponse(
          `Music will only be generated with english words`,
          500
        )
      );
    });
});
