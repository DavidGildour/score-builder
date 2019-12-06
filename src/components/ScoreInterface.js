import React from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css/dist/js/materialize.min'

import StaffContainer from './StaffContainer';
import ScoreName from './ScoreName';
import usersAPIClient from '../utils/usersAPIClient';
import scoresAPIClient from '../utils/scoresAPIClient';
import namesAPIClient from '../utils/namesAPIClient';
import toastMessage from '../utils/toast';
import { loadScore } from '../redux/actions';

import HelpModal from './modals/help';
import UserInfoModal from './modals/userinfo';
import UserListModal from './modals/userlist';
import UserScores from './modals/userscores';


const mapStateToProps = state => (state);
const mapDispatchToProps = { loadScore };


class ScoreInterface extends React.Component {
  state = {
    scoreLoadedTime: Date.now(),
    changeIndicator: Date.now(),
    elemRef: React.createRef(),
    scoreName: "",
    score: null,
    loaded: false,
  };

  loadScore = (score) => {
    this.props.loadScore(score.data);
    if (this._isMounted()) this.setState({ score: score, scoreName: score.name, scoreLoadedTime: Date.now() });
  }

  deleteUser = async (id) => {
    try {
      const data = await usersAPIClient.deleteUser(id);
      toastMessage(data.message);
    } catch (err) {
      toastMessage(err.message);
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
      toastMessage(json.message);
    } catch (err) {
      toastMessage(err.message);
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
          name: this.state.scoreName !== this.state.score.name ? this.state.scoreName : null,
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
      toastMessage(resp.message);
    }
  }

  changeName = (e) => {
    const { value } = e.target;
    this.setState({
      scoreName: value,
      changeIndicator: Date.now()
    });
  }

  updateChange = () => {
    this.setState({
      changeIndicator: Date.now()
    })
  }

  newScore = async () => {
    const name = await namesAPIClient.getRandomName();
    this.setState({ score: null, scoreName: name.content, scoreLoadedTime: Date.now() });
    this.props.loadScore();
  }

  componentDidUpdate = (_, prevState) => {
    if (prevState.loaded === false && this.state.loaded === true) {
      M.Modal.init(document.querySelectorAll('#main .modal:not(#scores)'));
      M.Modal.init(document.querySelector('#user-info'));
    }
  }

  componentDidMount = async () => {
    M.Modal.init(document.querySelectorAll('#main .modal:not(#scores)'));
    document.querySelector('#addscore').addEventListener('click', this.newScore)
    try {
      const score = await scoresAPIClient.getLatestScore(this.props.user.id);
      if (score) {
        this.loadScore(score);
      } else {
        this.newScore();
      }
    } catch (err) {
      toastMessage(err.message);
    }
    if (this._isMounted()) this.setState({ loaded: true});
  }

  componentWillUnmount = () => {
    this.props.loadScore();
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
          text={this.props.lang.navbar.forms}
          deleteMe={this.props.deleteMe}
          editUser={this.changePassword}
          user={this.props.user}
          close={this.props.lang.navbar.close}
        />
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
          clearUserList={this.props.clearUserList}
        />
        <ScoreName name={this.state.scoreName} onChange={this.changeName} />
        <StaffContainer
          lang={this.props.lang}
          id="0"
          scoreLoadedTime={this.state.scoreLoadedTime}
          changeIndicator={this.state.changeIndicator}
          saveScore={this.saveScore}
          updateChange={this.updateChange}
        />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreInterface);