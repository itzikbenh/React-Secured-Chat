import { combineReducers } from 'redux';
import user from './user';
import rooms from './rooms';

const chatApp = combineReducers({
  user,
  rooms
})

export default chatApp
