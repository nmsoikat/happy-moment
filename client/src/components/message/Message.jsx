import './message.css'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import axios from 'axios'

function Message({ profilePicture, message, own, currentUser }) {
  // const [user, setUser] = useState(null)
  const PF = REACT_APP_PUBLIC_FOLDER;


  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const { data } = await axios(`${API_URL}/api/v1/users/single?id=${currentUser._id}`);
  //       setUser(data)
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   getUser()
  // }, [currentUser])

  return (
    <div className={own ? "message own" : 'message'}>
      <div className="message-top">
        {!own && <img className='message-img' src={`${profilePicture ? (PF + 'person/' + profilePicture) : (PF + 'person/noAvatar.png')}`} alt="" />}
        <p className='message-text'>
          {message.text}
        </p>
      </div>
      <div className="message-bottom">{moment(message.createdAt).fromNow()}</div>
    </div>
  )
}

export default Message