import './allFriends.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'

function AllFriends() {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, token } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  useEffect(() => {
    const getFriends = async () => {
      try {
        if(currentUser?._id){
          const {data} = await axios.get(`/users/friends/view-sent-req/${currentUser?._id}`, config)
          setFriends(data)
        }
      } catch (err) {
        console.log(err);
      }
    }

    getFriends();
}, [currentUser])

  return (
    <>
    <h4 className="profile-info-title">User Friends</h4>
    <div className="rightbar-followings">
      {
        friends.map(friend => (
          <Link key={friend._id} to={`/profile/${friend.username}`} style={{ textDecoration: 'none' }}>
            <div className="rightbar-following">
              <img className='rightbar-following-img' src={`${(friend.profilePicture && PF + friend.profilePicture) || PF + '/person/noAvatar.png'}`} alt="" />
              <span className="rightbar-following-name">{friend.username}</span>
            </div>
          </Link>
        ))
      }
    </div> 
    </>
  )
}

export default AllFriends