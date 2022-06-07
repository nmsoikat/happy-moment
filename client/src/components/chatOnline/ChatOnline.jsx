import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import './chatOnline.css'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import { AuthContext } from "../../context/AuthContext"
import { Spinner, Stack } from 'react-bootstrap'

function ChatOnline({ onlineFriends, selectConversation, stopSpinner, isFriendsUpdated, updateCurrentUser }) {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, token } = useContext(AuthContext)

  const [friends, setFriends] = useState([]);
  const [getFriendsLoaded, setGetFriendsLoaded] = useState(false);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
  }

  // get all friends of current users
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
    const activeFriends = friends?.map(friend => {

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
    setFriends(activeFriends)
  }, [getFriendsLoaded, onlineFriends])

  //confirm || unfriend //need to re filter for both side users online friends
  useEffect(() => {
    const refreshUser = async () => {
      //user friend list updated //onlineFriend should filter
      const { data: updateUser } = await axios.get(`${API_URL}/api/v1/users/single?id=${currentUser._id}`, config);
      updateCurrentUser(updateUser)
    }

    refreshUser();
  }, [isFriendsUpdated])

  const handleClick = async (onlineF) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/conversation/find/${currentUser._id}/${onlineF._id}`, config);
      selectConversation(data[0]);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='chat-online'>
      {
        friends.length > 0 ?
          friends?.map(onlineF => (
            onlineF.active && <div key={onlineF._id} className="chat-online-friend" onClick={() => handleClick(onlineF)}>
              <div className="chat-online-img-container">
                <img className='chat-online-img' src={onlineF?.profilePicture ? PF + 'person/' + onlineF.profilePicture : PF + "person/noAvatar.png"} alt="" />
                <div className="chat-online-badge"></div>
              </div>
              <span className="chat-online-name">{onlineF.firstName + ' ' + onlineF?.lastName}</span>
            </div>
          )) : (
            !stopSpinner &&
            <Stack className="text-center my-3">
              <Spinner className='mx-auto' animation="border" variant="primary" />
            </Stack>
          )
      }
    </div>
  )
}

export default ChatOnline