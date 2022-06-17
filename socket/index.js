
const io = require('socket.io')(process.env.PORT || 8900, {
  cors: {
    // origin: 'http://localhost:3000'
    // origin: 'https://gentle-wind.herokuapp.com'
    origin: 'https://gentlewind.netlify.app'
  }
})

// active users
let onlineUsers = []

// user added online
const addUser = (userId, socketId) => {
  !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId })
}

// remove from online
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

// get user
const getUser = (userId) => {
  return onlineUsers.find(user => user.userId === userId)
}

// every connection
io.on("connection", (socket) => {
  // CONNECTED
  console.log("A user connected");

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id) // set userId and socketId

    console.log(onlineUsers);

    //send to client
    io.emit("getUsers", onlineUsers) // online users
  })



  // SEND AND GET MESSAGE
  socket.on("sendMessage", ({ senderId, receiverId, text }) => { // receive from client
    const whoReceive = getUser(receiverId)

    //send to client //specific
    io.to(whoReceive?.socketId).emit("getMessage", { senderId, text })
  })

  socket.on("sendNotification", ({ senderId, receiverId, postId, senderName, type }) => {
    const receiver = getUser(receiverId)


    if (receiver) {
      io.to(receiver.socketId).emit("getNotification", {
        senderId,
        postId,
        senderName,
        type
      })
    }

  })

  // DISCONNECTED
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id) // remove active user

    //send to client
    io.emit('getUsers', onlineUsers) // online users
    console.log(onlineUsers);
  })
})