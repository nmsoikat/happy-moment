import React, { useContext } from 'react'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import { AuthContext } from '../../context/AuthContext';

function Comment({ post, comments }) {
  const PF = REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser, token } = useContext(AuthContext)

  return (
    <>
{
          post.comments ?
            (
              <div className="mt-1">
                {
                  post.comments.length === 0 ?
                    <p className="text-muted text-center my-5">There is no comment</p>
                    :
                    (
                      post.comments.reverse().map(comment => (
                        <div key={comment._id} className="media border mt-3">
                          <img src={PF+comment.userId.profilePicture} alt="profile img" className="rounded-circle mx-3 my-3" style={{width: '40px'}} />
                          <div className="media-body my-3">
                            <p>{comment.body}</p>
                            {/* <div name="replies"> */}
                              {/* {comment.replies.length > 0 && (
                                comment.replies.map(reply => (
                                  <div className="media border mt-2 mr-2">
                                    <img style="width:40px" src={`${PF}${reply?.userId?.profilePicture}`} className="align-selft-start mr-3 rounded-circle" />
                                    <div className="media-body">
                                      <p> {reply.body} </p>
                                    </div>
                                  </div>
                                ))
                              )} */}
                            {/* </div> */}

                            {/* <div className="my-3">
                              <input type="text" className="form-control" placeholder="Press Enter to Reply" name="reply"
                                data-comment={comment._id} />
                            </div> */}
                          </div>
                        </div>
                      ))
                    )
                }
              </div>
            )
            : ""
        }

    </>
  )
}

export default Comment