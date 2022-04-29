import './share.css'
import { Cancel, PermMedia } from '@mui/icons-material';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios'
import { REACT_APP_PUBLIC_FOLDER,API_URL } from '../../Constant'

export default function Share({fetchPosts}) {
  const { user, token } = useContext(AuthContext)
  const PF = REACT_APP_PUBLIC_FOLDER;

  const desc = useRef();
  const [file, setFile] = useState(null);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if(!file && !desc.current.value ){
      return alert("Please add description or image.")
    }

    const newPost = {
      userId: user._id,
      desc: desc.current.value
    }

    if (file) {
      const data = new FormData()
      let removeSpaceFileName = file.name.toLocaleLowerCase().split(" ").join("-");
      const fileName = user._id + '_' + Date.now() + '_' + removeSpaceFileName;

      // store like array in array;
      data.append("file", file)
      // data.append("name", fileName)

      newPost.photo = fileName;
      // console.log([...data]);
      // console.log(newPost);

      try {
        await axios.post(`/upload/${fileName}`, data, config);
      } catch (err) {
        return console.log(err);
      }
    }

    try {
      await axios.post(`/posts`, newPost, config);
      fetchPosts();
      
      setFile(null)
      URL.revokeObjectURL();
      desc.current.value = "";

    } catch (err) {
      return console.log(err);
    }
  }

  const cancelBlobView = () => {
    setFile(null)
    URL.revokeObjectURL();
  }
  return <>
  <div className='share shadow-sm bg-white'>
    <div className="share-wrapper">
      <div className="share-top">
        <img src={user.profilePicture ? PF + user.profilePicture : PF + "/person/noAvatar.png"} alt="" className="share-profile-img" />
        <input placeholder={"What's on your mind " + user.firstName + "?"} className="share-input" ref={desc} />
      </div>
      <hr className="share-hr" />
      {
        file && (
          <div className="share-img-container">
            {
              (file.type === "video/mp4") ? (<div>
                {file.name}
                <Cancel className='share-img-cancel' onClick={() => cancelBlobView()} />
              </div>) : (
                <>
                  <img src={URL.createObjectURL(file)} alt="" className="share-img" />
                  <Cancel className='share-img-cancel' onClick={() => cancelBlobView()} />
                </>
              )
            }
          </div>
        )
      }

      {/* <ProgressBar now="90" label={`90%`} /> */}

      <form className="share-bottom" encType="multipart/form-data" onSubmit={submitHandler}>
        <div className="share-options">
          <label id="file" className="share-option">
            <PermMedia htmlColor='tomato' className='share-option-icon' />
            <span className='share-option-text'>Photo or Video</span>
            <input style={{ display: 'none' }} type="file" id="file" name='file' onChange={(e) => setFile(e.target.files[0])} />
          </label>
        </div>
        <button className="share-btn" type='submit'>Share</button>
      </form>
    </div>
  </div>

  </>;
}
