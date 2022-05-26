import './home.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function Home({ socket }) {
  const { user: currentUser, token } = useContext(AuthContext)

  useEffect(() => {
    // send client to socket-server
    socket?.emit("addUser", currentUser._id)
    // receive from server
    // socket?.on("getUsers", (users) => {
    //   // setOnlineUsers(
    //   //   currentUser.friends?.filter(fo => users.some(u => u.userId === fo))
    //   // )
    //   console.log({users});
    // })

    socket?.emit('test', "hello")


    return () => { socket.disconnect() }

  }, [currentUser])

  return (
    <>
      <Topbar socket={socket} />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-6">
            <Feed socket={socket} username={currentUser.username} />
          </div>
          <div className="col-md-3">
            <Rightbar />
          </div>
        </div>
      </div>
    </>
  )
}
