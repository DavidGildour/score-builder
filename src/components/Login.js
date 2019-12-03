import React from 'react';


export default class extends React.Component {
  state = {
    username: '',
    password: '',
    processing: false,
    elemRef: React.createRef(),
  }

  handleChange = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    })
  }

  _isMounted = () => this.state.elemRef.current !== null;

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({processing: true});

    await this.props.onSubmit(e);

    if (this._isMounted()) {
      this.setState({
        username: '',
        password: '',
        processing: false
      });
    }
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
        {this.props.text.login}
      </button>;
    return (
      <div ref={this.state.elemRef} className="user-form col s5 center-align z-depth-2">
        <div className="header"><h4>{this.props.text.login}</h4></div>
        <form onSubmit={this.onSubmit}>
          <input type="text" className="validate" onChange={this.handleChange} value={this.state.username} name="username" placeholder={this.props.text.username} />
          <input type="password" className="validate" onChange={this.handleChange} value={this.state.password} name="password" placeholder={this.props.text.password} />
          {button}
        </form>
        <div className="form-footer">If you already have an account, this is where you can log yourself in.</div>
      </div>
    )
  }
}
