const router = require('express').Router();
const { protect } = require('../controllers/authController');
const { userUpdateById, userProfileImgUpdateById, userDeleteById, userGetAll, userFollow, userUnfollow, userGetFriendsAndFollower, userGetBySearch } = require('../controllers/userController');
const { setDestination, uploadFile } = require('../middlewares/fileUploadMiddleware');


// UPDATE PROFILE PICTURE
router.put('/profile-pic/:id', protect, setDestination('/images/person'), uploadFile, userProfileImgUpdateById)
router.put('/profile-cover/:id', protect, setDestination('/images/personCover'), uploadFile, userProfileImgUpdateById)

// UPDATE USER
router.put('/:id', protect, userUpdateById)

// DELETE USER
router.delete('/:id', protect, userDeleteById)

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