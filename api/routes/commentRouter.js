const router = require('express').Router();
const { protect } = require('../controllers/authController');
const { commentCreateOne, commentReplyCreate, commentGetById} = require('../controllers/commentController');

// create a post
router.post('/create-comment/:postId', protect, commentCreateOne)

// update a post
router.post('/create-reply/:commentId', protect, commentReplyCreate)

router.get('/:commentId', protect, commentGetById)

module.exports = router;