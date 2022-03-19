import "./messenger.css"
import Topbar from '../../components/topbar/Topbar'
import Conversation from "../../components/conversation/Conversation"
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import { useContext, useEffect, useState, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from 'axios'
import { io } from "socket.io-client"

function Messenger() {
  //get ref of new message element 
  const newMessageRef = useRef();

  const { user: currentUser } = useContext(AuthContext)

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

  //GET CONVERSATION
  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await axios.get('/conversation/' + currentUser._id)
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
        const { data } = await axios.get('/message/' + currentChat?._id);
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
      const { data } = await axios.post("/message", message);//return created data

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
      <Topbar />
      <div className="messenger">
        <div className="chat-menu">
          <div className="chat-menu-wrapper">
            <input type="text" placeholder="search for friends" className="chat-menu-input" />
            {conversations.map((c, index) =>
              <div key={index} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={currentUser} />
              </div>
            )}
          </div>
        </div>
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
                    <textarea cols="30" rows="10" className="chat-message-input" placeholder="write something..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}></textarea>
                    <button className="chat-submit-btn" onClick={newMessageHandler}>Send</button>
                  </div>
                </>) : (<p className="no-conversation-text">Open a conversation to start chat</p>)
            }
          </div>
        </div>
        <div className="chat-online">
          <div className="chat-online-wrapper">
            <ChatOnline onlineUsers = {onlineUsers} currentUserId={currentUser._id} setCurrentChat={setCurrentChat} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger