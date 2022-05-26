import './topbar.css'
import { useContext, useEffect, useState } from 'react';
import { Search, Person, Chat, NotificationsActive, TagFaces } from '@mui/icons-material';
import { NavLink, Link, Navigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import axios from 'axios';

export default function Topbar({ fetchAllUsers, socket }) {
  const { user, token } = useContext(AuthContext);
  const PF = REACT_APP_PUBLIC_FOLDER;
  const [sender, setSender] = useState();
  const [notifications, setNotifications] = useState([]);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  const searchHandler = (e) => {
    fetchAllUsers(e.target.value)
  }

  useEffect(() => {
    socket?.on("getNotification", async ({ senderId, type }) => {
      const { data } = await axios.get(`${API_URL}/api/v1/users/single?id=${senderId}`, config)

      setNotifications((prev) => [...prev, { senderName: data.firstName, type }])
    })
  }, [socket])

  console.log({ notifications });


  return (
    <div className="topbar-wrapper py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="search-bar shadow-sm overflow-hidden bg-white">
              <Search className='search-icon' />
              <input onChange={searchHandler} type="text" className="search-input border-0 fw-light ps-1" placeholder="Search smiley people :)" />
            </div>
          </div>
          <div className="col-md-6">
            <ul className='tab-wrap shadow-sm overflow-hidden bg-white'>
              <li><NavLink className={(navData) => { return navData.isActive ? 'active' : '' }} to="/"  >Feed</NavLink></li>
              <li><NavLink className={(navData) => { return navData.isActive ? 'active' : '' }} to="/trending">Trending</NavLink></li>
              <li><NavLink className={(navData) => { return navData.isActive ? 'active' : '' }} to="/people">People</NavLink></li>
            </ul>
          </div>
          <div className="col-md-3">
            <div className="topbar-right shadow-sm overflow-hidden bg-white">
              <div className='topbar-right-profile'>
                <Link to={`/profile/${user.username}`}><img src={user.profilePicture ? PF + 'person/' + user.profilePicture : PF + 'person/noAvatar.png'} className='topbar-img' alt="" /></Link>
                <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}><div className='username'>{user.firstName + ' ' + user.lastName}</div></Link>
              </div>
              {/* <div className="topbar-icon-item">
                <TagFaces />
                <span className="topbar-icon-badge">0</span>
              </div> */}
              <div className="topbar-icon-item">
                <NotificationsActive />
                {notifications.length > 0 &&
                  <span className="topbar-icon-badge"> {notifications.length} </span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >)
}
