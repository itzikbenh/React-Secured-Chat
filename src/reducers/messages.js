const messages = (state = [] , action) => {
  switch (action.type) {
    case 'SET_MESSAGES_LIST':
      return action.messages
    case 'ADD_MESSAGE':
      return state.concat(action.message)
    default:
      return state;
  }
}

export default messages
