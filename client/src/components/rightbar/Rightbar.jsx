import './rightbar.css';
import OnlineFriend from '../onlineFriend/OnlineFriend';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from '@mui/icons-material';

export default function Rightbar({ user }) {

  const [friends, setFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id))

  // console.log(followed);
  // console.log(currentUser.followings);

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id))
    console.log(currentUser.followings);
  }, [currentUser, user?._id])

  useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get('/users/friends/' + user?._id)
          setFriends(friendList.data)
        } catch (err) {
          console.log(err);
        }
      }
  
      getFriends();
  }, [user])

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, { userId: currentUser._id })
        dispatch({ type: 'UNFOLLOW', payload: user._id })
      } else {
        await axios.put(`/users/${user._id}/follow`, { userId: currentUser._id })
        dispatch({ type: 'FOLLOW', payload: user._id })
      }

      setFollowed(!followed)
    } catch (error) {
      console.log(error);
    }
  }

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthday-container">
          <img className="birthday-img" src="/assets/gift.png" alt="" />
          <span className="birthday-text">
            <b>Pola Foster</b> and  <b>3 other friends</b> have birthday today.
          </span>
        </div>
        <img className="rightbar-ad" src="/assets/ad.png" alt="" />
        <h4 className="rightbar-title">Online Friends</h4>
        <ul className="rightbar-friend-list">
          {user?.map(u => (
            <OnlineFriend key={u.id} user={u} />
          ))}
        </ul>
      </>
    )
  }

  const ProfileRightbar = () => {
    return (
      <>
        {currentUser.username !== user.username && (
          <button className='rightbar-follow-btn' onClick={handleClick}>
            {followed ? 'Unfollow' : 'Follow'}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbar-title">User Information</h4>
        <div className="rightbar-info">
          <div className="rightbar-info-item">
            <span className="rightbar-info-key">City:</span>
            <span className="rightbar-info-value">{user.city}</span>
          </div>
          <div className="rightbar-info-item">
            <span className="rightbar-info-key">From:</span>
            <span className="rightbar-info-value">{user.from}</span>
          </div>
          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Relationship:</span>
            <span className="rightbar-info-value">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "--"}</span>
          </div>
        </div>

        <h4 className="rightbar-title">User Friends</h4>
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

  return <div className='rightbar'>
    <div className="rightbar-wrapper">
      {
        user ?
          <ProfileRightbar />
          :
          <HomeRightbar />
      }
    </div>
  </div>;
}
