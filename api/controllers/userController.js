const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


// UPDATE PROFILE PICTURE
exports.userProfileImgUpdateById = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("File upload failed", 400))
  }

  //only logged in user or admin
  if (req.body.userId !== req.params.id) {
    return next(new AppError("You can update only your account!", 400))
  }

  let user;
  if (req.file.destination.split('/').includes('personCover')) {
    user = await User.findByIdAndUpdate(req.params.id, {
      $set: { coverPicture: req.file.filename }
    });
  } else{
    user = await User.findByIdAndUpdate(req.params.id, {
      $set: { profilePicture: req.file.filename }
    });
  }

  if (!user) {
    return next(new AppError("Update failed", 400))
  }

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user: user
    }
  })
})

// UPDATE USER
exports.userUpdateById = catchAsync(async (req, res, next) => {
  //only logged in user or admin
  if (req.body.userId !== req.params.id || !req.body.isAdmin) {
    return next(new AppError("You can update only your account!", 400))
  }

  const user = await User.findByIdAndUpdate(req.params.id, {
    $set: req.body
  });

  res.status(200).json("Account has been updated");
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
