require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const AppErrorHandler = require('./middlewares/appErrorHandleMiddleware');

// ROUTER
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
const conversationRouter = require('./routes/conversationRouter');
const messageRouter = require('./routes/messageRouter');

// APP
const app = express();

app.set('views', './views')
app.set('view engine', 'pug')

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
app.use(cors())
app.use(express.json()) // body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "file") {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
      }
      if (file.mimetype.split('/')[0] === 'video') {
        cb(null, true)
      }
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
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/conversation', conversationRouter);
app.use('/api/v1/message', messageRouter);

app.get('/api/v1', (req, res) => {
  res.send('API is running')
})


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('API is running (Development)')
  })
}
app.get('/', (req, res) => {
  res.send('API is running')
})

app.use(AppErrorHandler);

// LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Backend Server is Running On:' + PORT);
})