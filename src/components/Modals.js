import React from 'react';
import M from 'materialize-css/dist/js/materialize.min';

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
    toggleAnim = id => {
        const elem = document.querySelector(`.custom-collapsible#${id}`)
        switch(elem.className) {
            case 'custom-collapsible collapse':
                elem.className = 'custom-collapsible expand';
                break;
            case 'custom-collapsible expand':
                elem.className = 'custom-collapsible collapse';
                break;
            default:
                elem.className = 'custom-collapsible expand';
        }
    }

    cleanUp = () => {
        this.props.clearMessage();
        const elems = document.getElementsByClassName('custom-collapsible');
        for (const elem of elems) {
            elem.className = 'custom-collapsible';
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
                    <li className="collection-item">
                    <div id='password' className="custom-collapsible">
                        {this.props.text.password}: 
                        <span className="secondary-content" style={{cursor: 'pointer'}} onClick={() => this.toggleAnim('password')}>
                            {this.props.text.change}<i className="material-icons right">create</i>
                        </span>
                        <div className="content">
                            <form className="center-align" onSubmit={(e) => {this.props.editUser(e);this.toggleAnim('password')}}>
                                <input id="old_password" type="password" placeholder={this.props.text.old_password} />
                                <input id="password1" type="password" placeholder={this.props.text.new_password} />
                                <input id="password2" type="password" placeholder={this.props.text.repeat_password} />
                                <input type="submit" style={{display: 'none'}} />
                                <button className="btn waves-effect waves-light" onClick={(e) => {e.preventDefault();this.toggleAnim('password')}}>{this.props.text.cancel}</button>&nbsp;
                                <button className="btn waves-effect waves-light" type="submit">{this.props.text.change}</button>
                            </form>
                        </div>
                    </div>
                    </li>
                    <li className="collection-item">
                        <div>
                            {this.props.text.registration_date}: <span className="secondary-content">{this.props.user.registration_date}</span>
                        </div>
                    </li>
                </ul>
                <div id='delete-box' className="custom-collapsible">
                    <button style={{zIndex: 11}} onClick={() => this.toggleAnim('delete-box')} className="btn red waves-effect waves-light fill" id="delete">{this.props.text.delete.delete}</button>
                    <div className="content" style={{bottom: '-3em'}}>
                        <div id="info" className="card red lighten-4">
                            <div className="card-content">
                                <span className="card-title">{this.props.text.delete.message_header}</span>
                                <p>{this.props.text.delete.message_content}</p>
                            </div>
                            <div className="card-action">
                                <div className="row">
                                    <div className="col s6">
                                        <button onClick={() => this.toggleAnim('delete-box')} className="fill btn green waves-effect" id="cancel">{this.props.text.cancel}</button>
                                    </div>
                                    <div className="col s6">
                                        <button onClick={this.props.deleteMe} className="fill btn red waves-effect" id="confirm">{this.props.text.delete.confirm}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <a href="#!" onClick={this.cleanUp} className="modal-close btn-flat">{this.props.close}</a>
            </div>
        </div>
    );
}

export class UserListModal extends React.Component {
    state = {
        loaded: false,
        users: [],
    }

    componentDidUpdate = () => {
        if (this.state.loaded === true) M.Collapsible.init(document.querySelector('#userlist .collapsible'));
        if (JSON.stringify(this.props.users) !== JSON.stringify(this.state.users)) {
            this.setState({
                users: this.props.users,
                loaded: true,
            })
        }
    }

    close = () => {
        M.Modal.getInstance(document.getElementById('userlist')).close();
        this.props.clearUserList();
        this.setState({
            loaded: false,
            users: [],
        })
    }

    render = () => {
        const list = this.state.users.length > 0 ? 
        this.state.users.map((user, i) => (
            <li>
                <div className="collapsible-header">{i+1}. {user.username} - {user.id}</div>
                <div className="collapsible-body">
                    <p>role: {user.role_id === 1 ? 'ADMIN' : 'USER'}</p>
                    <p>e-mail: {user.email}</p>
                    <p>registration date: {user.registration_date}</p>
                </div>
            </li>
        )) : <span>No users to display. What are you doing here?</span>;
        const content = this.state.loaded ?
        <div className="modal-content">
            <span className="red-text">{this.props.message}</span>
            <h4 className="center">Registered users:</h4>
            <ul className="collapsible">
                {list}
            </ul>
        </div>
        : 
        <div className="modal-content">
            <span className="red-text">{this.props.message}</span>
            <h4 className="center">Loading...</h4>
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        </div>;
        return (
            <div id="userlist" className="modal modal-fixed-footer">
                {content}
                <div className="modal-footer">
                    <a href="#!" className="btn-flat" onClick={this.close}>Close</a>
                </div>
            </div>
        )
    }
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