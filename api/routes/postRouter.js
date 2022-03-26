const router = require('express').Router();
const { protect } = require('../controllers/authController');
const { postCreateOne, postUpdateById, postDeleteById, postLikeById, postGetById, postGetForTimeline, postGetByUsername } = require('../controllers/postController');

// create a post
router.post('/', postCreateOne)


// update a post
router.put('/:id', postUpdateById)


// delete a post
router.delete('/:id', postDeleteById)


// like //dislike a post
router.put('/:id/like', postLikeById)


// get a post
router.get('/:id', protect, postGetById)


// get timelines posts
router.get('/timeline/:userId', protect, postGetForTimeline)

// get user's all posts
router.get('/profile/:username',protect, postGetByUsername)

module.exports = router;