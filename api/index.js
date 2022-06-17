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
const groupConversationRouter = require('./routes/groupConversationRouter');
const messageRouter = require('./routes/messageRouter');

// APP
const app = express();

// const http = require('http')
// const server = http.createServer(app)

// const { Server } = require('socket.io')
// const io = new Server(server, {
//   cors: {
//     // origin: 'http://localhost:3000'
//     // origin: 'https://gentle-wind.herokuapp.com'
//     origin: '*'
//   }
// });

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
// let whitelist = ['http://localhost:3000'];
// let whitelist = ['https://gentle-wind.herokuapp.com'];
let whitelist = ['https://gentlewind.netlify.app'];
let corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, credentials: true
}
app.use(cors(corsOptions))
// app.use(cors())
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
app.use('/api/v1/group-conversation', groupConversationRouter);
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

// ----------------------------------------------------------
// ------------------------ Socket --------------------------
// ----------------------------------------------------------

// active users
// let onlineUsers = []

// // user added online
// const addUser = (userId, socketId) => {
//   !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId })
// }

// // remove from online
// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
// }

// // get user
// const getUser = (userId) => {
//   return onlineUsers.find(user => user.userId === userId)
// }

// // every connection
// io.on("connection", (socket) => {
//   // CONNECTED
//   // console.log("A user connected");

//   socket.on('addUser', (userId) => {
//     addUser(userId, socket.id) // set userId and socketId

//     // console.log(onlineUsers);
//     // console.log(`User added: ${socket.id}`);

//     //send to client
//     io.emit("getUsers", onlineUsers) // online users
//   })



//   // SEND AND GET MESSAGE
//   socket.on("sendMessage", ({ senderId, receiverId, text }) => { // receive from client
//     const whoReceive = getUser(receiverId)

//     //send to client //specific
//     io.to(whoReceive?.socketId).emit("getMessage", { senderId, text })
//   })

//   socket.on("sendNotification", ({ senderId, receiverId, postId, senderName, type }) => {
//     const receiver = getUser(receiverId)


//     if (receiver) {
//       io.to(receiver.socketId).emit("getNotification", {
//         senderId,
//         postId,
//         senderName,
//         type
//       })
//     }

//   })

//   // DISCONNECTED
//   socket.on("disconnect", () => {
//     // console.log("A user disconnected");
//     removeUser(socket.id) // remove active user

//     //send to client
//     io.emit('getUsers', onlineUsers) // online users
//     console.log(`User disconnected: ${socket.id}`);
//   })
// })

// --------------------- End Socket ----------------------


// LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Backend Server is Running On:' + PORT);
})