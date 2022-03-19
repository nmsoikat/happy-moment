import './topbar.css'
import { useContext } from 'react';
import { Search, Person, Chat, NotificationsActive, TagFaces } from '@mui/icons-material';
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="topbar-wrapper py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="search-bar shadow-sm overflow-hidden bg-white">
              <Search className='search-icon' />
              <input type="text" className="search-input border-0 fw-light ps-1" placeholder="Search smiley people :)" />
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
              {/* <div className="topbar-icons">
                <div className="topbar-icon-item">
                  <Person />
                  <span className="topbar-icon-badge">1</span>
                </div>
                <Link to="/messenger" style={{ color: '#fff' }} className="topbar-icon-item">
                  <Chat />
                  <span className="topbar-icon-badge">2</span>
                </Link>
                <div className="topbar-icon-item">
                  <NotificationsActive />
                  <span className="topbar-icon-badge">1</span>
                </div>
              </div> */}
              <Link to={`/profile/${user.username}`}><img src={user.profilePicture ? PF + user.profilePicture : PF + '/person/noAvatar.png'} className='topbar-img' alt="" /></Link>
              <div className='username'>{user.username}</div>
              <div className="topbar-icon-item">
                <TagFaces />
                <span className="topbar-icon-badge">0</span>
              </div>
              <div className="topbar-icon-item">
                <NotificationsActive />
                <span className="topbar-icon-badge">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)


  // const { user } = useContext(AuthContext);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // return (
  //   <div className="topbar-container">
  //     <div className="topbar-left">
  //       <Link to={'/'} style={{ textDecoration: 'none' }} >
  //         <span className="logo">Social APP</span>
  //       </Link>
  //     </div>
  //     <div className="topbar-center">
  //       <div className="search-bar">
  //         <Search className='search-icon' />
  //         <input placeholder='Search for friends, post or video' className='search-input' />
  //       </div>
  //     </div>
  //     <div className="topbar-right">
  //       <div className="topbar-links">
  //         <span className="topbar-link">Homepage</span>
  //         <span className='topbar-link'>Timeline</span>
  //       </div>
  //       <div className="topbar-icons">
  //         <div className="topbar-icon-item">
  //           <Person />
  //           <span className="topbar-icon-badge">1</span>
  //         </div>
  //         <Link to="/messenger" style={{color: '#fff'}} className="topbar-icon-item">
  //           <Chat />
  //           <span className="topbar-icon-badge">2</span>
  //         </Link>
  //         <div className="topbar-icon-item">
  //           <NotificationsActive />
  //           <span className="topbar-icon-badge">1</span>
  //         </div>
  //       </div>
  //       <Link to={`/profile/${user.username}`}><img src={user.profilePicture ? PF + user.profilePicture : PF + '/person/noAvatar.png'} className='topbar-img' alt="" /></Link>
  //     </div>
  //   </div>
  // )
}
