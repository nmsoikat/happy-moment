import './onlineFriend.css';
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'

function OnlineFriend({ user }) {
  const PF = REACT_APP_PUBLIC_FOLDER;

  return <li className="rightbar-friend">
    <div className="rightbar-profile-img-container">
      <img className='rightbar-profile-img' src={PF+user.profilePicture}  alt=""/>
      <span className="rightbar-online"></span>
    </div>
    <span className="rightbar-profile-name">{user.username}</span>
  </li>;
}

export default OnlineFriend;
