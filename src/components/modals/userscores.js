import React from 'react';
import M from 'materialize-css/dist/js/materialize.min';

import scoresAPIClient from '../../utils/scoresAPIClient';

export default class extends React.Component {
  get DEFAULT_STATE() {
    return {
      scores: [],
      loaded: false,
      ref: React.createRef()
    }
  }
  state = this.DEFAULT_STATE;

  componentDidMount = () => {
    M.Modal.init(
      this.state.ref.current,
      {
        onOpenStart: this.loadScores,
        onCloseEnd: () => this.setState(this.DEFAULT_STATE),
      }
    )
  }

  componentDidUpdate = () => {
    if (this.state.loaded === true) M.Collapsible.init(document.querySelectorAll('#scores .collapsible'));
  }

  openScore = (score) => {
    this.props.loadScore(score);
    M.Modal.getInstance(document.querySelector('.modal#scores')).close();
  }

  loadScores = async () => {
    console.log("loading");
    try {
      const resp = await scoresAPIClient.getUserScores(this.props.user.id);
      this.setState({
        loaded: true,
        scores: resp.content,
      })
    } catch (err) {
      console.log(err.message);
    }
  }

  render = () => {
    const content = this.state.loaded ?
    <div className="modal-content">
      <h4 className="center">My scores</h4>
      <ul className="collapsible popout">
        <div className="list-header row teal lighten-3 z-depth-1">
          <div className="col s1">
            No.
          </div>
          <div className="col s7">
            Name
          </div>
          <div className="col s4">
            Created
          </div>
        </div>
        {this.state.scores.map((score, i) => (
          <li key={i}>
          <div className="collapsible-header teal lighten-4 row">
            <div className="col s1">
              {i+1}.
            </div>
            <div className="col s7">
              {score.name}
            </div>
            <div className="col s4">
              {score.created}
            </div>
          </div>
          <div className="collapsible-body teal lighten-5">
            <div>
              {score.description}<br />
              Last edited: {score.last_edit}
            </div>
            <div className="right-align">
              <a href="#!" className="btn-flat" onClick={() => this.openScore(score)}>Open</a>
            </div>
          </div>
        </li>
      ))}
    </ul>
    </div> :
    <div className="modal-content">
      <h4 className="center">Loading...</h4>
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    </div>
    return (
      <div ref={this.state.ref} className="modal collapsible-list" id="scores">
          {content}  
          <div className="modal-footer">
          <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
        </div>
      </div>
    )
  }
}
