const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');

//REGISTER
router.post('/register', async (req, res) => {
  try {
    //input data
    const { username, email, password, profilePicture, coverPicture, desc } = req.body;

    // hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt)

    // create new user
    const user = await new User({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      coverPicture,
      desc
    })

    // save user and response
    await user.save()
    res.status(200).json(user)


  } catch (err) {
    res.status(500).json(err)
  }
})


// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ err: "user not found" })
      return
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      res.status(400).json("Email or password is wrong")
      return
    }

    const { password: passwordAsP, ...userWithoutPass } = user._doc;

    res.status(200).json(userWithoutPass);
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router;