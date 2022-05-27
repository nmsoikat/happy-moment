import Home from './pages/home/Home';
import Login from './pages/login/Login';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/ResetPassword';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile'
import Trending from './pages/trending/Trending'
import People from './pages/people/People'
import Videos from './pages/videos/Videos'

import { Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Messenger from './pages/messenger/Messenger';
import NotFound from './pages/notFound/NotFound';
// import RequiredAuth from './RequiredAuth';
import { io } from "socket.io-client"


function App() {
  const { user } = useContext(AuthContext)
  const [socket, setSocket] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([])

  //socket init
  useEffect(() => {
    if (user?._id) {
      setSocket(io('ws://localhost:8900'))
    }

  }, [])

  //user added to socket
  useEffect(() => {
    socket?.on("connect", () => {

      if (user?._id) {
        socket?.emit("addUser", user._id)

        socket?.on("getUsers", (onlineUsers) => {
          //friends is array of id
          setOnlineFriends(
            user.friends?.filter(fId => onlineUsers.some(u => u.userId === fId))
          )
        })
      }

    })

  }, [socket])

  // useEffect(() => {

  //   console.log({friends: user.friends});
  //   console.log({onlineFriends});

  // }, [onlineFriends])
  return (
    <Routes>
      <Route path='/' element={user ? <Home socket={socket} onlineFriends={onlineFriends} /> : <Register />} />
      <Route path='/login' element={user ? <Home socket={socket} onlineFriends={onlineFriends} /> : <Login />} />
      <Route path='/register' element={user ? <Home socket={socket} onlineFriends={onlineFriends} /> : <Register />} />
      <Route path='/messenger' element={!user ? <Register /> : <Messenger socket={socket} onlineFriends={onlineFriends} />} />
      <Route path='/profile/:username' element={user ? <Profile socket={socket} /> : <Login />} />
      <Route path='/trending' element={user ? <Trending socket={socket} /> : <Login />} />
      <Route path='/videos' element={user ? <Videos socket={socket} /> : <Login />} />
      <Route path='/people' element={user ? <People socket={socket} onlineFriends={onlineFriends} /> : <Login />} />
      <Route path='/forgot-password' element={user ? <Home socket={socket} onlineFriends={onlineFriends} /> : <ForgotPassword />} />
      <Route path='/reset-password/:token' element={user ? <Home socket={socket} onlineFriends={onlineFriends} /> : <ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
