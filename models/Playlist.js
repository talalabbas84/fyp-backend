const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Add a name']
  },
  song: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    ref: 'Song'
  },
  description: {
    type: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Playlist', songSchema);
