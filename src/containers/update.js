import React from 'react';
import styles from '../styles/style';
import Errors from '../components/errors';
import { connect } from 'react-redux'
import { setUser } from '../actions/index';
import { hashHistory } from 'react-router';

class Update extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      username: "",
      buttonText: "Update",
      flash: null,
      errors: []
    }
    this.handleEmailChange    = this.handleEmailChange.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handleUpdate         = this.handleUpdate.bind(this)
  }
  componentWillMount() {
    this.fetchUserData();
  }
  fetchUserData() {
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    $.ajax({
      type: 'GET',
      url: "http://localhost:4000/api/users/"+encodeURIComponent(accessToken)+"/edit",
      success: function(data) {
        console.log("data is: ", data);
        this.setState({email: data.email});
        this.setState({username: data.username});
      }.bind(this),
      error: function(error) {
        console.log(error);
      },
    });
  }
  handleEmailChange(event) {
    this.setState({email: event.target.value})
  }
  handleUsernameChange(event) {
    this.setState({username: event.target.value})
  }
  handleUpdate(e) {
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    e.preventDefault();
    this.setState({buttonText: "Updating..."})
    $.ajax({
      type: 'PATCH',
      url: 'http://localhost:4000/api/users/'+encodeURIComponent(accessToken),
      data: {
          user:{
            username: this.state.username,
            email: this.state.email,
        }},
      success: function(data) {
        this.setState({buttonText: "Update"})
        console.log(data);
        this.props.setUser(data);
        this.setState({flash: data.flash})
      }.bind(this),
      error: function(error) {
        console.log("original error: ", error);
        this.setState({buttonText: "Update"})
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
      <div className="col-md-3" style={styles.divRegisterStyle}>
        {this.state.flash}
        <Errors errors={this.state.errors}/>
        <form>
          <div className="form-group">
            <input
              className ="form-control"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleEmailChange} />
          </div>
          <div className="form-group">
            <input
              className ="form-control"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleUsernameChange} />
          </div>
          <button type="submit" className="btn btn-success" onClick={this.handleUpdate}>
            {this.state.buttonText}
          </button>
        </form>
       </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    user: state.user
  };
}

let mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => { dispatch(setUser(user)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Update);
