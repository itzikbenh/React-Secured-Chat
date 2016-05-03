import React from 'react';
import styles from '../styles/style';
import Errors from '../components/errors';
import { connect } from 'react-redux';
import { setUser } from '../actions/index';
import { hashHistory } from 'react-router';

class Register extends React.Component {
  constructor(){
    super();
    this.state = {
      email: "",
      username:"",
      password: "",
      password_confirmation: "",
      buttonText: "Register",
      //errors that might come from the backend
      errors: [],
      //Temporary fields to store errors that we handle on the client side.
      usernameError: "",
      emailError: "",
      passwordError: "",
      password_confirmationError: ""
    }
    this.handleEmailChange                = this.handleEmailChange.bind(this)
    this.handleUserNameChange             = this.handleUserNameChange.bind(this)
    this.handlePasswordChange             = this.handlePasswordChange.bind(this)
    this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this)
    this.handleRegistration               = this.handleRegistration.bind(this)
  }

  //The next 4 methods will handle user's input and update the state accordingly including form validation
  handleEmailChange(event) {
    this.setState({email: event.target.value})

    if(event.target.value.length < 3){
        this.setState({emailError: "Email must be at least 3 characters"})
    } else {
        this.setState({emailError: ""})
    }
  }
  handleUserNameChange(event) {
    this.setState({username: event.target.value})

    if(event.target.value.length < 3){
        this.setState({usernameError: "Username must be at least 3 characters"})
    } else {
        this.setState({usernameError: ""})
    }
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value})

    if(event.target.value.length < 6) {
        this.setState({passwordError: "Password must be at least 6 characters"})
    } else {
        this.setState({passwordError: ""})
    }

    if(event.target.value.length >= 6 && event.target.value === this.state.password_confirmation) {
        this.setState({password_confirmationError: ""})
    } else {
        this.setState({password_confirmationError: "Password confirmation must match"})
    }
  }
  handlePasswordConfirmationChange(event) {
    this.setState({password_confirmation: event.target.value})

    if(this.state.password !== event.target.value) {
        this.setState({password_confirmationError: "Password confirmation must match"})
    } else {
        this.setState({password_confirmationError: ""})
    }
  }
  //Will make sure all inputs are vaid and send the data to the backend
  handleRegistration(e) {
    e.preventDefault();

    let email                 = this.state.email;
    let username              = this.state.username;
    let password              = this.state.password;
    let password_confirmation = this.state.password_confirmation;

    if(email.length < 3 || username.length < 1 || password.length < 6 || password !== password_confirmation) {
      return this.setState({errors: ["please make sure all fields are filled correctly."]});
    }

    this.setState({buttonText: "Registering..."})
    $.ajax({
      type: 'POST',
      url: "http://localhost:4000/api/users",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Accept", "application/json");
      },
      data: {
          user:{
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
        }},
      success: function(data) {
        console.log(data);
        let accessToken = data.token;
        sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        this.props.setUser(data);
        hashHistory.push('/')
      }.bind(this),
      error: function(error) {
        this.setState({buttonText: "Register"})
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
      <div className="col-md-4" style={styles.divRegisterStyle}>
        <Errors errors={this.state.errors}/>
        <form>
          <div className="form-group">
            <p style={styles.errorsRegisterStyle}>{this.state.emailError}</p>
            <input
              className ="form-control"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleEmailChange} />
          </div>

          <div className="form-group">
            <p style={styles.errorsRegisterStyle}>{this.state.usernameError}</p>
            <input
              className ="form-control"
              type="text"
              placeholder="Username"
              value={this.state.name}
              onChange={this.handleUserNameChange} />
          </div>

          <div className="form-group">
            <p style={styles.errorsRegisterStyle}>{this.state.passwordError}</p>
            <input
              className ="form-control"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange} />
          </div>
          <div className="form-group">
            <p style={styles.errorsRegisterStyle}>{this.state.password_confirmationError}</p>
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
  return {
    user: state.user
  };
}

let mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => { dispatch(setUser(user)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
