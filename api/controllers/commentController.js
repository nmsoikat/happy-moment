const Comment = require("../models/Comment")
const Post = require("../models/Post")
const catchAsync = require("../utils/catchAsync")

exports.commentCreateOne = catchAsync(async (req, res, next) => {
  const { postId } = req.params
  const { data } = req.body

  // create comment doc
  const comment = new Comment({
    postId,
    userId: req.user._id,
    body: data,
    replies: [],
  })

  // save comment
  const currentComment = await comment.save()

  // push commentId to post table
  await Post.findOneAndUpdate({
    _id: postId
  }, {
    $push: {
      comments: currentComment._id,
    },
  })

  // populate comment and send to user
  const commentData = await Comment.findById(currentComment._id)
  .populate({
    path: "userId",
    select: "firstName lastName profilePicture",
  })

  return res.status(201).json(commentData)

})

exports.commentReplyCreate = catchAsync(async (req, res, next) => {
  const { commentId } = req.params
  const { data } = req.body

  const reply = {
    userId: req.user._id,
    body:data
  }

  // find current comment
  await Comment.findOneAndUpdate({
    _id: commentId
  }, {
    $push: {
      replies: reply,
    },
  })

  // send response
  res.status(201).json({
    ...reply,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    profilePicture: req.user.profilePicture,
  })

})

exports.commentGetById = catchAsync(async (req, res, next) => {
  const { commentId } = req.params

  // find current comment
  const comment = await Comment.findById(commentId)

  // send response
  res.status(201).json(comment)

})