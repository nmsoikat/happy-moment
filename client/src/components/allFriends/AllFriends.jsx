import './allFriends.css'
import { Link } from 'react-router-dom'
import React from 'react';
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'

function AllFriends({ friendsList, unfriendHandler }) {
  const PF = REACT_APP_PUBLIC_FOLDER;

  return (
    <>
      <h4 className="profile-info-title">User Friends List</h4>
      <div className="friends-wrapper">
        {
          friendsList.length > 0 ? friendsList.map(friend => (
            <div key={friend._id} className='friends-item bg-white shadow-sm text-center'>
              <img className='friends-img' src={`${(friend.profilePicture && PF + 'person/' + friend.profilePicture) || PF + 'person/noAvatar.png'}`} alt="" />
              <Link to={`/profile/${friend.username}`} style={{ textDecoration: 'none' }}>
                <span className="friends-name">{friend.firstName}</span>
              </Link>
              <button className="btn btn-sm btn-secondary w-100" value={friend._id} onClick={unfriendHandler}>Unfriend</button>
            </div>
          )) : <div className='friend-list-hidden-text'>Empty List</div>
        }
      </div>
    </>
  )
}

export default AllFriends