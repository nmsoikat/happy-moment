const router = require('express').Router();
const { messageCreateOne, messageGetByConvId } = require('../controllers/messageController');

// Add message
router.post('/', messageCreateOne)

// Get message
router.get('/:conversationId', messageGetByConvId)

module.exports = router;