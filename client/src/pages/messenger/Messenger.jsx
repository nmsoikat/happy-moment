import "./messenger.css"
import Topbar from '../../components/topbar/Topbar'
import Conversation from "../../components/conversation/Conversation"
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import { useContext, useEffect, useState, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from 'axios'
import { io } from "socket.io-client"
import { Search, Person, Chat, NotificationsActive, TagFaces } from '@mui/icons-material';
import { NavLink, Link, Navigate } from "react-router-dom";
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'

function Messenger() {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, token } = useContext(AuthContext)

  const [allFriendsOfCurrentUser, setAllFriendsOfCurrentUser] = useState([])

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchAllUsers = async (searchValue) => {
    if (!searchValue) { return; }

    const res = await axios.get(`/conversation/friends?searchUser=${searchValue}`, config)

    setAllFriendsOfCurrentUser(
      res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      })
    )
  }
  const searchHandler = (e) => {
    // setSearchValue()
    fetchAllUsers(e.target.value)
  }

  //get ref of new message element 
  const newMessageRef = useRef();

  //find conversation and set according current-chat
  const [conversations, setConversations] = useState([])

  //select user from left bar
  const [currentChat, setCurrentChat] = useState(null)

  // message from DB and Update DOM
  const [messages, setMessages] = useState([])

  // dom new message
  const [newMessage, setNewMessage] = useState("");

  // new message through socket server
  const [arrivalMessage, setArrivalMessage] = useState(null);


  // online users
  const [onlineUsers, setOnlineUsers] = useState(null)


  // ------------ Socket Start ------------
  const socket = useRef()
  useEffect(() => {
    //init
    socket.current = io('ws://localhost:8900')

    //arrival message
    socket.current.on("getMessage", ({ senderId, text }) => {
      setArrivalMessage({
        sender: senderId,
        text,
        conversationId: Date.now()
      })
    })

  }, [])

  //if any arrival message update dom
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])

  }, [arrivalMessage, currentChat])

  useEffect(() => {
    // send client to socket-server
    socket.current.emit("addUser", currentUser._id)

    // receive from server
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings?.filter(fo => users.some(u => u.userId === fo))
      )
    })


  }, [currentUser])

  // ------------ Socket End ------------

  //create new conversation
  const createNewConversation = async (targetId) => {
    const receiverId = targetId;
    const senderId = currentUser._id;
    const { data } = await axios.post(`/conversation/`,{senderId, receiverId} ,config)
    if(data){
      alert("Created A New Conversation")
    }
  }

  //GET CONVERSATION
  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await axios.get(`/conversation/${currentUser._id}`, config)
        setConversations(data)
      } catch (err) {
        console.log(err);
      }
    }

    getConversation()
  }, [currentUser._id])

  //GET MESSAGES
  useEffect(() => {
    const getMessage = async () => {
      try {
        const { data } = await axios.get(`/message/${currentChat?._id}`, config);
        setMessages(data)
      } catch (err) {
        console.log(err);
      }
    }

    getMessage()
  }, [currentChat])

  //CREATE MESSAGE AND SEND
  const newMessageHandler = async (e) => {
    e.preventDefault()
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id
    }

    try {
      //send to db
      const { data } = await axios.post(`/message`, message, config);//return created data

      //only sender frontend dom update
      setMessages([...messages, data])

      setNewMessage(""); //reset text box
    } catch (error) {
      console.log(error);
    }

    //send to socket server 
    const receiverId = currentChat.members?.find(member => member !== currentUser._id);
    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage
    })
  }

  // scroll to new message 
  // why useEffect here, so this can apply when message load or create
  useEffect(() => {
    // need reference to show this element
    newMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  return (
    <>
      <div className="container mt-3 h-100">
        <div className="row h-100">
          <div className="col-md-3">
            <div className="search-bar shadow-sm overflow-hidden bg-white">
              <Search className='search-icon' />
              <input onChange={searchHandler} type="text" className="search-input border-0 fw-light ps-1" placeholder="Search smiley people :)" />
            </div>
            <div className="conv-friends-wrapper shadow-sm overflow-hidden bg-white mt-4">
              {allFriendsOfCurrentUser && allFriendsOfCurrentUser.map(friend => (
                <div className='current-friend' onClick={() => createNewConversation(friend._id)}>
                  <img className='post-profile-img' src={(friend.profilePicture && PF + friend.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                  <div className="person-left-info">
                    <span className="post-username">{friend.firstName + ' ' + friend.lastName}</span>
                  </div>
                </div>
              ))}

              {conversations.map((c, index) =>
                <div key={index} onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={currentUser} />
                </div>
              )}
            </div>
          </div>


          <div className="col-md-6">
            <div className="chat-box">
              <div className="chat-box-wrapper">
                {
                  currentChat ?
                    (<>
                      <div className="chat-box-top">
                        {messages.map((m, index) =>
                        (
                          <div key={index} ref={newMessageRef}>
                            <Message message={m} own={m.sender === currentUser._id} currentUser={currentUser} />
                          </div>
                        )
                        )}
                      </div>
                      <div className="chat-box-bottom">
                        <textarea cols="30" rows="10" className="chat-message-input form-control" placeholder="write something..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}></textarea>
                        <button className="ml-2 btn btn-sm btn-warning" onClick={newMessageHandler}>Send</button>
                      </div>
                    </>) : (<p className="no-conversation-text">Open a conversation to start chat</p>)
                }
              </div>
            </div>
          </div>


          <div className="col-md-3">
            <div className="topbar-right shadow-sm overflow-hidden bg-white">
              <Link to={`/profile/${currentUser.username}`}><img src={currentUser.profilePicture ? PF + currentUser.profilePicture : PF + 'person/noAvatar.png'} className='topbar-img' alt="" /></Link>
              <Link to={`/profile/${currentUser.username}`} style={{ textDecoration: 'none' }}><div className='username'>{currentUser.firstName}</div></Link>
              <div className="topbar-icon-item">
                <TagFaces />
                <span className="topbar-icon-badge">0</span>
              </div>
              <div className="topbar-icon-item">
                <NotificationsActive />
                <span className="topbar-icon-badge">0</span>
              </div>
            </div>

            <div className="chat-online">
              <div className="chat-online-wrapper">
                <ChatOnline onlineUsers={onlineUsers} currentUserId={currentUser._id} setCurrentChat={setCurrentChat} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger