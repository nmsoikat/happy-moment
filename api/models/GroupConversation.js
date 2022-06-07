const mongoose = require('mongoose')

const GroupConversationSchema = mongoose.Schema({
  members: {
    type: Array
  },
  profilePic: {
    type: String,
    default: ""
  },
  groupName: {
    type: String
  },
  admin: {
    type: String
  }

}, { timestamps: true })

module.exports = mongoose.model("GroupConversation", GroupConversationSchema)