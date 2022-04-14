import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile'
import Trending from './pages/trending/Trending'
import People from './pages/people/People'
import Videos from './pages/videos/Videos'

import { Routes, Route } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Messenger from './pages/messenger/Messenger';
// import RequiredAuth from './RequiredAuth';

function App() {
  const { user } = useContext(AuthContext)

  return (
    <Routes>
      <Route path='/' element={user ? <Home /> : <Register />} />
      <Route path='/login' element={user ? <Home /> : <Login />} />
      <Route path='/register' element={user ? <Home /> : <Register />} />
      <Route path='/messenger' element={!user ? <Register /> : <Messenger />} />
      <Route path='/profile/:username' element={user ? <Profile /> : <Login />} />
      <Route path='/trending' element={user ? <Trending /> : <Login />} />
      <Route path='/videos' element={user ? <Videos /> : <Login />} />
      <Route path='/people/' element={user ? <People /> : <Login />} />
    </Routes>
  );
}

export default App;
