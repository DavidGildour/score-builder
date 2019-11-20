import React from 'react';
import { Redirect } from 'react-router-dom';

import usersAPIClient from '../utils/usersAPIClient';

import Register from './Register';
import Login from './Login';


export default class extends React.Component {
  state = {
    loginError: null,
    loginSuccess: false,
    registerStatus: null,
    message: null,
  };

  logIn = async (e) => {
    const { username, password } = e.target;
    try {
      const json = await usersAPIClient.getAuth(username.value, password.value);
      const user = json.content;

      delete user.access_token;
      this.props.appStateChange({
        user: user,
        isLogged: true,
        lang: user.language,
      });
      this.setState({
        loginSuccess: true,
      });
    } catch (err) {
      this.setState({
        loginError: err.message,
      });
    };
  }

  register = async (e) => {
    const { username, password1, password2, email } = e.target;
    try {
      const json = await usersAPIClient.registerUser(username.value, password1.value, password2.value, email.value, this.state.language);
      this.setState({
        registerStatus: json.message,
      })
    } catch (err) {
      this.setState({
        registerStatus: err.message,
      })
    }
  }

  render = () => {
    if (this.state.loginSuccess) return <Redirect to='/' />

    return (
      <div id="main">
        <div className="row page-content">
          <Register
            text={this.props.lang.navbar.forms}
            close={this.props.lang.navbar.close}
            message={this.state.registerStatus}
            onSubmit={this.register}
          />
          <div className="col s2" />
          <Login
            text={this.props.lang.navbar.forms}
            onSubmit={this.logIn}
            close={this.props.lang.navbar.close}
            error={this.state.loginError}
          />
        </div>
      </div>
    )
  }
}