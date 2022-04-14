const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Post should have an author'],
  },
  desc: {
    type: String,
    max: 500,
  },
  photo: {
    type: String
  },
  video: {
    type: String
  },
  likes: {
    type: Array,
    default: []
  }

}, { timestamps: true })

module.exports = mongoose.model("Post", PostSchema)