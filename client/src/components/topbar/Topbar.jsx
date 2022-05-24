import './topbar.css'
import { useContext, useState } from 'react';
import { Search, Person, Chat, NotificationsActive, TagFaces } from '@mui/icons-material';
import { NavLink, Link, Navigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'

export default function Topbar({fetchAllUsers}) {
  const { user } = useContext(AuthContext);
  const PF = REACT_APP_PUBLIC_FOLDER;

  const searchHandler = (e) => {
    fetchAllUsers(e.target.value)
  }

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
              <Link to={`/profile/${user.username}`}><img src={user.profilePicture ? PF +'person/' +user.profilePicture : PF + 'person/noAvatar.png'} className='topbar-img' alt="" /></Link>
              <Link to={`/profile/${user.username}`} style={{textDecoration:'none'}}><div className='username'>{user.firstName}</div></Link>
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
}
