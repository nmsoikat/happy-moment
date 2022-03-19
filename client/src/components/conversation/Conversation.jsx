import axios from 'axios'
import { useEffect, useState } from 'react'
import './conversation.css'

function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const findId = conversation.members.find(mId => mId !== currentUser._id)
    const getUser = async () => {
      try {
        const { data } = await axios(`/users?id=${findId}`);
        setUser(data)
      } catch (err) {
        console.log(err);
      }
    }

    getUser()
  }, [currentUser, conversation])
  return (
    <div className="conversation">
      <img className='conversation-img' src={`${(user?.profilePicture && PF + user?.profilePicture) || PF + '/person/noAvatar.png'}`} alt="" />
      <span className="conversation-name">{user?.username}</span>
    </div>
  )
}

export default Conversation