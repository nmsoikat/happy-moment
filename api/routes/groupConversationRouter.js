const router = require('express').Router();
const { createNewChatGroup, addGroupMember, removeGroupMember, getMyConversationGroupList } = require('../controllers/groupConversationController');
const { protect } = require('../controllers/authController');

// create group
router.route('/')
      .post(protect, createNewChatGroup)
      .get(protect, getMyConversationGroupList)

router.put('/add-member/:groupId', protect, addGroupMember)
router.put('/remove-member/:groupId', protect, removeGroupMember)

module.exports = router;