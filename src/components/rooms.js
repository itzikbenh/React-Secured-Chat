import React from 'react';
import styles from '../styles/style';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getRooms, addRoom } from '../actions/index';
import { hashHistory, Link } from 'react-router';

class Rooms extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      room: "",
      buttonText: "Create",
      errors: []
    }
    this.handleRoomInput  = this.handleRoomInput.bind(this)
    this.handleCreateRoom = this.handleCreateRoom.bind(this)
  }
  componentWillMount() {
    this.props.getRooms();
  }

  handleRoomInput(event) {
    this.setState({room: event.target.value})
  }

  handleCreateRoom(e) {
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    //e.preventDefault();
    this.setState({buttonText: "Creating..."})
    $.ajax({
      type: 'POST',
      url: 'http://localhost:4000/api/rooms/',
      data: {
          token: accessToken,
          room:{
            name: this.state.room,
        }},
      success: function(data) {
        console.log(data);
        this.setState({room: ""})
        this.setState({buttonText: "Update"})
        this.props.addRoom(data.room.name);
      }.bind(this),
      error: function(error) {
        console.log("original error: ", error);
        this.setState({buttonText: "Create"})
        //Parse the error to an object so we can loop over it.
        let errors = JSON.parse(error.responseText)
        //errors are inside the errors object
        errors     = errors.errors;
        console.log("errors are: ", errors)
        let errorsArray = [];
        for(var key in errors) {
          //If array is bigger than one we need to split it.
          if(errors[key].length > 1) {
            errors[key].map(error => errorsArray.push(`${key} ${error}`));
          } else {
            errorsArray.push(`${key} ${errors[key]}`);
          }
        }
        //Now we can set the array of errors we created.
        this.setState({errors: errorsArray})
      }.bind(this),
    });
  }
  render(){
    return (
      <div className="col-md-12">
        <div className="col-md-3 col-md-offset-3 col-sm-6 col-xs-6">
          <Errors errors={this.state.errors}/>
          <form>
            <div className="form-group">
              <input
                className ="form-control"
                type="text"
                placeholder="Add room name"
                value={this.state.room}
                onChange={this.handleRoomInput} />
            </div>
            <button type="submit" className="btn btn-success" onClick={this.handleCreateRoom}>
              {this.state.buttonText}
            </button>
          </form>
         </div>
         <RoomsList rooms={this.props.rooms}/>
       </div>
    );
  }
}

const Errors = (props) => {
  return (
      <div className="errors">
        {props.errors.map((error, i) => <li className="list-group-item list-group-item-danger" key={i}> {error} </li>)}
      </div>
  );
}

const RoomsList = (props) => {
  return (
      <div className="col-md-3 col-sm-6 col-xs-6">
        {props.rooms.map((room, i) => <li className="list-group-item" key={i}> <Link to={"/rooms/"+room.toLowerCase()}>{room}</Link> </li>)}
      </div>
  );
}

let mapStateToProps = (state) => {
  return {
    rooms: state.rooms
  };
}

let mapDispatchToProps = (dispatch) => {
  return {
    getRooms: () => { dispatch(getRooms()) },
    addRoom:  (room) => { dispatch(addRoom(room)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
