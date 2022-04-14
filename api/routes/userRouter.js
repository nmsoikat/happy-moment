const router = require('express').Router();
const { protect } = require('../controllers/authController');
const {sendFriendRequest, userUpdateById, userProfileImgUpdateById,usernameUpdateById, userDeleteById, userGetByIdOrUsername, userFollow, userUnfollow, usersGetAll, userGetFriendsAndFollower, confirmFriendRequest, deleteFriendRequest, cancelFriendRequest } = require('../controllers/userController');
const { setDestination, uploadFile } = require('../middlewares/fileUploadMiddleware');



// GET A USER by Id and username
router.get('/', usersGetAll)
// GET All Users
router.get('/single', userGetByIdOrUsername)

// UPDATE PROFILE PICTURE
router.put('/profile-pic/:id', protect, setDestination('/images/person'), uploadFile, userProfileImgUpdateById)
router.put('/profile-cover/:id', protect, setDestination('/images/personCover'), uploadFile, userProfileImgUpdateById)

// UPDATE USERNAME
router.put('/username/:id', protect, usernameUpdateById)

// UPDATE USER
router.patch('/:id', protect, userUpdateById)

// DELETE USER
router.delete('/:id', protect, userDeleteById)

// SEND FRIEND REQUEST
router.put('/:id/send-request', protect, sendFriendRequest)
router.put('/:id/confirm-request', protect, confirmFriendRequest)
router.put('/:id/delete-request', protect, deleteFriendRequest)
router.put('/:id/cancel-request', protect, cancelFriendRequest)

// FOLLOW 
router.put('/:id/follow', userFollow)

// UNFOLLOW
router.put('/:id/unfollow', userUnfollow)

// FRIENDS AND FOLLOWER
router.get('/friends/:userId', userGetFriendsAndFollower)


module.exports = router;