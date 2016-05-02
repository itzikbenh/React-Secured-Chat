import { hashHistory } from 'react-router'

export const setUser = (user) => {
  return {
    type: 'SET_USER',
    username: user.username,
    email: user.email
  }
}

export const logOutUser = () => {
  return {
    type: 'LOGOUT_USER'
  }
}

export const setRoomsList = (rooms) => {
  return {
    type: 'SET_ROOMS_LIST',
    rooms: rooms
  }
}

export const addRoom = (room) => {
  return {
    type: 'ADD_ROOM',
    room: room
  }
}

export const setMessagesList = (messages) => {
  return {
    type: 'SET_MESSAGES_LIST',
    messages: messages
  }
}

export const addMessage = (message) => {
  return {
    type: 'ADD_MESSAGE',
    message: message
  }
}

//Async action
export function getRooms() {
  return function(dispatch) {
    $.ajax({
      type: 'GET',
      url: "http://localhost:4000/api/rooms/",
      success: function(data) {
        console.log("data is: ", data);
        let rooms = data.rooms.map(room => room.name)
        dispatch(setRoomsList(rooms));
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
}

//Async action
export function verifyUserToken(routeType) {
  return function(dispatch) {
    let accessToken = null;
    if(localStorage.getItem('TOKEN_STORAGE_KEY')) {
      accessToken = localStorage.getItem('TOKEN_STORAGE_KEY');
    } else {
      accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    }
    $.ajax({
      type: 'GET',
      url: 'http://localhost:4000/api/verifytoken/'+encodeURIComponent(accessToken),
      success: function(data) {
        console.log("data is: ", data);
        sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        dispatch(setUser(data));
      },
      error: function(error) {
        console.log(error);
        dispatch(logOutUser());
        if(routeType === 'securedRoutes') {
          hashHistory.push('/login');
        }
      },
    });
  }
}
