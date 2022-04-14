import './person.css'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'

export default function Person({ person }) {
  const PF = REACT_APP_PUBLIC_FOLDER;

  return <>
    <div className='person shadow-sm bg-white'>
      <div className="person-left">
        <Link to={`/profile/${person.username}`}>
          <img className='post-profile-img' src={(person.profilePicture && PF + person.profilePicture) || PF + '/person/noAvatar.png'} alt="" />
        </Link>
        <div className="person-left-info">
          <Link to={`/profile/${person.username}`} style={{ textDecoration: 'none', color: '#222', display: 'inline-block' }}><span className="post-username">{person.firstName + ' ' + person.lastName}</span></Link>
          <small className='person-desc'>{person.desc}</small>
        </div>
      </div>
      <div className="person-right">
        <button className="btn btn-sm btn-outline-warning">Send Request</button>
      </div>
    </div>
  </>;
}
