import React from 'react';
import styles from '../styles/style';
import { connect } from 'react-redux'
import { setUser } from '../actions/index';
import { hashHistory } from 'react-router';
//This file was copied from the Phoenix project.
import { Socket } from "../phoenix";

//Rooms component. Here we verify the user and on success we connect to the channel
//based on the URL param.
class Room extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      channel: null,
      messages: [],
      message: "",
      errors: null,
    }
    //We bind the "this" context to the component "this" context to make sure state is available in these functions
    this.handleMessageInput = this.handleMessageInput.bind(this)
    this.handleKeyPress     = this.handleKeyPress.bind(this)
    this.onSend             = this.onSend.bind(this)
    this.routerWillLeave    = this.routerWillLeave.bind(this)
  }

  componentWillMount() {
    //We setRouteLeaveHook so we can use it to "leave" the channel when user leaves the page.
    this.context.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave
    )
    //We must verify the user before any attempt to connect to the socket because we depend on his
    //accessToken to be valid
    this.verifyUserTokenAndConnectToChannel();
  }

  routerWillLeave() {
    console.log("leaving");
    //If channel is set we will leave it when user leaves the page.
    //The reason we check that it's set first is because if our user is not verified that means
    //the channel is not set and we will get an error. You can't leaved a channel that wasn't even joined.
    if(this.state.channel) {
      this.state.channel.leave()
    }
  }

  verifyUserTokenAndConnectToChannel(){
    //User might have required to be remembered so we check for his accessToken in both
    //localStorage and sessionStorage. If none exist verification will fail and he
    //would be redirected to the Login page.
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
        //on success we just in case add the token to the sessionStorage because we will
        //rely on it in other pages.
        console.log("data is: ", data);
        sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        //Redux action that sets the user with username, email and isLoggedIn state set to true.
        this.props.actions.setUser(data);
        //Now that the user is successfully verified we can try to connect to the channel.
        //First we create an instance of the Socket. We must pass the User's accessToken
        //because this is how the backend would verify him. After that we connect.
        let socket = new Socket("ws://localhost:4000/socket", {params: {token: accessToken}})
        socket.connect()
        //After we connected we need to pick a channel. We pick it based on the routes room parameter.
        //We set the channel as a local state because we will need it available in other functions.
        this.setState({channel: socket.channel("rooms:"+this.props.params.room)})
        //We use the channel state to join to that channel. On success we will get back
        //any existing messages for that specific room/channel and we will render them with
        //renderMessages function.
        this.state.channel.join()
          .receive("ok", resp => { this.renderMessages(resp.messages) })
          .receive("error", resp => { console.log("Unable to join", resp) })
        //We create this event listener that will listen to "new_msg" broadcasting events.
        //so we can update the messages state.
        //The broadcasting events will be triggered from the backend after user sends a new message.
        this.state.channel.on("new_msg", payload => {
          console.log(payload)
          let messages = this.state.messages;
          messages.push(<div><b> {payload.user.username}:</b> {payload.body} </div>);
          this.setState({messages: messages});
        });
      }.bind(this),
      error: function(error) {
        console.log(error);
        hashHistory.push('/login');
      },
    });
  }
  //Here we render any existent messages that we got from the backend on successful join to a channel.
  renderMessages(messages) {
    console.log("messaages are: ", messages)
    let messagesArray = messages.map(message => <div><b>{message.user}:</b> {message.body} </div>);
    this.setState({messages: messagesArray});
  }

  handleMessageInput(event) {
    this.setState({message: event.target.value})
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.onSend()
    }
  }
  //Here we make sure that the message is not empty and we push a "new_msg" event that would be
  //handled in the backend and would be broadcasted back to us so we can show it to all users.
  //This is it!!! you see how easy it is to connect to sockets with Phoenix :)
  onSend() {
    if(this.state.message.length > 0) {
      this.state.channel.push("new_msg", {body: this.state.message})
      this.setState({message: ""})
    }
  }
  render(){
    return (
      <div className="col-md-6 col-md-offset-3">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Welcome to {this.props.params.room.toUpperCase()} Room</h3>
            <div className="panel-body">
              <Messages messages={this.state.messages} />
            </div>
          </div>
          <div className="panel-footer">
            <input
              className ="form-control"
              type="text"
              placeholder="add message"
              value={this.state.message}
              onChange={this.handleMessageInput}
              onKeyPress = {this.handleKeyPress}
              />
          </div>
        </div>
      </div>
    );
  }
}

//We must set a context type so we can use the setRouteLeaveHook
Room.contextTypes = { router: React.PropTypes.object.isRequired }

//Stateless component which renders the messages
const Messages = (props) => {
  return (
    <div>
      {props.messages.map((message, i) => <li className="messages" key={i}> {message} </li>)}
    </div>
  );
}

//Anything returned from this function will end up as actions.props and would be available
//to use in our component. This is how we can send actions.
let mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      setUser: (user) => { dispatch(setUser(user)) }
    }
  }
}
//First argument is always expected to be "mapStateToProps", but since we don't need to subscribe
//to Redux state we will set it to be null.
export default connect(null, mapDispatchToProps)(Room);
