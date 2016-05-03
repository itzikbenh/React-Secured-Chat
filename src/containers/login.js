import React from 'react';
import styles from '../styles/style';
import Errors from '../components/errors';
import { connect } from 'react-redux'
import { setUser } from '../actions/index';
import { hashHistory } from 'react-router';

class Login extends React.Component {
  constructor(){
    super();
    this.state = {
      email: "",
      password: "",
      buttonText: "Login",
      rememberMe: false,
      errors: []
    }
    this.handleEmailChange    = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleLogin          = this.handleLogin.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
  }
  handleEmailChange(event) {
    this.setState({email: event.target.value})
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }
  handleCheckboxChange(event) {
    this.setState({rememberMe: event.target.checked})
  }
  handleLogin(e) {
    e.preventDefault();
    this.setState({buttonText: "Logging in..."})
    $.ajax({
      type: 'POST',
      url: "http://localhost:4000/api/sessions",
      data: {
          session:{
            email: this.state.email,
            password: this.state.password,
          }
      },
      success: function(data) {
        console.log("data is: ", data);
        let accessToken = data.token;
        if(this.state.rememberMe) {
            localStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
            sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        } else {
            sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        }
        //setUser action
        this.props.setUser(data);
        hashHistory.push('/')
      }.bind(this),
      error: function(error) {
        let errors = error.responseText;
        this.setState({buttonText: "Login"})
        this.setState({errors: [errors]})
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
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleEmailChange} />
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
              type="checkbox"
              checked={this.state.rememberMe}
              onClick={this.handleCheckboxChange} />
            <span> Remember me</span>
          </div>
          <button type="submit" className="btn btn-success" onClick={this.handleLogin}>
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

//Anything returned from this function will end up as props.
let mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => { dispatch(setUser(user)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
