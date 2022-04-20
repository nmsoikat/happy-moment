const router = require('express').Router();
const { convCreateOne, convGetByUId, convGetByTwoUId, searchMyFriends } = require('../controllers/conversationController');
const { protect } = require('../controllers/authController');

// get friends //search
router.get('/friends', protect, searchMyFriends)

//get conversation
router.get('/:userId', protect, convGetByUId)

//new conversation
router.post('/', protect, convCreateOne)

//get conversation by two user
router.get('/find/:firstUserId/:secondUserId', protect, convGetByTwoUId)


module.exports = router;