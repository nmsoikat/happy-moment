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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const { token } = useContext(AuthContext)
  const [currentUser, setCurrentUser] = useState(useContext(AuthContext).user)
  const [isFriendsUpdated, setIsFriendsUpdated] = useState(false)
  const [socket, setSocket] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([])
  const [stopSpinner, setStopSpinner] = useState(false);

  //socket init
  useEffect(() => {
    if (currentUser?._id) {
      setSocket(io('ws://localhost:8900'))
    }

  }, [])

  //user added to socket
  useEffect(() => {
    socket?.on("connect", () => {

      if (currentUser?._id) {
        socket?.emit("addUser", currentUser._id)

        socket?.on("getUsers", (onlineUsers) => {
          //friends is array of id
          setOnlineFriends(
            currentUser.friends?.filter(fId => onlineUsers.some(u => u.userId === fId))
          )
        })
      }

    })

  }, [socket, currentUser])

  setTimeout(() => {
    setStopSpinner(true)
  }, 5000)

  // useEffect(() => {

  //   console.log({friends: user.friends});
  //   console.log({onlineFriends});

  // }, [onlineFriends])
  return (
    <>
      <Routes>
        <Route path='/' element={currentUser ? <Home socket={socket} isFriendsUpdated={isFriendsUpdated} updateCurrentUser={setCurrentUser} onlineFriends={onlineFriends} stopSpinner={stopSpinner} /> : <Register />} />
        <Route path='/login' element={currentUser ? <Home socket={socket} isFriendsUpdated={isFriendsUpdated} updateCurrentUser={setCurrentUser} onlineFriends={onlineFriends} stopSpinner={stopSpinner} /> : <Login />} />
        <Route path='/register' element={currentUser ? <Home socket={socket} isFriendsUpdated={isFriendsUpdated} updateCurrentUser={setCurrentUser} onlineFriends={onlineFriends} stopSpinner={stopSpinner} /> : <Register />} />
        <Route path='/messenger' element={!currentUser ? <Register /> : <Messenger socket={socket} isFriendsUpdated={isFriendsUpdated} updateCurrentUser={setCurrentUser} onlineFriends={onlineFriends} stopSpinner={stopSpinner} />} />
        <Route path='/profile/:username' element={currentUser ? <Profile socket={socket} stopSpinner={stopSpinner} setIsFriendsUpdated={setIsFriendsUpdated} /> : <Login />} />
        <Route path='/trending' element={currentUser ? <Trending socket={socket} /> : <Login />} />
        <Route path='/videos' element={currentUser ? <Videos socket={socket} /> : <Login />} />
        <Route path='/people' element={currentUser ? <People socket={socket} isFriendsUpdated={isFriendsUpdated} updateCurrentUser={setCurrentUser} onlineFriends={onlineFriends} stopSpinner={stopSpinner} /> : <Login />} />
        <Route path='/forgot-password' element={currentUser ? <Home socket={socket} isFriendsUpdated={isFriendsUpdated} updateCurrentUser={setCurrentUser} onlineFriends={onlineFriends} stopSpinner={stopSpinner} /> : <ForgotPassword />} />
        <Route path='/reset-password/:token' element={currentUser ? <Home socket={socket} isFriendsUpdated={isFriendsUpdated} updateCurrentUser={setCurrentUser} onlineFriends={onlineFriends} stopSpinner={stopSpinner} /> : <ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
