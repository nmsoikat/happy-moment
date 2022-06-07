import './topbar.css'
import { useContext, useEffect, useState } from 'react';
import { Search, Person, Chat, NotificationsActive, TagFaces } from '@mui/icons-material';
import { NavLink, Link, Navigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import axios from 'axios';
import { Button } from '@mui/material';

export default function Topbar({ fetchAllUsers, socket }) {
  // const { user, token } = useContext(AuthContext)
  const { token } = useContext(AuthContext)
  const [user, setUser] = useState(useContext(AuthContext).user)
  const PF = REACT_APP_PUBLIC_FOLDER;
  const [notifications, setNotifications] = useState([]);
  const [notificationToggle, setNotificationToggle] = useState(false);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
  }

  const searchHandler = (e) => {
    fetchAllUsers(e.target.value)
  }

  useEffect(() => {
    socket?.on("getNotification", async ({ senderId, postId, senderName, type }) => {

      setNotifications((prev) => [...prev, { senderId, postId, senderName, type }])
    })
  }, [socket])

  //current user refresh if profile pic has changed
  useEffect(() => {
    const refreshUser = async () => {
      const { data } = await axios.get(`${API_URL}/api/v1/users/single?id=${user._id}`, config);
      setUser(data)
    }

    refreshUser();
  }, [])

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
            <div className="topbar-right shadow-sm bg-white">
              <div className='topbar-right-profile'>
                <Link to={`/profile/${user.username}`}><img src={user.profilePicture ? PF + 'person/' + user.profilePicture : PF + 'person/noAvatar.png'} className='topbar-img' alt="" /></Link>
                <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}><div className='username'>{user.firstName + ' ' + user.lastName}</div></Link>
              </div>
              {/* <div className="topbar-icon-item">
                <TagFaces />
                <span className="topbar-icon-badge">0</span>
              </div> */}
              <div className="topbar-icon-item" onClick={() => setNotificationToggle(!notificationToggle)}>
                <NotificationsActive />
                {notifications.length > 0 &&
                  <span className="topbar-icon-badge"> {notifications.length} </span>}
              </div>

              {
                notificationToggle &&
                <div className='notifications-wrap shadow bg-white'>
                  {
                    notifications.length > 0 ?
                      notifications.map((item, index) => (
                        <div key={index} className='notification-item'>
                          <i>{item.senderName}</i> <b className='type'>{item.type}</b> <span>On your post</span>
                        </div>
                      ))


                      : (
                        <div className='no-notifications'>No New Notification</div>
                      )
                  }
                  {
                    notifications.length > 0 && <button className='btn btn-sm w-100 btn-info' onClick={() => setNotifications([])}>Clear Notifications</button>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div >)
}
