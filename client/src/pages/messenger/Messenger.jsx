import "./messenger.css"
import Topbar from '../../components/topbar/Topbar'
import Conversation from "../../components/conversation/Conversation"
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import { useContext, useEffect, useState, useRef, createRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from 'axios'
// import { io } from "socket.io-client"
import { Search, Person, Chat, NotificationsActive, TagFaces } from '@mui/icons-material';
import { NavLink, Link, Navigate } from "react-router-dom";
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import SendIcon from '@mui/icons-material/Send';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Button, Modal, Spinner, Stack } from 'react-bootstrap';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ToggleButton from 'react-bootstrap/ToggleButton'
import { toast } from 'react-toastify';
import GroupConversation from "../../components/groupConversation/GroupConversation"


function Messenger({ socket, onlineFriends, stopSpinner, isFriendsUpdated, updateCurrentUser }) {
  const PF = REACT_APP_PUBLIC_FOLDER;
  // const { user: currentUser, token } = useContext(AuthContext)
  const { token } = useContext(AuthContext)
  const [currentUser, setCurrentUser] = useState(useContext(AuthContext).user)

  const [allFriendsOfCurrentUser, setAllFriendsOfCurrentUser] = useState([])

  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true)
  const [isRightSideVisible, setIsRightSideVisible] = useState(true)

  const [notifications, setNotifications] = useState([]);
  const [notificationToggle, setNotificationToggle] = useState(false);

  const [convFriendSearch, setConvFriendSearch] = useState('');
  const [selectedConversation, setSelectedConversation] = useState({});
  const [messageTypeInputBoxRef, setMessageTypeInputBoxRef] = useState();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
  }

  useEffect(() => {
    setMessageTypeInputBoxRef(createRef())
  }, [])

  const fetchAllUsers = async (searchValue) => {
    if (!searchValue) { setAllFriendsOfCurrentUser([]); return; }

    const res = await axios.get(`${API_URL}/api/v1/conversation/friends?searchUser=${searchValue}`, config)

    setAllFriendsOfCurrentUser(
      res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      })
    )
  }

  const searchHandler = (e) => {
    setConvFriendSearch(e.target.value)
    fetchAllUsers(e.target.value)
  }

  //get ref of new message element 
  const newMessageRef = useRef();

  //find conversation and set according current-chat
  const [conversations, setConversations] = useState([])
  const [newConvCreated, setNewConvCreated] = useState(false)

  //select user from left bar
  const [currentChat, setCurrentChat] = useState(null)

  // message from DB and Update DOM
  const [messages, setMessages] = useState([])

  // dom new message
  const [newMessage, setNewMessage] = useState("");

  // new message through socket server
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // message count
  const [sendersIds, setSendersIds] = useState([]);


  // online users
  const [onlineUsers, setOnlineUsers] = useState(null)

  // target user
  const [targetId, setTargetId] = useState('')
  const [targetUser, setTargetUser] = useState({})

  // ------------ Socket Start ------------
  //arrival message
  useEffect(() => {
    socket?.on("getMessage", ({ senderId, text }) => {
      setArrivalMessage({
        sender: senderId,
        text,
        conversationId: Date.now()
      })

      setSendersIds((prev) => [...prev, senderId])
    })

  }, [socket])

  //if any arrival message update dom
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])

  }, [arrivalMessage, currentChat])
  // ------------ Socket End ------------

  //create new conversation
  const createNewConversation = async (targetId) => {
    setTargetId(targetId)
    const receiverId = targetId;
    const senderId = currentUser._id;
    const { data } = await axios.post(`${API_URL}/api/v1/conversation/`, { senderId, receiverId }, config)
    if (data) {
      setNewConvCreated(true)
      setConvFriendSearch('') //search box empty
      setAllFriendsOfCurrentUser([]) //friend search result empty
    }
  }

  //GET CONVERSATION
  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/conversation/${currentUser._id}`, config)
        setConversations(data)
      } catch (err) {
        console.log(err);
      }
    }

    getConversation()
  }, [currentUser._id, newConvCreated])

  //GET MESSAGES
  useEffect(() => {
    const getMessage = async () => {
      try {
        console.log(currentChat?._id);
        const { data } = await axios.get(`${API_URL}/api/v1/message/${currentChat?._id}`, config);
        console.log(data);
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
      const { data } = await axios.post(`${API_URL}/api/v1/message`, message, config);//return created data

      //only sender frontend dom update
      setMessages([...messages, data])

      /**
       * onKeyUp
       * if we use value attribute then it will be read only field
       */
      setNewMessage(""); //reset text box  
      messageTypeInputBoxRef.current.value = ''
    } catch (error) {
      console.log(error);
    }

    //send to socket server 
    const receiverId = currentChat.members?.find(member => member !== currentUser._id);

    socket?.emit("sendMessage", {
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


  // Message Type Box
  const messageTypeHandler = (event) => {
    if (event.key === 'Enter') {
      if (!newMessage) return;
      newMessageHandler(event)
    }
    setNewMessage(event.target.value)
  }

  // Target User
  useEffect(() => {
    if (!targetId) return;

    const findTargetUser = async () => {
      const { data } = await axios(`${API_URL}/api/v1/users/single?id=${targetId}`);
      setTargetUser(data)
    }
    findTargetUser();

  }, [targetId, currentChat])

  const selectConversation = (c) => {
    setCurrentChat(c)
    setTargetId(c.members.find(mId => mId !== currentUser._id))

    setSelectedConversation({ conversationId: c._id, active: true })
    setSendersIds([])
  }

  //current user refresh if profile pic has changed
  useEffect(() => {
    const refreshUser = async () => {
      const { data } = await axios.get(`${API_URL}/api/v1/users/single?id=${currentUser._id}`, config);
      setCurrentUser(data)
    }

    refreshUser();
  }, [])


  // -------- Create group -------------
  // const [createGroupModalShow, setCreateGroupModalShow] = useState(false);
  // const [allFriendsOfCurrentUserGroup, setAllFriendsOfCurrentUserGroup] = useState([])
  // const [selectedMembers, setSelectedMembers] = useState([])
  // const [groupName, setGroupName] = useState("")
  // const [myGroups, setMygroups] = useState([]);

  // const handleShow = () => setCreateGroupModalShow(true);
  // const handleClose = () => {
  //   setSelectedMembers([])
  //   setAllFriendsOfCurrentUserGroup([])
  //   setCreateGroupModalShow(false)
  // };

  // const fetchAllUsersForGroup = async (searchValue) => {
  //   if (!searchValue) { setAllFriendsOfCurrentUserGroup([]); return; }

  //   const res = await axios.get(`${API_URL}/api/v1/conversation/friends?searchUser=${searchValue}`, config)

  //   setAllFriendsOfCurrentUserGroup(
  //     res.data.sort((p1, p2) => {
  //       return new Date(p2.createdAt) - new Date(p1.createdAt)
  //     })
  //   )
  // }

  // const searchHandlerForGroup = (e) => {
  //   fetchAllUsersForGroup(e.target.value)
  // }

  // const groupMemberHandler = (e) => {
  //   const username = e.target.name
  //   if (e.target.checked) {
  //     setSelectedMembers((prev) => [...prev, username])
  //   } else {
  //     setSelectedMembers((prev) => prev.filter(item => item !== username))
  //   }
  // }

  // const createGroupHandler = async () => {
  //   const newGroup = {
  //     groupName,
  //     members: selectedMembers
  //   }

  //   try {
  //     const { data } = await axios.post(`${API_URL}/api/v1/group-conversation`, newGroup, config)

  //     if (data.success) {
  //       toast.success(data.message)
  //       setMygroups((prev) => [...prev, data.data])
  //       handleClose()
  //     } else {
  //       toast.error(data.message)
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message)
  //   }
  // }

  // useEffect(() => {
  //   const loadMygroups = async () => {
  //     try {
  //       const { data } = await axios.get(`${API_URL}/api/v1/group-conversation`, config)
  //       setMygroups(data.data)
  //     } catch (error) {
  //       console.log(error);
  //       toast.error(error.message)
  //     }
  //   }

  //   loadMygroups()
  // }, [])

  return (
    <>
      <div className="container mt-3 h-100">
        <div className="row h-100">
          <div className={`col-md-3 left-expand-section-wrap ${!isLeftSideVisible && 'close'}`}>
            <div className="left-side-expand-icon" onClick={() => setIsLeftSideVisible(!isLeftSideVisible)}>
              {isLeftSideVisible ? <ExpandCircleDownIcon /> : <MenuIcon />}
            </div>
            <div className="search-bar shadow-sm overflow-hidden bg-white">
              <Search className='search-icon' />
              <input onChange={searchHandler} value={convFriendSearch} type="text" className="search-input border-0 fw-light ps-1" placeholder="Search smiley people :)" />
            </div>
            <div className="conv-friends-wrapper shadow-sm overflow-hidden bg-white mt-4">
              {/* <div className="group-create-button text-right">
                <span className="text">Create Group</span>
                <Button variant="outline-secondary" size="sm" onClick={handleShow}>
                  <GroupAddIcon />
                </Button>

                <Modal show={createGroupModalShow} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <h5 className="create-group-text">Create Group Chat</h5>
                      <input type="text" onChange={(e) => setGroupName(e.target.value)} name="group-name" id="" className="form-control w-100 group-name-input-box" placeholder="Group Name" required />
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="search-bar shadow-sm overflow-hidden bg-white">
                      <Search className='search-icon' />
                      <input onChange={searchHandlerForGroup} type="text" className="search-input border-0 fw-light ps-1" placeholder="Search smiley people :)" />
                    </div>
                    {
                      allFriendsOfCurrentUserGroup.length > 0 &&
                      <div className="searchConvResultWrap group">
                        {
                          allFriendsOfCurrentUserGroup.map(friend => (
                            <label key={friend._id} className='current-friend'>
                              <img className='post-profile-img' src={(friend.profilePicture && PF + 'person/' + friend.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                              <div className="person-left-info">
                                <span className="post-username">{friend.firstName + ' ' + friend.lastName}</span>

                                <input type="checkbox" name={friend._id} onChange={groupMemberHandler} />
                              </div>
                            </label>
                          ))
                        }
                      </div>
                    }
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="outline-secondary" size="sm" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="outline-success" size="sm" onClick={createGroupHandler}>
                      Create Group
                    </Button>
                  </Modal.Footer>
                </Modal>

              </div> */}
              {
                allFriendsOfCurrentUser.length > 0 &&
                <div className="searchConvResultWrap">
                  {
                    allFriendsOfCurrentUser.map(friend => (
                      <div key={friend._id} className='current-friend' onClick={() => createNewConversation(friend._id)}>
                        <img className='post-profile-img' src={(friend.profilePicture && PF + 'person/' + friend.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                        <div className="person-left-info">
                          <span className="post-username">{friend.firstName + ' ' + friend.lastName}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              }

              {
                conversations.length > 0 ?
                  conversations.map((c, index) =>
                    <div className={`${(selectedConversation.conversationId === c._id && selectedConversation.active === true) ? 'selected' : ''}`} key={index} onClick={() => selectConversation(c)}>
                      <Conversation messageCount={c.members.map((memberId) => {
                        return sendersIds.filter(id => id === memberId).length;
                      })} isSelected={(selectedConversation.conversationId === c._id && selectedConversation.active === true)} onlineFriends={onlineFriends} conversation={c} />
                    </div>
                  )
                  : (
                    !stopSpinner &&
                    <Stack className="text-center my-3">
                      <Spinner className='mx-auto' animation="border" variant="primary" />
                    </Stack>
                  )
              }

              {/* {
                myGroups.length > 0 ?
                  myGroups.map((group) =>
                    <div key={group._id} onClick={() => selectConversation(group)} className={`${(selectedConversation.conversationId === group._id && selectedConversation.active === true) ? 'selected' : ''}`} >
                      <GroupConversation {...{ group }} />
                    </div>
                  )
                  : (
                    !stopSpinner &&
                    <Stack className="text-center my-3">
                      <Spinner className='mx-auto' animation="border" variant="primary" />
                    </Stack>
                  )
              } */}
            </div>
          </div>


          <div className={`col-md-6 ${(!isLeftSideVisible && !isRightSideVisible) ? 'chat-box-expand-both' : (!isLeftSideVisible || !isRightSideVisible) && 'chat-box-expand-one-side'}`}>
            <div className="chat-box">
              <div className="chat-box-wrapper shadow-sm bg-white">
                {
                  currentChat ?
                    (<>
                      <div className="chat-box-top">
                        {messages.map((m, index) =>
                        (
                          <div key={index} ref={newMessageRef}>
                            <Message profilePicture={targetUser.profilePicture} message={m} own={m.sender === currentUser._id} currentUser={currentUser} />
                          </div>
                        )
                        )}
                      </div>
                      <div className="chat-box-bottom">
                        <input ref={messageTypeInputBoxRef} className="chat-message-input form-control rounded-pill" placeholder="write something..." onKeyUp={(e) => messageTypeHandler(e)} />
                        <button className="ml-2 btn btn-sm btn-warning send-message-btn" onClick={newMessageHandler}><span>Send</span> <SendIcon /></button>
                      </div>
                    </>) : (<p className="no-conversation-text">Open a conversation to start chat</p>)
                }
              </div>
            </div>
          </div>


          <div className={`col-md-3 right-expand-section-wrap ${!isRightSideVisible && 'close'}`}>
            <div className="right-side-expand-icon" onClick={() => setIsRightSideVisible(!isRightSideVisible)}>
              {isRightSideVisible ? <ExpandCircleDownIcon /> : <MenuOpenIcon />}
            </div>

            <div className="topbar-right shadow-sm overflow-hidden bg-white">
              <div className='topbar-right-profile'>
                <Link to={`/profile/${currentUser.username}`}><img src={currentUser.profilePicture ? PF + 'person/' + currentUser.profilePicture : PF + 'person/noAvatar.png'} className='topbar-img' alt="" /></Link>
                <Link to={`/profile/${currentUser.username}`} style={{ textDecoration: 'none' }}><div className='username'>{currentUser.firstName + ' ' + currentUser.lastName}</div></Link>
              </div>

              <div className="topbar-icon-item" onClick={() => setNotificationToggle(!notificationToggle)}>
                <NotificationsActive />
                {notifications.length > 0 &&
                  <span className="topbar-icon-badge"> {notifications.length} </span>}
              </div>

              {
                notificationToggle &&
                <div className='notifications-wrap shadow bg-white'>
                  {
                    notifications.length > 0 ?
                      notifications.map((item, index) => (
                        <div key={index} className='notification-item'>
                          <i>{item.senderName}</i> <b className='type'>{item.type}</b> <span>On your post</span>
                        </div>
                      ))


                      : (
                        <div className='no-notifications'>No New Notification</div>
                      )
                  }
                  {
                    notifications.length > 0 && <button className='btn btn-sm w-100 btn-info' onClick={() => setNotifications([])}>Clear Notifications</button>
                  }
                </div>
              }
            </div>


            <div className={`chat-online-wrapper shadow-sm overflow-hidden bg-white mt-4 ${!isRightSideVisible && 'close'}`}>
              <ChatOnline stopSpinner={stopSpinner} onlineFriends={onlineFriends} selectConversation={selectConversation} {...{ isFriendsUpdated, updateCurrentUser }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger