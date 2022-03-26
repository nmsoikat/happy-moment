const router = require('express').Router();
const { convCreateOne, convGetByUId, convGetByTwoUId } = require('../controllers/conversationController');

//new conversation
router.post('/', convCreateOne)


//get conversation
router.get('/:userId', convGetByUId)

//get conversation by two user
router.get('/find/:firstUserId/:secondUserId', convGetByTwoUId)


module.exports = router;