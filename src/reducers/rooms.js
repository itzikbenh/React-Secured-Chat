const rooms = (state = [] , action) => {
  switch (action.type) {
    case 'SET_ROOMS_LIST':
      return action.rooms
    case 'ADD_ROOM':
      return state.concat(action.room)
    default:
      return state;
  }
}

export default rooms
