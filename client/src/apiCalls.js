import axios from "axios"
import { API_URL } from "./Constant"
import { toast } from 'react-toastify';

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" })
  try {
    const { data } = await axios.post(`${API_URL}/api/v1/auth/login`, userCredential, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'
      }
    });

    if (data.success) {
      dispatch({ type: "LOGIN_SUCCESS", payload: data })

      localStorage.setItem('currentUser', JSON.stringify(data.data))
      // localStorage.setItem('token', JSON.stringify(data.token))
      window.location.assign('/')
    } else {
      dispatch({ type: "LOGIN_FAIL", payload: { message: data.message } })
      toast.error(data.message)
    }
  } catch (err) {
    dispatch({ type: "LOGIN_FAIL", payload: err })
    toast.error("Login failed. Please check Email/Password")
  }
}