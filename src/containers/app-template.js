import React from 'react';
import Navbar from './navbar';
import { connect } from 'react-redux'
import { setUser, verifyUserToken } from '../actions/index';
import { hashHistory } from 'react-router';
import Login from './login';


class AppTemplate extends React.Component {

  componentWillMount() {
    this.props.verifyUserToken();
  }

  render() {
    return (
      <div className="container">
        <Navbar />
        { this.props.children }
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    user: state.user
  };
}

//Anything returned from this function will end up as props in the AppTemplate component
let mapDispatchToProps = (dispatch) => {
  //Whenever setUser is called, the result should ne passed to all of our reducers.
  return {
    verifyUserToken: () => { dispatch(verifyUserToken()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppTemplate);
