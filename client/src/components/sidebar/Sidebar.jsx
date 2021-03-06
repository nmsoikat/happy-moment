import './sidebar.css'
import { Logout, Chat, PlayCircleFilledOutlined, RssFeed } from '@mui/icons-material';
import { NavLink, useNavigate  } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL, REACT_APP_PUBLIC_FOLDER } from '../../Constant'
import axios from 'axios';

export default function Sidebar() {
  // const navigate = useNavigate();
  const date = new Date();
  const PF = REACT_APP_PUBLIC_FOLDER;
  // const [time, setTime] = useState('');

  // const startTime = () => {
  //   let h = date.getHours();
  //   let m = date.getMinutes();
  //   let s = date.getSeconds();

  //   m = ('0' + m).slice(-2);
  //   s = ('0' + s).slice(-2);

  //   setTime(h + ":" + m + ":" + s)
  // }
  
  // useEffect(() => {
  //   setTimeout(startTime, 1000);
  // }, [time])

  //todays date
  // const getDate = () => {
  //   const day = ('0' + date.getDate()).slice(-2);
  //   const month = ('0' + (date.getMonth() + 1)).slice(-2);
  //   const year = date.getFullYear();

  //   const today = `${month}/${day}/${year}`;

  //   return today;
  // }


  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
  }
  
  const logoutHandler = async () => {
    localStorage.removeItem('currentUser')
    await axios.get(`${API_URL}/api/v1/auth/logout`, config);
    window.location.assign('/login')
  }

  return (
    <div className='sidebar'>
      <div className="sidebar-wrapper">
        <ul className="sidebar-list shadow-sm overflow-hidden bg-white">
          <li className="sidebar-list-item">
            <NavLink to="/" className={(navData) => navData.isActive ? 'active' : ''}>
              <RssFeed className='sidebar-list-item-icon' />
              <span className="sidebar-list-item-text">Feed</span>
            </NavLink>
          </li>
          <li className="sidebar-list-item">
            <NavLink to="/messenger" className={(navData) => navData.isActive ? 'active' : ''}>
              <Chat className='sidebar-list-item-icon' />
              <span className="sidebar-list-item-text">Chats</span>
            </NavLink>
          </li>
          <li className="sidebar-list-item">
            <NavLink to="/videos" className={(navData) => navData.isActive ? 'active' : ''}>
              <PlayCircleFilledOutlined className='sidebar-list-item-icon' />
              <span className="sidebar-list-item-text">Videos</span>
            </NavLink>
          </li>
          <li className="sidebar-list-item logout" onClick={logoutHandler}>
            <Logout className='sidebar-list-item-icon' />
            <span className="sidebar-list-item-text">Logout</span>
          </li>
        </ul>

        {/* <div className="date-time-wrap shadow-sm overflow-hidden bg-white" style={{ background: "url('/assets/date-time-bg.jpg') center", backgroundSize: "cover" }}>
          <div className="time">
            {time}
          </div>
          <div className="date">
            {getDate()}
          </div>
        </div> */}
      </div>
    </div>
  )
}
