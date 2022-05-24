import './videos.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'

export default function Profile() {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { username } = useParams()

  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios(`${API_URL}/api/v1/users/single?username=${username}`);
      setUser(res.data)
    }

    fetchUser();
  }, [username])

  return (
    <>
      <Topbar />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <Feed videoPage={true} />
          </div>
        </div>
      </div>
    </>
  );
}
