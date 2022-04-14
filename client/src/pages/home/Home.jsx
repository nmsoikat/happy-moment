import './home.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function Home() {
  const { user: currentUser, token } = useContext(AuthContext)
  return (
    <>
      <Topbar />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-6">
            <Feed username={currentUser.username}/>
          </div>
          <div className="col-md-3">
            <Rightbar/>
          </div>
        </div>
      </div>
    </>
  )
}
