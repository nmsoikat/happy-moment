import './home.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function Home({ socket, onlineFriends, stopSpinner }) {
  const { user: currentUser, token } = useContext(AuthContext)

  // useEffect(() => {
  //   // socket?.emit("addUser", currentUser._id)

  //   socket?.on("getUsers", (onlineUsers) => {
  //     console.log({onlineUsers});
  //     setOnlineFriends(
  //       currentUser.friends?.filter(fId => onlineUsers.some(user => user.userId === fId))
  //     )
  //   })

  // }, [currentUser])

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
            <Rightbar stopSpinner={stopSpinner} socket={socket} onlineFriends={onlineFriends} />
          </div>
        </div>
      </div>
    </>
  )
}
