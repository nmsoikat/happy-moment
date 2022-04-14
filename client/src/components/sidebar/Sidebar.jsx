import './sidebar.css'
import { Logout, Bookmark, Chat, Event, Group, HelpOutline, PlayCircleFilledOutlined, RssFeed, School, WorkOutline } from '@mui/icons-material';
import { Users } from '../../dummyData';
import CloseFriend from '../closeFriend/CloseFriend';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Sidebar() {

  const date = new Date();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [time, setTime] = useState('');

  const startTime = () => {
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);

    setTime(h + ":" + m + ":" + s)
  }
  
  useEffect(() => {
    setTimeout(startTime, 1000);
  }, [time])

  //todays date
  const getDate = () => {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    const today = `${month}/${day}/${year}`;

    return today;
  }



  
  const logoutHandler = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
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

        <div className="date-time-wrap shadow-sm overflow-hidden bg-white" style={{ background: "url('/assets/date-time-bg.jpg') center", backgroundSize: "cover" }}>
          <div className="time">
            {time}
          </div>
          <div className="date">
            {getDate()}
          </div>
        </div>
      </div>
    </div>
  )

  // return (
  //   <div className='sidebar'>
  //     <div className="sidebar-wrapper">
  //       <ul className="sidebar-list">
  //         <li className="sidebar-list-item">
  //           <RssFeed className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Feed</span>
  //         </li>
  //         <li className="sidebar-list-item">
  //           <Chat className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Chats</span>
  //         </li>
  //         <li className="sidebar-list-item">
  //           <PlayCircleFilledOutlined className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Videos</span>
  //         </li>
  //         <li className="sidebar-list-item">
  //           <Group className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Groups</span>
  //         </li>
  //         <li className="sidebar-list-item">
  //           <Bookmark className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Bookmarks</span>
  //         </li>
  //         <li className="sidebar-list-item">
  //           <HelpOutline className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Questions</span>
  //         </li>
  //         <li className="sidebar-list-item">
  //           <WorkOutline className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Jobs</span>
  //         </li>
  //         <li className="sidebar-list-item">
  //           <Event className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Events</span>
  //         </li>
  //         <li className="sidebar-list-item">
  //           <School className='sidebar-list-item-icon' />
  //           <span className="sidebar-list-item-text">Courses</span>
  //         </li>
  //       </ul>

  //       <button className="sidebar-btn">Show More</button>
  //       <hr className='sidebar-hr' />
  //       <ul className="sidebar-friend-list">
  //         {Users.map(u => (
  //           <CloseFriend key={u.id} user={u} />
  //         ))}
  //       </ul>
  //     </div>
  //   </div>
  // );
}
