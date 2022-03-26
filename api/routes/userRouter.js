const router = require('express').Router();
const { userUpdateById, userDeleteById, userGetAll, userFollow, userUnfollow, userGetFriendsAndFollower, userGetBySearch } = require('../controllers/userController');

// UPDATE USER
router.put('/:id', userUpdateById)

// DELETE USER
router.delete('/:id', userDeleteById)

// GET A USER by Id and username
router.get('/', userGetAll)

// FOLLOW 
router.put('/:id/follow', userFollow)

// UNFOLLOW
router.put('/:id/unfollow', userUnfollow)

// FRIENDS AND FOLLOWER
router.get('/friends/:userId', userGetFriendsAndFollower)

// SEARCH FRIENDS
router.get('/search', userGetBySearch)

module.exports = router;