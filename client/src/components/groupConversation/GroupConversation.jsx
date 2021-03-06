import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import './groupConversation.css'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import { AuthContext } from '../../context/AuthContext'

function GroupConversation({ onlineFriends, group }) {
  //   const { user: currentUser, token } = useContext(AuthContext)
  //   const [user, setUser] = useState({})
  //   const [userLoaded, setUserLoaded] = useState(false)
  //   const [conversationUserId, setConversationUserId] = useState('')
  const PF = REACT_APP_PUBLIC_FOLDER;

  //   const config = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // Authorization: `Bearer ${token}`,
  //       'Access-Control-Allow-Origin': '*',
  //     },
  //     withCredentials: true
  //   }

  // //find conversation user
  //   useEffect(() => {
  //     const findId = conversation.members.find(mId => mId !== currentUser._id)
  //     setConversationUserId(findId)

  //     const getUser = async () => {
  //       try {
  //         const { data } = await axios.get(`${API_URL}/api/v1/users/single?id=${findId}`, config);
  //         setUser(data)
  //         setUserLoaded(true)
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }

  //     getUser()
  //   }, [currentUser, conversation])

  //   //conversation user active
  //   useEffect(() => {
  //     if (onlineFriends.some(oFId => oFId === conversationUserId)) {
  //       setUser(prev => ({ ...prev, active: true }))
  //     }
  //   }, [userLoaded])

  return (
    // <div key={user._id} className="chat-online-friend" >
    //   <div className="chat-online-img-container">
    //     <img className='chat-online-img' src={user.profilePicture ? PF + 'person/' + user.profilePicture : PF + "person/noAvatar.png"} alt="" />
    //     {user?.active && <div className="chat-online-badge"></div>}
    //   </div>
    //   <span className="chat-online-name">{(user.firstName && user.firstName) + ' ' + (user.lastName && user.lastName)}</span>
    // </div>
    <div className="chat-online-friend" >
      <div className="chat-online-img-container">
        <img className='chat-online-img' src={group.profilePic ? PF + 'group/' + group.profilePic : PF + 'group/group-avatar.jpg'} alt="" />
      </div>
      <span className="chat-online-name">{group.groupName}</span>
    </div>
  )
}

export default GroupConversation