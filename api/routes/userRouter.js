const router = require('express').Router();
const { protect } = require('../controllers/authController');
const {sendFriendRequest, userUpdateById, userProfileImgUpdateById,usernameUpdateById, userUpdatePasswordById, userDeleteById, userGetByIdOrUsername, userFollow, userUnfollow, usersGetAll, userGetFriends, confirmFriendRequest, deleteFriendRequest, cancelFriendRequest, userGetFriendsSentReq, userGetFriendsReq, unfriendUser } = require('../controllers/userController');
const { setDestination, uploadFile } = require('../middlewares/fileUploadMiddleware');



// GET A USER by Id and username
router.get('/', protect, usersGetAll)

// GET All Users
router.get('/single', userGetByIdOrUsername)

// UPDATE PASSWORD  
router.put('/change-password/:id', protect, userUpdatePasswordById)

// UPDATE PROFILE PICTURE
router.put('/profile-pic/:id', protect, setDestination('/images/person'), uploadFile, userProfileImgUpdateById)
router.put('/profile-cover/:id', protect, setDestination('/images/personCover'), uploadFile, userProfileImgUpdateById)

// UPDATE USERNAME
router.put('/username/:id', protect, usernameUpdateById)

// UPDATE USER
router.patch('/:id', protect, userUpdateById)

// DELETE USER
router.delete('/:id', protect, userDeleteById)

// FRIEND REQUEST
router.put('/friends/:id/send-request', protect, sendFriendRequest)
router.put('/friends/:id/confirm-request', protect, confirmFriendRequest)
router.put('/friends/:id/delete-request', protect, deleteFriendRequest)
router.put('/friends/:id/cancel-request', protect, cancelFriendRequest)
router.put('/friends/:id/unfriend', protect, unfriendUser)

// GET FRIENDS
router.get('/friends/:userId', protect, userGetFriends)
router.get('/friends/view-sent-req/:userId', protect, userGetFriendsSentReq)
router.get('/friends/view-friend-request/:userId', protect, userGetFriendsReq)

// FOLLOW 
router.put('/:id/follow', userFollow)

// UNFOLLOW
router.put('/:id/unfollow', userUnfollow)

// FRIENDS AND FOLLOWER//old
// router.get('/friends/:userId', userGetFriendsAndFollower)


module.exports = router;