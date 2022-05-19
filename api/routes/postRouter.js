const router = require('express').Router();
const { protect } = require('../controllers/authController');
const { postCreateOne, postUpdateById, postDeleteById, postLikeById, postGetById, postGetForTimeline, postGetByUsername, postGetForTimelineOnlyVideos, postGetForTimelineTrending } = require('../controllers/postController');

// create a post
router.post('/', protect, postCreateOne)

// update a post
router.put('/:id', protect, postUpdateById)


// delete a post
router.delete('/:id', protect, postDeleteById)


// like //dislike a post
router.put('/:id/like', protect, postLikeById)


// get a post
router.get('/:id', protect, postGetById)


// get timelines posts
router.get('/timeline/:userId/all',protect, postGetForTimeline)
router.get('/timeline-video/:userId/all',protect, postGetForTimelineOnlyVideos)
router.get('/timeline/tending',protect, postGetForTimelineTrending)

// get user's all posts
router.get('/profile/:username/all',protect, postGetByUsername)

module.exports = router;