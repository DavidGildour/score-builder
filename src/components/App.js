import React from 'react';
import M from 'materialize-css/dist/js/materialize.min'

import StaffContainer from './StaffContainer';
import language from '../lang/language';
import { LoginModal, HelpModal, AboutModal, RegisterModal, UserInfoModal, UserListModal } from './Modals';
import NavBar from './Navbar';
import usersAPIClient from '../utils/usersAPIClient';

class InfoBox extends React.Component {
  componentDidUpdate = (prevProps) => {
    if (prevProps.loggedIn !== this.props.loggedIn) {
      const info = M.Tooltip.init(document.querySelector('.tooltipped.info-box'), {margin: 0, transitionMovement: 7, exitDelay: 1200});
      info.open();
      info.close();
    }
  }

  render = () => <div className="tooltipped info-box" data-tooltip={this.props.loggedIn ? this.props.text.logged_in : this.props.text.logged_out} data-position="bottom" />
}

export default class extends React.Component {
  state = {
    lang: 'EN',
    isLogged: false,
    user: null,
    loginError: null,
    registerStatus: null,
    message: null,
    userList: [],
  };

  componentDidMount = async () => {
    try {
      const user = await usersAPIClient.getUser();
      console.log(user);
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
      const elem = document.querySelector('#login');
      M.Modal.getInstance(elem).close();
      const user = json.content;
      delete user.access_token;
      this.setState({
        user: user,
        isLogged: true,
        loginError: null,
        lang: json.content.language,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        loginError: err.message,
      });
    };
  }

  logOut = async () => {
    try {
      await usersAPIClient.logOutUser();
      this.setState({
        user: null,
        isLogged: false,
        loginError: null,
      });
    } catch (err) {
      this.setState({
        loginError: err.message,
      });
    };
  }

  register = async (e) => {
    const { username, password1, password2, email } = e.target;
    if (password1.value !== password2.value) {
      this.setState({
        registerStatus: 'Passwords do not match!'
      })
      return;
    }
    try {
      const json = await usersAPIClient.registerUser(username.value, password1.value, password2.value, email.value)
      this.setState({
        registerStatus: json.message,
      })
    } catch (err) {
      this.setState({
        registerStatus: err.message,
      })
    }
  }

  getUserList = async () => {
    try {
      const data = await usersAPIClient.getUsers();
      this.setState({
        userList: data.content,
      })
    } catch (err) {
      this.setState({ message: err.message });
    }
  }

  clearUserList = () => {
    this.setState({ userList: [], message: null });
  }

  langChange = async (lang) => {
    if (this.state.user) {
      try {
        await usersAPIClient.updateUser({ language: lang });
      } catch(err) {
        this.setState({
          message: err.message
        })
      }
    }
    this.setState({
      lang: lang,
    });
  }

  changePassword = async (e) => {
    const { password1, password2, old_password } = e.target;
    try {
      const json = await usersAPIClient.updateUser({
        'old_password': old_password.value, 
        'password1': password1.value, 
        'password2': password2.value
      })
      this.setState({
        message: json.message,
      });
    } catch (err) {
      this.setState({
        message: err.message,
      })
    }
  }

  deleteMe = async () => {
    try {
      await usersAPIClient.deleteMe();
      const elem = document.querySelector('#user-info');
      M.Modal.getInstance(elem).close();
      this.setState({
        user: null,
        isLogged: false,
        loginError: null,
      });
    } catch (err) {
      this.setState({ message: err.message });
    }
  }

  deleteUser = async (id) => {
    try {
      const data = await usersAPIClient.deleteUser(id);
      this.setState({
        message: data.message,
      })
    } catch (err) {
      this.setState({
        message: err.message,
      })
    }
  }

  render = () => {
    let logButton;
    let registerButton;
    let userInfoModal;

    if (this.state.isLogged) {
      userInfoModal = 
        <UserInfoModal
          message={this.state.message}
          text={language[this.state.lang].navbar.forms}
          clearMessage={() => this.setState({message: null})}
          deleteMe={this.deleteMe}
          editUser={this.changePassword} 
          user={this.state.user}
          close={language[this.state.lang].navbar.close} />
      logButton = null;
      registerButton = null;
    } else {
      logButton = <li><a href="#login" className="modal-trigger">{language[this.state.lang].navbar.forms.login}</a></li>;
      registerButton = <li><a href="#register" className="modal-trigger">{language[this.state.lang].navbar.forms.register}</a></li>;
      userInfoModal = null;
    }
    return (
      <div id="main">
        <NavBar
          getUserList={this.getUserList}
          user={this.state.user}
          text={language[this.state.lang].navbar}
          logButton={logButton}
          registerButton={registerButton}
          logOut={this.logOut}
          langChange={this.langChange}
        />
        <InfoBox text={language[this.state.lang].navbar.forms.info} loggedIn={this.state.isLogged} />
        {userInfoModal}
        <RegisterModal
          text={language[this.state.lang].navbar.forms}
          close={language[this.state.lang].navbar.close}
          message={this.state.registerStatus}
          onSubmit={this.register}
        />
        <LoginModal
          text={language[this.state.lang].navbar.forms}
          onSubmit={this.logIn}
          close={language[this.state.lang].navbar.close}
          error={this.state.loginError}
        />
        <AboutModal
          about={language[this.state.lang].navbar.about}
          aboutContent={language[this.state.lang].navbar.aboutContent}
          author={language[this.state.lang].author}
          close={language[this.state.lang].navbar.close}
        />
        <HelpModal
          help={language[this.state.lang].navbar.help}
          helpContent={language[this.state.lang].navbar.helpContent}
          close={language[this.state.lang].navbar.close}
        />
        <UserListModal
          text={language[this.state.lang].navbar.userlist}
          deleteUser={this.deleteUser}
          users={this.state.userList}
          message={this.state.message}
          clearUserList={this.clearUserList} />
        <StaffContainer lang={language[this.state.lang]} id="0" />
      </div>
    )
  };
}
