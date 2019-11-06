import React from 'react';

import language from '../lang/language';
import NavBar from './Navbar';
import usersAPIClient from '../utils/usersAPIClient';

import Register from './Register';
import Login from './Login';
import AboutModal from './modals/about';


export default class extends React.Component {
  state = {
    lang: 'EN',
    loginError: null,
    registerStatus: null,
    message: null,
  };

  componentDidMount = async () => {
    try {
      const user = await usersAPIClient.getUser();
      this.setState({
        user: user.content,
        isLogged: true,
        lang: user.content.language,
      })
    }
    catch (err) {
      console.log(err.message);
    };
  }

  logIn = async (e) => {
    const { username, password } = e.target;
    try {
      const json = await usersAPIClient.getAuth(username.value, password.value);
      const user = json.content;
      delete user.access_token;
      this.setState({
        user: user,
        isLogged: true,
        loginError: null,
        lang: json.content.language,
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
  
  langChange = (lang) => {
    this.setState({
      lang: lang,
    });
  }

  render = () => (
    <div id="main">
      <NavBar
        user={null}
        text={language[this.state.lang].navbar}
        langChange={this.langChange}
      />
      <div className="row page-content">
        <Register
          text={language[this.state.lang].navbar.forms}
          close={language[this.state.lang].navbar.close}
          message={this.state.registerStatus}
          onSubmit={this.register}
        />
        <div className="col s2" />
        <Login
          text={language[this.state.lang].navbar.forms}
          onSubmit={this.logIn}
          close={language[this.state.lang].navbar.close}
          error={this.state.loginError}
        />
      </div>
      <AboutModal
        about={language[this.state.lang].navbar.about}
        aboutContent={language[this.state.lang].navbar.aboutContent}
        author={language[this.state.lang].author}
        close={language[this.state.lang].navbar.close}
      />
    </div>
  )
}