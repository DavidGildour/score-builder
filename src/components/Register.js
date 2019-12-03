import React from 'react';


export default class extends React.Component {
  state = {
    username: '',
    email: '',
    password1: '',
    password2: '',
  };

  handleChange = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    })
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({processing: true});

    await this.props.onSubmit(e);

    this.setState({
      password1: '',
      password2: '',
      processing: false
    });
  }

  render = () => {
    let button = this.state.processing ?
      <div className="preloader-wrapper small active top-margin">
        <div className="spinner-layer spinner-green-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div><div className="gap-patch">
            <div className="circle"></div>
          </div><div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div> :
      <button className="btn waves-effect waves-light top-margin" type="submit">
        {this.props.text.register}
      </button>;

    return (
      <div className="user-form col s5 center-align z-depth-2">
        <div className="header"><h4>{this.props.text.register}</h4></div>
        <form onSubmit={this.onSubmit}>
          <input type="text" className="validate" onChange={this.handleChange} value={this.state.username} name="username" placeholder={this.props.text.username} />
          <input type="email" className="validate" onChange={this.handleChange} value={this.state.email} name="email" placeholder={this.props.text.email} />
          <input type="password" className="validate" onChange={this.handleChange} value={this.state.password1} name="password1" placeholder={this.props.text.password} />
          <input type="password" className="validate" onChange={this.handleChange} value={this.state.password2} name="password2" placeholder={this.props.text.repeat_password} />
          {button}
        </form>
        <div className="form-footer">If you do not have an account yet, in order to use Score Builder you need to create one. Go ahead, it's free!</div>
      </div>
    )
  }
}