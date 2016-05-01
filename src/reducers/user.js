let initialState = {
  isLoggedIn: false,
};

const user = (state = initialState , action) => {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, {
        username: action.username,
        email: action.email,
        isLoggedIn: true,
      })
    case 'LOGOUT_USER':
      return initialState;
    default:
      return state;
  }
}

export default user
