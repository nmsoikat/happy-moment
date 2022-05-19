import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import './chatOnline.css'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import { AuthContext } from "../../context/AuthContext"

function ChatOnline({onlineUsers, currentUserId, setCurrentChat}) {
  const [currentUserFriends, setCurrentUserFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, token } = useContext(AuthContext)
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  // get all friends of current users
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(`${API_URL}/api/v1/users/friends/${currentUserId}`, config)
      setCurrentUserFriends(res.data)
    }

    getFriends()

  }, [currentUserId])

  useEffect(()=> {
    setOnlineFriends(currentUserFriends.filter((f) => onlineUsers?.includes(f._id)))
  }, [currentUserFriends, onlineUsers])
  
  const handleClick = async (onlineF) => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/conversation/find/${currentUserId}/${onlineF._id}`, config);
      setCurrentChat(res.data);

    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className='chat-online'>
      {
        onlineFriends?.map(onlineF => (
        <div key={onlineF._id} className="chat-online-friend" onClick={() => handleClick(onlineF)}>
          <div className="chat-online-img-container">
            <img className='chat-online-img' src={onlineF?.profilePicture ? PF+onlineF.profilePicture : PF+ "person/noAvatar.png"} alt="" />
            <div className="chat-online-badge"></div>
          </div>
          <span className="chat-online-name">{onlineF.username}</span>
        </div>
        ))
      }
    </div>
  )
}

export default ChatOnline