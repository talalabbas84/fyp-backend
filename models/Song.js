const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please Add a description']
  },
  url: {
    type: String,
    required: [true, 'Please add a url']
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

module.exports = mongoose.model('Song', songSchema);
