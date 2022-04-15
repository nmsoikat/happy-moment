import './allFriendsSentRequest.css'
import { Link } from 'react-router-dom'
import React from 'react';
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'
import CircularProgress from '@mui/material/CircularProgress';

function AllFriendsSentRequest({ friendsSentRequestList, cancelRequestHandler }) {
  const PF = REACT_APP_PUBLIC_FOLDER;

  return (
    <>
      <h4 className="profile-info-title">Sent Friends Request List</h4>
      <div className="friends-wrapper">
        {
          friendsSentRequestList.map(friend => (
            <div key={friend._id} className='friends-item bg-white shadow-sm text-center'>
              <img className='friends-img' src={`${(friend.profilePicture && PF + friend.profilePicture) || PF + '/person/noAvatar.png'}`} alt="" />
              <Link to={`/profile/${friend.username}`} style={{ textDecoration: 'none' }}>
                <span className="friends-name">{friend.firstName}</span>
              </Link>
              <button className="btn btn-sm btn-secondary w-100" value={friend._id} onClick={cancelRequestHandler}>
              {/* {loading && <CircularProgress color="inherit" size="20px" />} */}
                 Cancel Request
              </button>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default AllFriendsSentRequest