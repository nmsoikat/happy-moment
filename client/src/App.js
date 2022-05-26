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

  useEffect(() => {
    //init
    setSocket(io('ws://localhost:8900'))
  }, [])

  return (
    <Routes>
      <Route path='/' element={user ? <Home socket={socket} /> : <Register />} />
      <Route path='/login' element={user ? <Home  socket={socket}/> : <Login />} />
      <Route path='/register' element={user ? <Home  socket={socket}/> : <Register />} />
      <Route path='/messenger' element={!user ? <Register /> : <Messenger socket={socket} />} />
      <Route path='/profile/:username' element={user ? <Profile socket={socket} /> : <Login />} />
      <Route path='/trending' element={user ? <Trending socket={socket} /> : <Login />} />
      <Route path='/videos' element={user ? <Videos socket={socket} /> : <Login />} />
      <Route path='/people' element={user ? <People socket={socket} /> : <Login />} />
      <Route path='/forgot-password' element={user ? <Home  socket={socket}/> : <ForgotPassword />} />
      <Route path='/reset-password/:token' element={user ? <Home  socket={socket}/> : <ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
