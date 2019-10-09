import React from 'react';


export default class extends React.Component {
  get DEFAULT_STATE() {
    return {
      username: '',
      email: '',
      password1: '',
      password2: '',
    }
  };
  state = this.DEFAULT_STATE;

  handleChange = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    })
  }

  render = () => (
    <div id="register" className="modal login">
      <div className="modal-content center-align">
        <div className="red-text">{this.props.message}</div>
        <form onSubmit={(e) => {e.preventDefault();this.props.onSubmit(e);this.setState({password1:'',password2:''})}}>
          <input type="text" className="validate" onChange={this.handleChange} value={this.state.username} name="username" placeholder={this.props.text.username} />
          <input type="email" className="validate" onChange={this.handleChange} value={this.state.email} name="email" placeholder={this.props.text.email} />
          <input type="password" className="validate" onChange={this.handleChange} value={this.state.password1} name="password1" placeholder={this.props.text.password} />
          <input type="password" className="validate" onChange={this.handleChange} value={this.state.password2} name="password2" placeholder={this.props.text.repeat_password} />
          <button className="btn waves-effect waves-light top-margin" type="submit">
          {this.props.text.register}
          </button>
        </form>
        </div>
      <div className="modal-footer">
          <a href="#!" className="modal-close btn-flat" onClick={() => this.setState(this.DEFAULT_STATE)}>{this.props.close}</a>
      </div>
    </div>
  )
}