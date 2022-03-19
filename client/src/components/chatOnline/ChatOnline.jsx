import axios from 'axios'
import { useEffect, useState } from 'react'
import './chatOnline.css'

function ChatOnline({onlineUsers, currentUserId, setCurrentChat}) {
  const [currentUserFriends, setCurrentUserFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // get all friends of current users
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/"+ currentUserId)
      setCurrentUserFriends(res.data)
    }

    getFriends()

  }, [currentUserId])

  useEffect(()=> {
    setOnlineFriends(currentUserFriends.filter((f) => onlineUsers?.includes(f._id)))
  }, [currentUserFriends, onlineUsers])
  
  const handleClick = async (onlineF) => {
    try {
      const res = await axios.get(`/conversation/find/${currentUserId}/${onlineF._id}`);
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