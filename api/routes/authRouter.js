const router = require('express').Router();
const {userRegister, userLogin, forgotPassword, resetPassword}  = require('../controllers/authController')

//REGISTER
router.route('/register').post(userRegister)

//LOGIN
router.route('/login').post(userLogin)

//FORGOT PASSWORD // only receive email address
router.route('/forgot-password').post(forgotPassword)

//RESET PASSWORD // receive token and new password
router.route('/reset-password/:token').patch(resetPassword)


module.exports = router;