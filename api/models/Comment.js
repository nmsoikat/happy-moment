const { Schema, model } = require("mongoose")

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  replies: [{
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  }, ],
}, {
  timeStamps: true
})

module.exports  = model("Comment", commentSchema)