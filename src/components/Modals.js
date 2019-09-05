import React from 'react';

export class RegisterModal extends React.Component {
    state = {
        username: '',
        email: '',
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
                    <input type="email" className="validate" onChange={this.handleChange} value={this.state.email} name="email" placeholder={this.props.text.email} />
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

export class UserInfoModal extends React.Component {
    getFlatPasswordField = () => (
        <li className="collection-item">
            <div>
                {this.props.text.password}: 
                <span
                    style={{cursor: 'pointer'}}
                    onClick={() => this.changePasswordField('edit')}
                    className="secondary-content">
                    {this.props.text.change}<i className="material-icons right">create</i>
                </span>
            </div>
        </li>
    );

    componentDidUpdate = (prevProps) => {
        if (prevProps.text !== this.props.text) {
            this.setState({
                passwordField: this.getFlatPasswordField(),
            })
        }
    }

    state = {
        passwordField: this.getFlatPasswordField(),
    }

    changePasswordField = (mode) => {
        if (mode === 'edit') {
            this.setState({
                passwordField:
                <li className="collection-item">
                    <div>
                        {this.props.text.password}:
                        <form className="center-align" onSubmit={(e) => {this.props.editUser(e);this.changePasswordField('flat')}}>
                            <input id="old_password" type="password" placeholder={this.props.text.old_password} />
                            <input id="password1" type="password" placeholder={this.props.text.new_password} />
                            <input id="password2" type="password" placeholder={this.props.text.repeat_password} />
                            <input type="submit" style={{display: 'none'}} />
                            <button className="btn waves-effect waves-light" onClick={() => this.changePasswordField('flat')}>{this.props.text.cancel}</button>&nbsp;
                            <button className="btn waves-effect waves-light" type="submit">{this.props.text.change}</button>
                        </form>
                    </div>
                </li>,
            });
        } else {
            this.setState({
                passwordField: this.getFlatPasswordField(),
            });
        }
    }

    render = () => (
        <div id="user-info" className="modal user-info modal-fixed-footer">
            <div className="modal-content">
                <div className="lime-text text-darken-2 center-align">{this.props.message}</div>
                <h5 className="center-align">{this.props.text.user_info}:</h5>
                <ul className="collection">
                    <li className="collection-item">
                        <div>
                            {this.props.text.username}: <span className="secondary-content">{this.props.user.username}</span>
                        </div>
                    </li>
                    <li className="collection-item">
                        <div>
                            {this.props.text.email}: <span className="secondary-content">{this.props.user.email}</span>
                        </div>
                    </li>
                    {this.state.passwordField}
                    <li className="collection-item">
                        <div>
                            {this.props.text.registration_date}: <span className="secondary-content">{this.props.user.registration_date}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="modal-footer">
                <a href="#!" onClick={() => {this.changePasswordField('flat');this.props.clearMessage();}} className="modal-close btn-flat">{this.props.close}</a>
            </div>
        </div>
    );
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