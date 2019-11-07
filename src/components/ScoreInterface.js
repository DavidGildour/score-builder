import React from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css/dist/js/materialize.min'

import StaffContainer from './StaffContainer';
import usersAPIClient from '../utils/usersAPIClient';
import { loadScore } from '../redux/actions'

import HelpModal from './modals/help';
import UserInfoModal from './modals/userinfo';
import UserListModal from './modals/userlist';
import UserScores from './modals/userscores';


const mapStateToProps = state => (state);
const mapDispatchToProps = { loadScore };

// class InfoBox extends React.Component {
//   componentDidUpdate = (prevProps) => {
//     if (prevProps.loggedIn !== this.props.loggedIn) {
//       const info = M.Tooltip.init(document.querySelector('.tooltipped.info-box'), {margin: 0, transitionMovement: 7, exitDelay: 1200});
//       info.open();
//       info.close();
//     }
//   }

//   render = () => <div className="tooltipped info-box" data-tooltip={this.props.loggedIn ? this.props.text.logged_in : this.props.text.logged_out} data-position="bottom" />
// }

class ScoreInterface extends React.Component {
  state = {
    scoreChangeIndicator: Date.now(),
    message: null,
  };

  loadScore = (score) => {
    this.props.loadScore(score.data);
    this.setState({ scoreChangeIndicator: Date.now() });
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

  componentDidMount = () => {
    M.Modal.init(document.querySelectorAll('#main .modal'));
  }

  render = () => {
    let userInfoModal;
    let userScoresModal;

    if (this.props.user) {
      userInfoModal = 
        <UserInfoModal
          message={this.state.message}
          text={this.props.lang.navbar.forms}
          clearMessage={() => this.setState({message: null})}
          deleteMe={this.props.deleteMe}
          editUser={this.changePassword} 
          user={this.props.user}
          close={this.props.lang.navbar.close} />
      userScoresModal =
        <UserScores loadScore={this.loadScore} user={this.props.user} />
    }

    return (
      <div id="main">
        {/* <InfoBox text={this.props.lang.navbar.forms.info} loggedIn={this.state.isLogged} /> */}
        {userInfoModal}
        {userScoresModal}
        <HelpModal
          help={this.props.lang.navbar.help}
          helpContent={this.props.lang.navbar.helpContent}
          close={this.props.lang.navbar.close}
        />
        <UserListModal
          text={this.props.lang.navbar.userlist}
          deleteUser={this.deleteUser}
          users={this.props.userList}
          message={this.state.message}
          clearUserList={this.props.clearUserList} />
        <StaffContainer lang={this.props.lang} id="0" changeIndicator={this.state.scoreChangeIndicator} />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreInterface);