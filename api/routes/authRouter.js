const router = require('express').Router();
const {userRegister, userLogin, forgotPassword, resetPassword, sendEmailVerificationLink, sendEmailVerificationLinkForNewMail, emailVerificationCompleteForNewMail, emailVerificationComplete, logout, protect}  = require('../controllers/authController')

//REGISTER
router.route('/register').post(userRegister)

//LOGIN
router.route('/login').post(userLogin)

//FORGOT PASSWORD // only receive email address
router.route('/forgot-password').post(forgotPassword)

//RESET PASSWORD // receive token and new password
router.route('/reset-password/:token').patch(resetPassword)


//VERIFY EMAIL
router.route('/verify-email').post(sendEmailVerificationLink)
router.route('/verify-email/new').post(protect, sendEmailVerificationLinkForNewMail)

//VERIFIED ACCOUNT 
router.route('/email-verification-complete/:token').patch(emailVerificationComplete)
router.route('/email-verification-complete/new/:token').patch(protect, emailVerificationCompleteForNewMail)


router.route('/logout').get(logout)

module.exports = router;