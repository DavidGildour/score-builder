import React from 'react';


export default class extends React.Component {
  state = {
      username: '',
      password: '',
  }

  handleChange = (e) => {
      const { value, name } = e.target;
      this.setState({
          [name]: value,
      })
  }

  render = () => (
      <div id="login" className="modal login">
          <div className="modal-content center-align">
              <div className="red-text">{this.props.error}</div>
              <form onSubmit={(e) => {e.preventDefault();this.props.onSubmit(e);this.setState({username:'',password:''})}}>
                  <input type="text" className="validate" onChange={this.handleChange} value={this.state.username} name="username" placeholder={this.props.text.username} />
                  <input type="password" className="validate" onChange={this.handleChange} value={this.state.password} name="password" placeholder={this.props.text.password} />
                  <button className="btn waves-effect waves-light top-margin" type="submit">
                      {this.props.text.login}
                  </button>
              </form>
          </div>
          <div className="modal-footer">
              <a href="#!" className="modal-close btn-flat">{this.props.close}</a>
          </div>
      </div>
  )
}
