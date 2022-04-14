import axios from "axios"

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" })
  try {
    const { data } = await axios.post('/auth/login', userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: data })

    localStorage.setItem('currentUser', JSON.stringify(data.data))
    localStorage.setItem('token', JSON.stringify(data.token))
    window.location.assign('/')
  } catch (err) {
    dispatch({ type: "LOGIN_FAIL", payload: err })
  }
}