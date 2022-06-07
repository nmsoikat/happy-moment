const GroupConversation = require('../models/GroupConversation');
const User = require('../models/User');
const AppError = require('../utils/appError');

//new chat group
exports.createNewChatGroup = async (req, res, next) => {
  const groupName = req.body.groupName;
  const members = [...req.body.members, req.user._id.toString()]

  try {
    if (members.length < 3) {
      return res.status(200).json({
        success: false,
        message: "A Group should have minimum 3 members"
      })
    }
  
    const exist = await GroupConversation.findOne({ groupName })
    if (exist) {
      return res.status(200).json({
        success: false,
        message: "Group already exist"
      })
    }
  
    const newChatGroup = new GroupConversation({
      groupName,
      members,
      admin: req.user._id.toString()
    })

    const savedGroupConversation = await newChatGroup.save()

    return res.status(201).json({
      success: true,
      data: savedGroupConversation,
      message: "Group created successfully"
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

//chat group list
exports.getMyConversationGroupList = async (req, res, next) => {
  const userId = req.user._id.toString();

  try {    
      const groups = await GroupConversation.find({members: {$in: userId}})
    
      if (!groups.length) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Group list empty"
        })
      }

    return res.status(201).json({
      success: true,
      data: groups,
      message: "Group list"
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

//add member
exports.addGroupMember = async (req, res, next) => {
  const groupId = req.params.groupId
  const members = req.body.members

  try {
    const group = await GroupConversation.findById(groupId)

    if (!group) {
      return res.status(400).json({
        success: false,
        message: "Group not found"
      })
    }

    if (req.user._id.toString() !== group.admin) {
      return res.status(400).json({
        success: false,
        message: "You are not group admin. Only admin can manage group"
      })
    }

    for(let item of group.members){
      if(members.some(member => member === item)){
        return res.status(400).json({
          success: false,
          message: "This member already exist in this group"
        })
      }
    }

    const updatedGroup = await GroupConversation.findByIdAndUpdate(groupId, { $push: { members: { $each: members } } }, { new: true })

    return res.status(201).json({
      success: true,
      data: updatedGroup,
      message: "Member add successfully"
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

//remove member
exports.removeGroupMember = async (req, res, next) => {
  const groupId = req.params.groupId
  const member = req.body.member

  try {
    const group = await GroupConversation.findById(groupId)

    if (!group) {
      return res.status(400).json({
        success: false,
        message: "Group not found"
      })
    }

    if (req.user._id.toString() !== group.admin) {
      return res.status(400).json({
        success: false,
        message: "You are not group admin. Only admin can manage group"
      })
    }

    const updatedGroup = await GroupConversation.findByIdAndUpdate(groupId, { $pull: { members: member } }, { new: true })

    return res.status(201).json({
      success: true,
      data: updatedGroup,
      message: "Member remove successfully"
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}
