const asynchandler = require(`../middleware/async`);
const ErrorResponse = require(`../utils/errorResponse`);
const Playlist = require('../models/Playlist');

exports.createPlaylist = asynchandler(async (req, res, next) => {
  const { name, song, description, user } = req.body;
  const playlist = await Playlist.create({
    name,
    description,
    user
  });
  if (playlist) {
    return res.status(200).json({ success: true, data: playlist });
  } else {
    return next(
      new ErrorResponse(`There is a problem creating the playlist`, 500)
    );
  }
});

exports.addSongToPlaylist = asynchandler(async (req, res, next) => {
  const { song, _id } = req.body;

  const songss = await Playlist.find({ _id: _id, song: { $in: [song] } });
  if (songss && songss.length > 0) {
    {
      return next(
        new ErrorResponse(
          { success: false, message: 'Song already exists in the playlist' },
          500
        )
      );
    }
  }

  // return res.status(200).json({ success: false, data: songss });
  const playlist = await Playlist.findByIdAndUpdate(
    _id,
    { $push: { song: song } },
    {
      new: true
    }
  );
  if (playlist) {
    return res.status(200).json({ success: true, data: playlist });
  } else {
    return next(new ErrorResponse('Problem adding song to playlist', 500));
  }
});

exports.getPlaylistWithId = asynchandler(async (req, res, next) => {
  const playlist = await Playlist.find({ _id: req.params.id }).populate({
    path: 'song user',
    populate: 'user'
  });

  return res.status(200).json({
    success: true,
    data: playlist
    // count: question.length,
    // data: question
  });
});

exports.getPlaylists = asynchandler(async (req, res, next) => {
  const playlists = await Playlist.find({}).populate({
    path: 'user song',
    populate: {
      path: 'user'
    }
  });

  return res.status(200).json({
    success: true,
    data: playlists
  });
});
exports.deletePlaylist = asynchandler(async (req, res, next) => {
  await Playlist.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});
