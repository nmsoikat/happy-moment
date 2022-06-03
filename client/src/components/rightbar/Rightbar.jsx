import './rightbar.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import ChatOnline from '../chatOnline/ChatOnline';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Spinner, Stack } from 'react-bootstrap';

export default function Rightbar({ socket, onlineFriends, stopSpinner }) {

  const [friends, setFriends] = useState([]);
  const [getFriendsLoaded, setGetFriendsLoaded] = useState(false);
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, token, dispatch } = useContext(AuthContext);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  // const [followed, setFollowed] = useState(currentUser.followings?.includes(user?._id))

  // console.log(followed);
  // console.log(currentUser.followings);

  // useEffect(() => {
  //   setFollowed(currentUser.followings?.includes(user?._id))
  // }, [currentUser, user?._id])

  useEffect(() => {
    const getFriends = async () => {
      try {
        if (currentUser?._id) {
          const { data } = await axios.get(`${API_URL}/api/v1/users/friends/${currentUser?._id}`, config)
          setFriends(data)
          setGetFriendsLoaded(true);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getFriends();
  }, [currentUser])

  useEffect(() => {
    const friendsAndActiveFriends = friends?.map(friend => {

      if (onlineFriends?.some(ofId => ofId === friend._id)) {
        return {
          ...friend,
          active: true
        }
      } else {
        return {
          ...friend,
          active: false
        }
      }

    })
    setFriends(friendsAndActiveFriends)
    return () => { }
  }, [getFriendsLoaded, socket, onlineFriends])

  // const handleClick = async () => {
  //   try {
  //     if (followed) {
  //       await axios.put(`/api/v1/users/${user._id}/unfollow`, { userId: currentUser._id })
  //       dispatch({ type: 'UNFOLLOW', payload: user._id })
  //     } else {
  //       await axios.put(`/api/v1/users/${user._id}/follow`, { userId: currentUser._id })
  //       dispatch({ type: 'FOLLOW', payload: user._id })
  //     }

  //     setFollowed(!followed)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  const HomeRightbar = () => {
    return (
      <>
        <div className='friends-wrap'>
          <p className="rightbar-title">Friends</p>
          <div className="rightbar-followings">
            {
              friends.length > 0 ?
                friends.map(friend => (
                  <Link to={`/profile/${friend.username}`} key={friend._id} className="chat-online-friend">
                    <div className="chat-online-img-container">
                      <img className='chat-online-img' src={friend?.profilePicture ? PF + 'person/' + friend.profilePicture : PF + "person/noAvatar.png"} alt="" />
                      {friend.active && <div className="chat-online-badge"></div>}
                    </div>
                    <span className="chat-online-name">{friend.firstName + ' ' + friend.lastName}</span>
                  </Link>
                ))
                : (
                  !stopSpinner &&
                  <Stack className="text-center my-3">
                    <Spinner className='mx-auto' animation="border" variant="primary" />
                  </Stack>
                )
            }
          </div>
        </div>
      </>
    )
  }

  return <div className='rightbar bg-white shadow-sm'>
    <div className="rightbar-wrapper">
      {
        // user ?
        //   <ProfileRightbar />
        //   :
        <HomeRightbar />
      }
    </div>
  </div>;
}
