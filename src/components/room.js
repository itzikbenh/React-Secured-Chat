import React from 'react';
import styles from '../styles/style';
import { connect } from 'react-redux'
import { joinChannel } from '../actions/index';
import { hashHistory} from 'react-router';
import { Socket } from "./phoenix";

let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
let socket = new Socket("ws://localhost:4000/socket", {params: {token: accessToken}})

class Room extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      message: "",
      errors: null,
      channel: socket.channel("rooms:"+this.props.params.room)
    }

    this.handleMessageInput = this.handleMessageInput.bind(this)
    this.onSend = this.onSend.bind(this)
    this.routerWillLeave = this.routerWillLeave.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentWillMount() {
    this.context.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave
    )
    socket.connect()
    this.state.channel.join()
      .receive("ok", resp => { this.renderMessages(resp.messages) })
      .receive("error", resp => { console.log("Unable to join", resp) })
    //On new message that was broadcasted the messages state is updated.
    this.state.channel.on("new_msg", payload => {
      console.log(payload)
      let text = this.state.messages;
      //let msg = "<div><b>" + payload.user.username + ":</b>" + payload.body + "</div>";
      let msg = <div><b> {payload.user.username}:</b> {payload.body} </div>;
      text.push(<div><b> {payload.user.username}:</b> {payload.body} </div>);
      this.setState({messages: text});
    });
  }
  routerWillLeave() {
    console.log("leaving");
    this.state.channel.leave()
  }

  renderMessages(messages) {
    console.log("messaages are: ", messages)
    let messagesArray = messages.map(message => <div><b>{message.user}:</b> {message.body} </div>);

    console.log("messages: ",messagesArray)
    this.setState({messages: messagesArray});
  }

  formatTime(at){
    let date = new Date(null)
    date.setSeconds(at / 1000)
    return date.toISOString().substr(14, 5)
  }

  handleMessageInput(event) {
    this.setState({message: event.target.value})
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.onSend()
    }
  }

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

Room.contextTypes = { router: React.PropTypes.object.isRequired }

const Messages = (props) => {
  return (
    <div>
      {props.messages.map((message, i) => <li className="messages" key={i}> {message} </li>)}
    </div>
  );
}


let mapStateToProps = (state) => {
  //Whatever is returned from here will show up as props inside of Login
  return {
    rooms: state.rooms
  };
}

//Anything returned from this function will end up as props.
let mapDispatchToProps = (dispatch) => {
  return {
    joinChannel: (room) => { dispatch(joinChannel(room)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
