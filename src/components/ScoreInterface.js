import React from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css/dist/js/materialize.min'

import StaffContainer from './StaffContainer';
import ScoreName from './ScoreName';
import usersAPIClient from '../utils/usersAPIClient';
import scoresAPIClient from '../utils/scoresAPIClient';
import { loadScore } from '../redux/actions';

import HelpModal from './modals/help';
import UserInfoModal from './modals/userinfo';
import UserListModal from './modals/userlist';
import UserScores from './modals/userscores';


const mapStateToProps = state => (state);
const mapDispatchToProps = { loadScore };


class ScoreInterface extends React.Component {
  state = {
    scoreChangeIndicator: Date.now(),
    elemRef: React.createRef(),
    scoreName: null,
    message: null,
    score: null,
    loaded: false,
  };

  loadScore = (score) => {
    this.props.loadScore(score.data);
    if (this._isMounted()) this.setState({ score: score, scoreName: score.name, scoreChangeIndicator: Date.now() });
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

  saveScore = async () => {
    let resp;
    try {
      if (this.state.score === null) {
        resp = await scoresAPIClient.addScore(this.props.user.id, {
            name: this.state.scoreName,
            public: false,
            score: {
              message: '',
              staves: this.props.staves
            }
        });
      } else {
        resp = await scoresAPIClient.updateScore(this.props.user.id, this.state.score.name, {
          name: this.state.scoreName,
          notes: {
            message: '',
            staves: this.props.staves
          }
        });
      }
      this.setState({ score: resp.content });
    } catch (err) {
      resp = err;
    } finally {
      console.log(resp.message);
    }
  }

  changeName = (e) => {
    const { value } = e.target;
    this.setState({
      scoreName: value,
    });
  }

  componentDidUpdate = (_, prevState) => {
    if (prevState.loaded === false && this.state.loaded === true) {
      M.Modal.init(document.querySelectorAll('#main .modal:not(#scores)'));
      M.Modal.init(document.querySelector('#user-info'));
    }
  }

  componentDidMount = async () => {
    M.Modal.init(document.querySelectorAll('#main .modal:not(#scores)'));
    const score = await scoresAPIClient.getLatestScore(this.props.user.id);
    if (score) {
      this.loadScore(score);
    }
    if (this._isMounted()) this.setState({ loaded: true});
  }

  _isMounted = () => this.state.elemRef.current !== null;

  render = () => {
    if (!this.state.loaded) {
      return (
        <div ref={this.state.elemRef} className="progress">
            <div className="indeterminate"></div>
        </div>
      )
    }
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
      <div ref={this.state.elemRef} id="main">
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
          clearUserList={this.props.clearUserList}
        />
        <ScoreName name={this.state.scoreName} onChange={this.changeName} />
        <StaffContainer
          lang={this.props.lang}
          id="0"
          changeIndicator={this.state.scoreChangeIndicator}
          saveScore={this.saveScore}
        />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreInterface);