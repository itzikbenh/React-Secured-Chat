import React from 'react';
import styles from '../styles/style';
import Errors from '../components/errors';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setUser } from '../actions/index';
import { hashHistory } from 'react-router';

class UpdatePassword extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPassword: "",
      password: "",
      password_confirmation: "",
      buttonText: "Update",
      errors: [],
    }
    this.handleRegistration                = this.handleRegistration.bind(this)
    this.handleCurrentPasswordChange       = this.handleCurrentPasswordChange.bind(this)
    this.handlePasswordChange              = this.handlePasswordChange.bind(this)
    this.handlePasswordConfirmationChange  = this.handlePasswordConfirmationChange.bind(this)
  }

  handleCurrentPasswordChange(event) {
    this.setState({currentPassword: event.target.value})
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }
  handlePasswordConfirmationChange(event) {
    this.setState({password_confirmation: event.target.value})
  }
  handleRegistration(e) {
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    e.preventDefault();
    this.setState({buttonText: "Updating..."})
    $.ajax({
      type: 'PATCH',
      url: 'http://localhost:4000/api/users/updatepassword/'+encodeURIComponent(accessToken),
      data: {
          user:{
            currentPassword: this.state.currentPassword,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
      }},
      success: function(data) {
        this.setState({buttonText: "Update"})
        console.log(data);
        hashHistory.push('/')
      }.bind(this),
      error: function(error) {
        console.log("original error: ", error);
        this.setState({buttonText: "Update"})
        //In case of invalid current password we will have only one possible error from the backend
        if(error.responseText === "invalid password") {
            return this.setState({errors: ["invalid current password"]});
        } else {
            this.setState({error: ""})
        }
        //Parse the error to an object so we can loop over it.
        let errors = JSON.parse(error.responseText)
        //errors are inside the errors object
        errors     = errors.errors;
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
        <Errors errors={this.state.errors}/>
        <form>
          <div className="form-group">
            <input
              className ="form-control"
              type="password"
              placeholder="Current Password"
              value={this.state.currentPassword}
              onChange={this.handleCurrentPasswordChange} />
          </div>
          <div className="form-group">
            <input
              className ="form-control"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange} />
          </div>
          <div className="form-group">
            <input
              className ="form-control"
              type="password"
              placeholder="Confirm Password"
              value={this.state.password_confirmation}
              onChange={this.handlePasswordConfirmationChange} />
          </div>
          <button type="submit" className="btn btn-success" onClick={this.handleRegistration}>
            {this.state.buttonText}
          </button>
        </form>
       </div>
    );
  }
}

let mapStateToProps = (state) => {
  //Whatever is returned from here will show up as props inside of Login
  return {
    user: state.user
  };
}

//Anything returned from this function will end up as props on the Login container
let mapDispatchToProps = (dispatch) => {
  //Whenever setUser is called, the result should ne passed to all of our reducers.
  return bindActionCreators({ setUser: setUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);
