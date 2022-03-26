const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  firstName:{
    type:String,
    min: 2,
    max: 20,
    required: true
  },
  lastName:{
    type:String,
    min: 2,
    max: 20,
    required: true
  },
  username: {
    type: String,
    min: 3,
    max: 30,
    unique: true
  },
  email: {
    type: String,
    required: true,
    max:50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  profilePicture: {
    type: String,
    default: ""
  },
  coverPicture: {
    type: String,
    default: ""
  },
  followers: {
    type: Array,
    default: []
  },
  followings: {
    type: Array,
    default: []
  },
  friends:{
    type: Array,
    default: []
  },
  friendsRequest:{
    type: Array,
    default: []
  },
  friendsSentRequest:{
    type: Array,
    default: []
  },  
  desc:{
    type: String,
    maxLength: 50,
  },
  livesIn: {
    type: String,
    maxLength: 50
  },
  from:{
    type: String,
    maxLength: 50
  },
  relationship: {
    type: Number,
    enum: [1,2,3]
  },
  isAdmin:{
    type: Boolean,
    default: false
  }
  
},{timestamps: true})

module.exports = mongoose.model("User", UserSchema)