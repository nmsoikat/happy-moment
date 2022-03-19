import './share.css'
import { Cancel, EmojiEmotions, Label, LineAxisOutlined, PermMedia, Room } from '@mui/icons-material';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios'

export default function Share() {
  const { user } = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const desc = useRef();
  const [file, setFile] = useState(null);


  const submitHandler = async (e) => {
    e.preventDefault()

    const newPost = {
      userId: user._id,
      desc: desc.current.value
    }

    if (file) {
      const data = new FormData()
      const fileName = Date.now() + file.name;

      // store like array in array;
      data.append("file", file)
      data.append("name", fileName)

      newPost.photo = fileName;
      // console.log([...data]);
      // console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("/posts", newPost);
      window.location.reload();

    } catch (err) {
      console.log(err);
    }
  }
  return <div className='share'>
    <div className="share-wrapper">
      <div className="share-top">
        <img src={user.profilePicture ? PF + user.profilePicture : PF + "/person/noAvatar.png"} alt="" className="share-profile-img" />
        <input placeholder={"What's on your mind " + user.username + "?"} className="share-input" ref={desc} />
      </div>

      <hr className="share-hr" />
      {
        file && (
          <div className="share-img-container">
            <img src={URL.createObjectURL(file)} alt="" className="share-img" />
            <Cancel className='share-img-cancel' onClick={() => setFile(null)} />
          </div>
        )
      }
      <form className="share-bottom" encType="multipart/form-data" onSubmit={submitHandler}>
        <div className="share-options">
          <label id="file" className="share-option">
            <PermMedia htmlColor='tomato' className='share-option-icon' />
            <span className='share-option-text'>Photo or Video</span>
            <input style={{ display: 'none' }} type="file" id="file" name='file' onChange={(e) => setFile(e.target.files[0])} />
          </label>
          <div className="share-option">
            <Label htmlColor='blue' className='share-option-icon' />
            <span className='share-option-text'>Tag</span>
          </div>
          <div className="share-option">
            <Room htmlColor='green' className='share-option-icon' />
            <span className='share-option-text'>Location</span>
          </div>
          <div className="share-option">
            <EmojiEmotions htmlColor='goldenrod' className='share-option-icon' />
            <span className='share-option-text'>Feelings</span>
          </div>
        </div>
        <button className="share-btn" type='submit'>Share</button>
      </form>
    </div>
  </div>;
}
