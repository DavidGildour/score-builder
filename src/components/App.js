import React from 'react';
import M from 'materialize-css/dist/js/materialize.min'

import StaffContainer from './StaffContainer';
import language from '../lang/language';
import { LoginModal, HelpModal, AboutModal, RegisterModal, UserInfoModal, UserListModal } from './Modals';
import NavBar from './Navbar';
import { getUser, getAuth, logOutUser, registerUser, updatePassword, deleteUser, getUsers } from '../utils/Requests';

class InfoBox extends React.Component {
    componentDidUpdate = (prevProps) => {
        if (prevProps.loggedIn !== this.props.loggedIn) {
            const info = M.Tooltip.init(document.querySelector('.tooltipped.info-box'), {margin: 0, transitionMovement: 7, exitDelay: 1200});
            info.open();
            info.close();
        }
    }

    render = () => <div className="tooltipped info-box" data-tooltip={this.props.loggedIn ? this.props.text.logged_in : this.props.text.logged_out} data-position="bottom" />
}

export default class extends React.Component {
    state = {
        lang: 'EN',
        isLogged: false,
        user: null,
        loginError: null,
        registerStatus: null,
        message: null,
        userList: [],
    };

    componentDidMount = () => {
        getUser()
        .then((json) => {
            this.setState({
                user: json.content,
                isLogged: true,
            })
        })
        .catch(err => {
            console.log(err.message);
        });
    }

    logIn = (e) => {
        const { username, password } = e.target;
        getAuth(username.value, password.value)
        .then((json) => {
            if (json.hasOwnProperty('content')) {
                const elem = document.querySelector('#login');
                M.Modal.getInstance(elem).close();
                const user = json.content;
                delete user.access_token;
                this.setState({
                    user: user,
                    isLogged: true,
                    loginError: null,
                });
            } else {
                throw Error('Invalid credentials!');
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                loginError: err.message,
            });
        });
        
    }

    logOut = () => {
        logOutUser()
        .then(resp => {
            if (resp.status === 200) {
                this.setState({
                    user: null,
                    isLogged: false,
                    loginError: null,
                });
            } else {
            throw Error('Something went wrong, please try again.');
            }
        })
        .catch(err => {
            this.setState({
                loginError: err.message,
            });
        });
    }

    register = (e) => {
        const { username, password1, password2, email } = e.target;
        if (password1.value !== password2.value) {
            this.setState({
                registerStatus: 'Passwords do not match!'
            })
            return;
        }
        registerUser(username.value, password1.value, password2.value, email.value)
        .then((json) => {
            this.setState({
                registerStatus: json.message,
            })
        })
        .catch((err) => {
            this.setState({
                registerStatus: err.message,
            })
        })
    }

    getUserList = () => {
        getUsers()
        .then(data => {
            if (data.message === "Success.") {
                this.setState({
                    userList: data.content,
                })
            } else {
                throw Error(data.message)
            }
        })
        .catch(err => this.setState({ message: err.message }))
    }

    clearUserList = () => {
        this.setState({ userList: [], message: null });
    }

    langChange = (lang) => {
        this.setState({
            lang: lang,
        });
    }

    editUser = (e) => {
        const { password1, password2, old_password } = e.target;
        updatePassword(old_password.value, password1.value, password2.value)
        .then(json => {
            this.setState({
                message: json.message,
            });
        })
        .catch(err => {
            this.setState({
                message: err.message,
            })
        })
    }

    deleteMe = () => {
        deleteUser()
        .then(_ => {
            const elem = document.querySelector('#user-info');
            M.Modal.getInstance(elem).close();
            this.setState({
                user: null,
                isLogged: false,
                loginError: null,
            });
        })
        .catch(err => this.setState({ message: err.message }))
    }

    render = () => {
        let logButton;
        let registerButton;
        let userInfoModal;

        if (this.state.isLogged) {
            userInfoModal = 
                <UserInfoModal
                    message={this.state.message}
                    text={language[this.state.lang].navbar.forms}
                    clearMessage={() => this.setState({message: null})}
                    deleteMe={this.deleteMe}
                    editUser={this.editUser} 
                    user={this.state.user}
                    close={language[this.state.lang].navbar.close} />
            logButton = null;
            registerButton = null;
        } else {
            logButton = <li><a href="#login" className="modal-trigger">{language[this.state.lang].navbar.forms.login}</a></li>;
            registerButton = <li><a href="#register" className="modal-trigger">{language[this.state.lang].navbar.forms.register}</a></li>;
            userInfoModal = null;
        }
        return (
            <div id="main" className="App">
                <NavBar
                    getUserList={this.getUserList}
                    user={this.state.user}
                    text={language[this.state.lang].navbar}
                    logButton={logButton}
                    registerButton={registerButton}
                    logOut={this.logOut}
                    langChange={this.langChange}
                />
                <InfoBox text={language[this.state.lang].navbar.forms.info} loggedIn={this.state.isLogged} />
                {userInfoModal}
                <RegisterModal
                    text={language[this.state.lang].navbar.forms}
                    close={language[this.state.lang].navbar.close}
                    message={this.state.registerStatus}
                    onSubmit={this.register}
                />
                <LoginModal
                    text={language[this.state.lang].navbar.forms}
                    onSubmit={this.logIn}
                    close={language[this.state.lang].navbar.close}
                    error={this.state.loginError}
                />
                <AboutModal
                    about={language[this.state.lang].navbar.about}
                    aboutContent={language[this.state.lang].navbar.aboutContent}
                    author={language[this.state.lang].author}
                    close={language[this.state.lang].navbar.close}
                />
                <HelpModal
                    help={language[this.state.lang].navbar.help}
                    helpContent={language[this.state.lang].navbar.helpContent}
                    close={language[this.state.lang].navbar.close}
                />
                <UserListModal
                    users={this.state.userList}
                    message={this.state.message}
                    clearUserList={this.clearUserList} />
                <StaffContainer lang={language[this.state.lang]} id="0" />
            </div>
        )
    };
}
