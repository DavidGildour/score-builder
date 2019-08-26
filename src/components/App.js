import React from 'react';
import M from 'materialize-css/dist/js/materialize.min'

import StaffContainer from './StaffContainer';
import language from '../lang/language';
import { LoginModal, HelpModal, AboutModal, RegisterModal } from './Modals';
import { NavBar, LangDrop } from './Navbar';
import { getUser, getAuth, logOutUser, registerUser } from '../utils/Requests';

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
    };

    componentDidMount = () => {
        getUser()
        .then((json) => {
            this.setState({
                user: json.content.username,
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
                this.setState({
                    user: json.content.username,
                    isLogged: true,
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

    logOut = (e) => {
        e.preventDefault();
        logOutUser()
        .then(resp => {
            if (resp.status === 200) {
                this.setState({
                    user: null,
                    isLogged: false,
                });
            } else {
            throw new Error('Something went wrong, please try again.');
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                loginError: err.message,
            });
        });
    }

    register = (e) => {
        const { username, password1, password2 } = e.target;
        if (password1.value !== password2.value) {
            this.setState({
                registerStatus: 'Passwords do not match!'
            })
            return;
        }
        registerUser(username.value, password1.value, password2.value)
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

    langChange = (lang) => {
        this.setState({
            lang: lang,
        });
    }

    render = () => {
        let logButton;
        let registerButton;

        if (this.state.isLogged) {
            logButton = <li><a href="#!" onClick={this.logOut}>{language[this.state.lang].navbar.forms.logout} ({this.state.user})</a></li>;
            registerButton = null;
        } else {
            logButton = <li><a href="#login" className="modal-trigger">{language[this.state.lang].navbar.forms.login}</a></li>;
            registerButton = <li><a href="#register" className="modal-trigger">{language[this.state.lang].navbar.forms.register}</a></li>;
        }
        return (
            <div id="main" className="App">
                <LangDrop onChange={this.langChange} />
                <NavBar text={language[this.state.lang].navbar} logButton={logButton} registerButton={registerButton} />
                <InfoBox text={language[this.state.lang].navbar.forms.info} loggedIn={this.state.isLogged} />
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
                <StaffContainer lang={language[this.state.lang]} id="0" />
            </div>
        )
    };
}
