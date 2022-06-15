const crypto = require('crypto')
const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')
const bcrypt = require('bcryptjs');
const genUsername = require("unique-username-generator");
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util')
// const sendEmail = require('../utils/email_old')
const Email = require('../utils/email');
const { CLIENT_API } = require('../config/Constant');


// generate jwt
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

// create token and send back with res
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  // set HTTP Only Cookie // expire in 30d
  const cookieOptions = {
    expire: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true // it is work only for https;
  }

  res.status(200).cookie('jwt', token, cookieOptions);


  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: user
  })
}

// generate username by email 
const generateUsername = async (email) => {
  let username = genUsername.generateFromEmail(email, 4);
  const userExist = await User.findOne({ 'username': username })

  if (userExist) {
    username = genUsername.generateFromEmail(email, 4);
    generateUsername(email)
  }

  return username;
}

// CREATE USER
exports.userRegister = catchAsync(async (req, res, next) => {
  //input data
  const { firstName, lastName, email, password } = req.body;

  //check user
  const userExist = await User.findOne({ 'email': email })
  if (userExist && !userExist.isEmailVerified) {
    return res.status(200).json({
      success: false,
      message: "Please verify your email to complete registration process"
    })
  }

  if (userExist) {
    return res.status(200).json({
      success: false,
      message: "User already exist."
    })
  }

  const username = await generateUsername(email);

  // hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt)

  // create new user
  const newUser = await User.create({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword
  })

  //send welcome mail
  // const url = `${req.protocol}://${req.get('host')}/profile/${newUser.username}`
  // await new Email(newUser, url).sendWelcome()

  // after create an new account auto login
  // createSendToken(newUser, 201, res)


  // Remove the password from the output
  newUser.password = undefined;
  res.status(201).json({
    success: true,
    data: newUser,
    message: "New user registered. Mail not verified yet"
  })
})


// LOGIN USER // AUTHENTICATION PART-1
exports.userLogin = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;

  // 1) check email and password
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400))
  }

  // 2) match email and password with db
  const user = await User.findOne({ email })

  if (!user.isEmailVerified) {
    return res.status(200).json({
      success: false,
      message: "Please verify your email address"
    })
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const { password: passwordAsP, ...userWithoutPass } = user._doc;

  // 3) everything is ok. send response to client.
  createSendToken(userWithoutPass, 200, res)

})

// PROTECT // AUTHENTICATION PART-2
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Your are not logged in!. Please login to get access.'));
  }

  // 2) Verification Token // if some one manipulate the token
  // callback function call after complete the verification.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded); //{ id: '623ebc728a89e87f9fbd8ceb', iat: 1648286515, exp: 1648372915 }


  // 3) Check if user still exist // user deleted after login
  const freshUser = await User.findById({ _id: decoded.id });
  if (!freshUser) {
    return next(new AppError("The user belonging to this token dose no longer exist."))
  }

  // 4) Check if user change password after the token  was issued.
  // error password change after login.
  // if (freshUser.changePasswordAfter(decoded.iat)) {
  //   return next(new AppError("User recently changed password! Please login again.", 401));
  // }

  //GRANT ACCESS TO PROTECTED ROUTE.
  freshUser.password = undefined;
  req.user = freshUser;
  next();
})


// FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "There is no user with this email address!"
    })
  }

  //2) Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  // const resetUrl = `https://localhost:3000/reset-password/${resetToken}`
  const resetUrl = `${CLIENT_API}/reset-password/${resetToken}`
  // const textMessage = `Forgot your password? \n
  //                     Submit a PATCH request with your new-password and password confirm to: \n
  //                     ${resetUrl} \n
  //                     If you did not forget your password please ignore this email!`
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for only 10 minutes)',
    //   textMessage
    // })

    await new Email(user, resetUrl).sendResetPassword();

    return res.status(200).json({
      success: true,
      message: 'Token sent to email!'
    })
  } catch (err) {

    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: false,
      message: 'There was an error sending the email. Try again later!'
    })
  }
})

// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpire: { $gt: Date.now() } });

  // 2) If token has not expired, and there is user, set the new password.
  if (!user) {
    return res.json({
      success: false,
      message: "Token is invalid or has expired"
    })
  }
  // hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  user.password = hashedPassword
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) Update changePasswordAt property for the user

  //4) Login the user, send JWT
  // createSendToken(user, 201, res)

  // Remove the password from the output
  user.password = undefined;

  res.status(200).json({
    success: true,
    data: "Password reset success"
  })
})


//SEND VERIFICATION MAIL
exports.sendEmailVerificationLink = catchAsync(async (req, res, next) => {

  //1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "User not found with this email. Please create an account"
    })
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      success: false,
      message: "Email is already verified"
    })
  }

  //2) Generate random reset token
  const resetToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  const resetUrl = `${CLIENT_API}/verify-email/${resetToken}`

  try {
    await new Email(user, resetUrl).sendEmailVerificationMail();

    return res.status(200).json({
      success: true,
      message: 'Verification link has sent'
    })
  } catch (err) {
    console.log(err);
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: false,
      message: 'There was an error sending the email. Try again later!'
    })
  }
})

//EMAIL VERIFICATION COMPLETE
exports.emailVerificationComplete = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({ emailVerificationToken: hashedToken, emailVerificationExpires: { $gt: Date.now() } });

  // 2) If token has not expired, and there is user, set the new password.
  if (!user) {
    return res.json({
      success: false,
      message: "Link is invalid or has expired"
    })
  }

  //verified
  user.isEmailVerified = true
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    data: "Email verification complete"
  })
})

exports.sendEmailVerificationLinkForNewMail = catchAsync(async (req, res, next) => {
  const user = {
    firstName: req.body.firstName,
    email: req.body.email
  }

  const currentUser = await User.findById(req.user.id)

  //1) Generate random reset token
  const resetToken = currentUser.createEmailVerificationToken();
  await currentUser.save({ validateBeforeSave: false });

  //2) Send it to user's email
  const resetUrl = `${CLIENT_API}/verify-email/new/${resetToken}`

  await currentUser.updateOne({ newEmail: req.body.email });

  try {
    await new Email(user, resetUrl).sendEmailVerificationMail();

    return res.status(200).json({
      success: true,
      message: 'Verification link has sent'
    })
  } catch (err) {
    console.log(err);
    currentUser.emailVerificationToken = undefined;
    currentUser.emailVerificationExpires = undefined;
    await currentUser.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: false,
      message: 'There was an error sending the email. Try again later!'
    })
  }
})



exports.emailVerificationCompleteForNewMail = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({ emailVerificationToken: hashedToken, emailVerificationExpires: { $gt: Date.now() } });

  // 2) If token has not expired, and there is user, set the new password.
  if (!user) {
    return res.json({
      success: false,
      message: "Link is invalid or has expired"
    })
  }

  //verified
  user.email = user.newEmail
  user.isEmailVerified = true
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  user.newEmail = undefined
  await user.save();

  console.log(user);
  
  res.status(200).json({
    success: true,
    data: "Email verification complete"
  })

})


exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};