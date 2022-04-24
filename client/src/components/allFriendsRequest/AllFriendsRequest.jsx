import './allFriendsRequest.css'
import { Link } from 'react-router-dom'
import React from 'react';
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'

function AllFriendsRequest({ friendsRequestList, confirmRequestHandler, deleteRequestHandler }) {
  const PF = REACT_APP_PUBLIC_FOLDER;

  return (
    <>
      <h4 className="profile-info-title">Friends Request List</h4>
      <div className="friends-wrapper">
        {
          friendsRequestList.length > 0 ? friendsRequestList.map(friend => (
            <div key={friend._id} className='friends-item bg-white shadow-sm text-center'>
              <img className='friends-img' src={`${(friend.profilePicture && PF + friend.profilePicture) || PF + 'person/noAvatar.png'}`} alt="" />
              <Link to={`/profile/${friend.username}`} style={{ textDecoration: 'none' }}>
                <span className="friends-name">{friend.firstName}</span>
              </Link>
              <button className="btn btn-sm btn-warning w-100" value={friend._id} onClick={confirmRequestHandler}>Confirm Request</button>
              <button className="btn btn-sm btn-secondary w-100" value={friend._id} onClick={deleteRequestHandler}>Delete Request</button>
            </div>
          )) : <div className='friend-list-hidden-text'>Empty List</div>
        }
      </div>
    </>
  )
}

export default AllFriendsRequest