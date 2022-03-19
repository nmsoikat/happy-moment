import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {username} = useParams()

  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios(`/users?username=${username}`);
      setUser(res.data)
    }

    fetchUser();
  }, [username])

  return (
    <>
      <Topbar />
      <div className="profile-container">
        <Sidebar />
        <div className="profile-right">
          <div className="profile-right-top">
            <div className="profile-cover">
              <img className='profile-cover-img' src={(user.coverPicture && PF + user.coverPicture) || PF + '/person/noCover.png'} alt="" />
              <img className='profile-user-img' src={(user.profilePicture && PF + user.profilePicture) || PF + '/person/noAvatar.png'} alt="" />
            </div>
            <div className="profile-info">
              <h4 className="profile-info-name">{user.username}</h4>
              <p className="profile-info-desc">{user.desc}</p>
            </div>
          </div>
          <div className="profile-right-bottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
