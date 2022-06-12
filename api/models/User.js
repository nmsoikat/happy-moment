const crypto = require('crypto')
const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    min: 2,
    max: 20,
    required: [true, 'Please provide first name.']
  },
  lastName: {
    type: String,
    min: 2,
    max: 20,
    required: [true, 'Please provide last name.']
  },
  username: {
    type: String,
    min: 3,
    max: 30,
    unique: true
  },
  email: {
    type: String,
    max: 50,
    unique: true,
    required: [true, 'Please provide email.'],
  },
  password: {
    type: String,
    min: 6,
    required: [true, 'Please provide password.'],
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
  friends: {
    type: Array,
    default: []
  },
  friendsRequest: {
    type: Array,
    default: []
  },
  friendsSentRequest: {
    type: Array,
    default: []
  },
  desc: {
    type: String,
    maxLength: 100,
    default: ''
  },
  livesIn: {
    type: String,
    maxLength: 100,
    default: ''
  },
  from: {
    type: String,
    maxLength: 100,
    default: ''
  },
  relationship: {
    type: Number,
    default: 1,
    enum: [1, 2, 3]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  changePasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,

}, { timestamps: true })

//forgot password // reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.passwordResetExpires = Date.now() + (10 * 60 * 1000) //expire in 10 minutes // current time + 10 minute

  return resetToken;
}

//email verification token
UserSchema.methods.createEmailVerificationToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.emailVerificationExpires = Date.now() + (10 * 60 * 1000) //expire in 10 minutes // current time + 10 minute

  return resetToken;
}

//when password has changed. 
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.changePasswordAt = Date.now() - 1000; // -1s for make sure token has been created after password change.
  next()
})

module.exports = mongoose.model("User", UserSchema)