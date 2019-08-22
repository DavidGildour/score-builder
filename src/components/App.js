import React from 'react';

import StaffContainer from './StaffContainer';
import language from '../lang/language';

const LoginModal = (props) => (
    <div id="login" className="modal">
        <div className="modal-content center-align">
            <div class="red-text">{props.error}</div>
            <form onSubmit={props.onSubmit}>
                <input type="text" className="validate" name="username" placeholder="Username" />
                <input type="password" className="validate" name="password" placeholder="Password" />
                <button className="btn waves-effect waves-light top-margin" type="submit">
                    Log in
                </button>
            </form>
            </div>
        <div className="modal-footer">
            <a href="#!" className="modal-close btn-flat">{props.close}</a>
        </div>
    </div>
)

const AboutModal = (props) => (
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

const HelpModal = (props) => (
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

export default class extends React.Component {
    state = {
        lang: 'EN',
        isLogged: false,
        user: null,
        loginError: null,
    }

    
    logIn = (e) => {
        e.preventDefault();
        const { username, password } = e.target;
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            })
        })
        .then(resp => {
            if (resp.status === 200) {
                return resp.json();
            } else {
                throw new Error('Invalid credentials!');
            }
        })
        .then(out => {
            console.log(out);
            this.setState({
                user: out.content.username,
                isLogged: true,
                loginError: null,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                loginError: err.message,
            })
        })
    }

    logOut = () => {
        this.setState({
            user: null,
            isLogged: false,
        })
    }

    render = () => {
        let button;

        if (!this.state.isLogged) {
            button = <li><a href="#login" className="modal-trigger">Log in</a></li>;
        } else {
            button = <li><a href="#!" onClick={this.logOut}>Logout ({this.state.user})</a></li>
        }
        return (
            <div id="main" className="App">
                <ul id="dropdown" className="dropdown-content">
                    <li>
                        <a href="#!" onClick={() => this.setState({lang: 'PL'})}>
                            PL <img className="lang-ico" alt="en_flag" width="25" height="25" src={process.env.PUBLIC_URL + '/lang_icons/pl.ico'} />
                        </a>
                    </li>
                    <li>
                        <a href="#!" onClick={() => this.setState({lang: 'EN'})}>
                            EN <img className="lang-ico" alt="en_flag" width="25" height="25" src={process.env.PUBLIC_URL + '/lang_icons/en.ico'} />
                        </a>
                    </li>
                </ul>
                <nav>
                    <div className="nav-wrapper teal">
                    <a href="/" className="brand-logo"><i className="material-icons left">library_music</i>Score Builder</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {button}
                        <li><a href="#about" className="modal-trigger">{language[this.state.lang].navbar.about}</a></li>
                        <li>
                            <a href="#!" data-target="dropdown" className="dropdown-trigger">
                                {language[this.state.lang].navbar.lang}<i className="material-icons right">arrow_drop_down</i>
                            </a>
                        </li>
                        <li>
                            <a
                                className="z-depth-0 btn-floating btn-medium pulse teal accent-4 modal-trigger tooltipped"
                                data-position="right"
                                data-tooltip={language[this.state.lang].navbar.help}
                                href="#!"
                                data-target="help"
                                ><i className="material-icons">help_outline</i></a>
                        </li>
                    </ul>
                    </div>
                </nav>
                <LoginModal
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
