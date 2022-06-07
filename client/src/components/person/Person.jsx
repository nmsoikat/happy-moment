import './person.css'
import axios from 'axios'
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'

export default function Person({ person }) {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, token } = useContext(AuthContext)
  const [reqSent, setReqSent] = useState(false);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
  }

  const sendFriendRequest = async (e) => {
    const targetUserId = e.target.value;
    const { data } = await axios.put(`${API_URL}/api/v1/users/friends/${targetUserId}/send-request`, { userId: currentUser._id }, config)

    if (data.status === 'success') {
      setReqSent(true)
    }
  }

  return <>
    <div className='person shadow-sm bg-white'>
      <div className="person-left">
        <Link to={`/profile/${person.username}`}>
          <img className='post-profile-img' src={(person.profilePicture && PF + 'person/' + person.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
        </Link>
        <div className="person-left-info">
          <Link to={`/profile/${person.username}`} style={{ textDecoration: 'none', color: '#222', display: 'inline-block' }}><span className="post-username">{person.firstName + ' ' + person.lastName}</span></Link>
          <small className='person-desc'>{person.desc}</small>
        </div>
      </div>
      <div className="person-right">
        {
          (<button type='button' value={person._id} className="btn btn-sm btn-outline-warning" disabled={reqSent} onClick={sendFriendRequest}>
            {!reqSent ? 'Send Request': 'Request Sent Success'}
          </button>)
         }
      </div>
    </div>
  </>;
}
