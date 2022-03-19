import './message.css'
import { format } from 'timeago.js'

function Message({ message, own, currentUser }) {
  return (
    <div className={own ? "message own" : 'message'}>
      <div className="message-top">
        <img className='message-img' src="https://images.unsplash.com/photo-1553272725-086100aecf5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80" alt="" />
        <p className='message-text'>
          {message.text}
        </p>
      </div>

      <div className="message-bottom">{format(message.createdAt)}</div>
    </div>
  )
}

export default Message