const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


// UPDATE PROFILE PICTURE
exports.userProfileImgUpdateById = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("File upload failed", 400))
  }

  //only logged in user
  if (req.body.userId !== req.params.id) {
    return next(new AppError("You can update only your account!", 400))
  }

  let user;
  if (req.file.destination.split('/').includes('personCover')) {
    user = await User.findByIdAndUpdate(req.params.id, {
      $set: { coverPicture: req.file.filename }
    });
  } else {
    user = await User.findByIdAndUpdate(req.params.id, {
      $set: { profilePicture: req.file.filename }
    });
  }

  //$set if there is field create new one

  if (!user) {
    return next(new AppError("Update failed", 400))
  }

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: user
  })
})

// UPDATE USER
exports.userUpdateById = catchAsync(async (req, res, next) => {
  //only logged in user
  if (req.body.userId !== req.params.id) {
    return next(new AppError("You can update only your account!", 400))
  }

  const { firstName, lastName, desc, livesIn, from } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id,
    { firstName, lastName, desc, livesIn, from },
    { new: true } //return updated doc instead old doc
  );

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: user
  })
})

// UPDATE USERNAME
exports.usernameUpdateById = catchAsync(async (req, res, next) => {
  //only logged in user
  if (req.body.userId !== req.params.id) {
    return next(new AppError("You can update only your account!", 400))
  }

  const userExist = await User.findOne({ 'username': req.body.username })
  if (userExist) {
    return next(new AppError("Username already exist", 400))
  }

  const user = await User.findByIdAndUpdate(req.params.id, { username: req.body.username }, { new: true });

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: user
  })
})

// DELETE USER
exports.userDeleteById = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json('you can delete only your account!')
  }
}

// GET A USER by Id and username
exports.userGetAll = async (req, res) => {
  try {
    const userId = req.query.id
    const username = req.query.username
    const user = userId ? await User.findById(userId) : await User.findOne({ username });
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err)
  }
}

// SEND FRIEND REQUEST
exports.sendFriendRequest = async (req, res, next) => {
  const targetUserId = req.params.id;
  const currentUserId = req.body.userId;

  //same user cannot be friend
  if (currentUserId === targetUserId) {
    return next(new AppError("You can not send friend request yourself", 400))
  }

  //find
  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId)

  //not exist user
  if (!targetUser || !currentUser) {
    return next(new AppError("User not exist", 400))
  }

  // check user already friend or requested
  if (targetUser.friends.includes(currentUserId) || targetUser.friendsRequest.includes(currentUserId)) {
    return next(new AppError("You already sent request or friend of this user", 400))
  }

  // send friend request
  await targetUser.updateOne({ $push: { friendsRequest: currentUserId } })
  await currentUser.updateOne({ $push: { friendsSentRequest: targetUserId } })

  res.status(200).json({
    status: 'success'
  })
}

// CONFIRM FRIEND REQUEST
exports.confirmFriendRequest = async (req, res, next) => {
  const targetUserId = req.params.id;
  const currentUserId = req.body.userId;

  //same user cannot be friend
  if (currentUserId === targetUserId) {
    return next(new AppError("You can not confirm friend yourself", 400))
  }

  //find
  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId)

  //not exist user
  if (!targetUser || !currentUser) {
    return next(new AppError("User not exist", 400))
  }

  // check user not exist in pending list
  if (!currentUser.friendsRequest.includes(targetUserId) && !targetUser.friendsSentRequest.includes(currentUserId)) {
    return next(new AppError("user not exist in pending list", 400))
  }


  // check user already friend
  if (currentUser.friends.includes(targetUserId)) {
    return next(new AppError("You already friend of this user", 400))
  }

  // confirm friend
  await currentUser.updateOne({ $push: { friends: targetUserId } })
  await targetUser.updateOne({ $push: { friends: currentUserId } })

  // remove from friend request pending list
  await currentUser.updateOne({ $pull: { friendsRequest: targetUserId } })
  await targetUser.updateOne({ $pull: { friendsSentRequest: currentUserId } })


  res.status(200).json({
    status: 'success'
  })
}

// DELETE FRIEND REQUEST
exports.deleteFriendRequest = async (req, res, next) => {
  const targetUserId = req.params.id;
  const currentUserId = req.body.userId;

  //same user cannot be friend
  if (currentUserId === targetUserId) {
    return next(new AppError("You can not confirm friend yourself", 400))
  }

  //find
  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId)

  //not exist user
  if (!targetUser || !currentUser) {
    return next(new AppError("User not exist", 400))
  }

  // check user not exist in pending list
  if (!currentUser.friendsRequest.includes(targetUserId) && !targetUser.friendsSentRequest.includes(currentUserId)) {
    return next(new AppError("user not exist in pending list", 400))
  }


  // check user already friend
  if (currentUser.friends.includes(targetUserId)) {
    return next(new AppError("You already friend of this user", 400))
  }

  // confirm friend
  await currentUser.updateOne({ $push: { friends: targetUserId } })
  await targetUser.updateOne({ $push: { friends: currentUserId } })

  // remove from friend request pending list
  await currentUser.updateOne({ $pull: { friendsRequest: targetUserId } })
  await targetUser.updateOne({ $pull: { friendsSentRequest: currentUserId } })


  res.status(200).json({
    status: 'success'
  })
}

// CANCEL FRIEND REQUEST
exports.cancelFriendRequest = async (req, res, next) => {
  const targetUserId = req.params.id;
  const currentUserId = req.body.userId;

  //same user cannot be friend
  if (currentUserId === targetUserId) {
    return next(new AppError("You can not send friend request yourself", 400))
  }

  //find
  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId)

  //not exist user
  if (!targetUser || !currentUser) {
    return next(new AppError("User not exist", 400))
  }

  // check user already friend or requested
  if (targetUser.friends.includes(currentUserId) || targetUser.friendsRequest.includes(currentUserId)) {
    return next(new AppError("You already sent request or friend of this user", 400))
  }

  // send friend request
  await targetUser.updateOne({ $push: { friendsRequest: currentUserId } })
  await currentUser.updateOne({ $push: { friendsSentRequest: targetUserId } })

  res.status(200).json({
    status: 'success'
  })
}

// FOLLOW 
exports.userFollow = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId)

    // check user already not followed
    if (!targetUser.followers.includes(req.body.userId)) {
      await targetUser.updateOne({ $push: { followers: req.body.userId } })
      await currentUser.updateOne({ $push: { followings: req.params.id } })
      res.status(200).json("user has been followed");
    } else {
      return res.status(403).json('you already follow this user')
    }
  } else {
    return res.status(403).json('you can not follow yourself')
  }
}

// UNFOLLOW
exports.userUnfollow = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId)

    // check user followed
    if (targetUser.followers.includes(req.body.userId)) {
      await targetUser.updateOne({ $pull: { followers: req.body.userId } })
      await currentUser.updateOne({ $pull: { followings: req.params.id } })
      res.status(200).json("user has been unfollowed");
    } else {
      return res.status(403).json('you already unfollow this user')
    }
  } else {
    return res.status(403).json('you can not unfollow yourself')
  }
}

// FRIENDS AND FOLLOWER
exports.userGetFriendsAndFollower = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId)
      })
    )

    let friendList = [];
    friends.map(friend => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture })
    })

    res.status(200).json(friendList);

  } catch (err) {
    res.status(500).json(err)
  }
}

// SEARCH FRIENDS
exports.userGetBySearch = async (req, res) => {
  const regex = new RegExp(req.query.name, 'i');
  const userFilter = await User.find({ username: regex }, { 'username': 1 })
  res.status(200).json(userFilter);
}
