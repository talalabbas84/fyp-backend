const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please Add a title']
  },
  description: {
    type: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', songSchema);
