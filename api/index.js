require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');

// ROUTER
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');
const conversationRouter = require('./routes/conversationRouter');
const messageRouter = require('./routes/messageRouter');

// APP
const app = express();

// CONNECTION
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to mongoDB');
}).catch(err => {
  console.log(err);
})


// if made any request for /images 
// don't make any request just go to /public/images directory
app.use('/images', express.static(path.join(__dirname, "/public/images")))
// app.use('/images', express.static(`${__dirname}/public/images`))


// MIDDLEWARE
app.use(express.json()) // body parser
app.use(helmet())
app.use(morgan('common'));


// MULTER | FILE UPLOAD
const DESTINATION_PATH = "api/public/images/post";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DESTINATION_PATH);
  },
  filename: async (req, file, cb) => {

      const fileName = req.params.fileName


      cb(null, fileName);
  }
})

const upload = multer({
  // dest: DESTINATION_PATH,
  storage: storage,
  limits: {
    fileSize: 10000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "file") {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
      } 
      // else {
      //   cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
      // }

      console.log(file);
      return;
    }
  }
});

app.post('/api/v1/upload/:fileName', upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully.");
  } catch (err) {
    console.log(err);
  }
})


// USE ROUTE
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/conversation', conversationRouter);
app.use('/api/v1/message', messageRouter);

app.get('/api/v1', (req, res) => {
  res.send('API is running')
})


// LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Backend Server is Running On:' + PORT);
})