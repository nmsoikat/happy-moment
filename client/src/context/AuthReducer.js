const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        token: null,
        isFetching: true,
        error: false
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.data,
        token: action.payload.token,
        isFetching: false,
        error: false
      };
    case "LOGIN_FAIL":
      return {
        user: null,
        token: null,
        isFetching: false,
        error: action.payload
      };

    case "GET_UPDATED_USER_START":
      return {
        user: null,
        isFetching: true,
        error: false
      };
    case "GET_UPDATED_USER_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false
      };
    case "GET_UPDATED_USER_FAIL":
      return {
        user: null,
        isFetching: false,
        error: action.payload
      };


    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload]
        }
      }
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            following => following !== action.payload
          )
        }
      }

    default:
      return state
  }
}

export default AuthReducer;