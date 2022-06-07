const Conversation = require('../models/Conversation');
const GroupConversation = require('../models/GroupConversation');
const User = require('../models/User');
const AppError = require('../utils/appError');

//search friends from current user friend list
exports.searchMyFriends = async (req, res) => {
  const loggedInUser = req.user;
  try {
    const searchText = req.query.searchUser
    if (!searchText) return next();

    //friend list ids
    const friendsId = await User.findById(loggedInUser._id).select('friends')

    const query = {
      $and: [
        { _id: { $in: friendsId.friends } },
        {
          $or: [
            { firstName: { $regex: new RegExp(searchText, 'i') } },
            { lastName: { $regex: new RegExp(searchText, 'i') } }
          ]
        }
      ]
    }

    const friendsData = await User.find(query).select('-password');

    res.status(200).json(friendsData);
  } catch (err) {
    return res.status(500).json(err)
  }
}

//new conversation
exports.convCreateOne = async (req, res, next) => {
  const exist = await Conversation.findOne({ members: { $all: [req.body.senderId, req.body.receiverId] } })
  if (exist) {
    return next(new AppError("conversation already created"))
  }

  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  })

  try {
    const savedConversation = await newConversation.save()

    res.status(200).json(savedConversation)
  } catch (err) {
    res.status(500).json(err)
  }
}

//get conversation
exports.convGetByUId = async (req, res) => {
  try {
    const conversation = await Conversation.find({ members: { $in: [req.params.userId] } })

    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err)
  }
}

//get conversation by two user
exports.convGetByTwoUId = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] }
    })
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err)
  }
}