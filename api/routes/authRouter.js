const router = require('express').Router();
const {userRegister, userLogin}  = require('../controllers/authController')

//REGISTER
router.route('/register').post(userRegister)

// LOGIN
router.route('/login').post(userLogin)


module.exports = router;