import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min'

import language from '../lang/language';
import Home from './Home';
import NavBar from './Navbar';
import ScoreInterface from './ScoreInterface';
import usersAPIClient from '../utils/usersAPIClient';

export default class extends React.Component {
  state = {
    loaded: false,
    isLogged: false,
    user: null,
    score: null,
    lang: 'EN',
    message: null,
    userList: [],
  }

  componentDidUpdate = (_, prevState) => {
    if (prevState.isLogged !== this.state.isLogged) {
      M.toast({
        html: this.state.isLogged ? "Logged in." : "Logged out.",
        displayLength: 1000,
        classes: 'info-box rounded',
      });
    }
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

  stateChange = (state) => {
    this.setState(state);
  }

  logOut = async () => {
    try {
      await usersAPIClient.logOutUser();
      this.setState({
        user: null,
        isLogged: false,
      });
    } catch (err) {
      this.setState({
        message: err.message,
      });
    };
  }

  clearUserList = () => {
    this.setState({ userList: [], message: null });
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

  componentDidMount = async () => {
    try {
      const user = await usersAPIClient.getUser();
      this.setState({
        user: user.content,
        isLogged: true,
        lang: user.content.language,
        loaded: true,
      })
    }
    catch (err) {
      console.log(err.message);
      this.setState({ loaded: true })
    };
  }

  render = () => {
    if (!this.state.loaded) {
      return (
        <div className="progress">
            <div className="indeterminate"></div>
        </div>
      )
    }

    return (
      <Router>
        <NavBar
          user={this.state.user}
          lang={language[this.state.lang].navbar}
          logOut={this.logOut}
          langChange={this.langChange}
          getUserList={this.getUserList}
        />
        <Switch>
          <Route exact path='/'>
            {this.state.isLogged ? <Redirect to='/builder' /> : <Redirect to='/login' />}
          </Route>
          <Route exact path='/login'>
            <Home
              lang={language[this.state.lang]}
              appStateChange={this.stateChange}
            />
          </Route>
          <Route exact path='/builder'>
            {this.state.isLogged ? 
              <ScoreInterface
                lang={language[this.state.lang]}
                user={this.state.user}
                deleteMe={this.deleteMe}
                userList={this.state.userList}
                clearUserList={this.clearUserList}
              /> :
              <Redirect to='/login' />
            }
          </Route>
          <Route>
            <div>no match?</div>
          </Route>
        </Switch>
      </Router>
    )
  }
}