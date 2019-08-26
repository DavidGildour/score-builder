import React from 'react';

export class RegisterModal extends React.Component {
    state = {
        username: '',
        password1: '',
        password2: '',
    }

    handleChange = (e) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        })
    }

    render = () => (
        <div id="register" className="modal login">
            <div className="modal-content center-align">
                <div>{this.props.message}</div>
                <form onSubmit={(e) => {e.preventDefault();this.props.onSubmit(e);this.setState({password1:'',password2:''})}}>
                    <input type="text" className="validate" onChange={this.handleChange} value={this.state.username} name="username" placeholder={this.props.text.username} />
                    <input type="password" className="validate" onChange={this.handleChange} value={this.state.password1} name="password1" placeholder={this.props.text.password} />
                    <input type="password" className="validate" onChange={this.handleChange} value={this.state.password2} name="password2" placeholder={this.props.text.repeat_password} />
                    <button className="btn waves-effect waves-light top-margin" type="submit">
                    {this.props.text.register}
                    </button>
                </form>
                </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close btn-flat">{this.props.close}</a>
            </div>
        </div>
    )
}

export class LoginModal extends React.Component {
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

export const AboutModal = (props) => (
    <div id="about" className="modal modal-fixed-footer">
        <div className="modal-content">
            <h4 className="center">{props.about}</h4>
            {props.aboutContent.map((line, i) => <p key={i}>{line}</p>)}
            {props.author}<a target="_blank" rel="noopener noreferrer" href="https://github.com/DavidGildour">Maciej B. Nowak</a>
        </div>
        <div className="modal-footer">
            <a href="#!" className="modal-close btn-flat">{props.close}</a>
        </div>
    </div>
)

export const HelpModal = (props) => (
    <div id="help" className="modal modal-fixed-footer">
        <div className="modal-content">
            <h4 className="center">{props.help}</h4>
            {props.helpContent.map((line, i) => <p key={i}>{line}</p>)}
        </div>
        <div className="modal-footer">
            <a href="#!" className="modal-close btn-flat">{props.close}</a>
        </div>
    </div>
)