import './allFriends.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'

function AllFriends({user}) {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        if(user?._id){
          const friendList = await axios.get('/users/friends/' + user?._id)
          setFriends(friendList.data)
        }
      } catch (err) {
        console.log(err);
      }
    }

    getFriends();
}, [user])
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