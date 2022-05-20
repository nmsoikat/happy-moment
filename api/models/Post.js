const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  },
  comments:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  postType:{
    type: String,
    default: 'public',
    enum: ['public', 'private', 'friends']
  }

}, { timestamps: true })

module.exports = mongoose.model("Post", PostSchema)