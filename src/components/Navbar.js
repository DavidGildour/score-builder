import React from 'react';
import M from 'materialize-css/dist/js/materialize.min';

const DROPDOWN_OPTIONS = {
    hover: true,
    coverTrigger: false,
}

const LangDrop = (props) => (
    <ul id="lang-dropdown" className="dropdown-content">
        <li>
            <a href="#!" onClick={() => props.onChange("PL")}>
                PL <img className="lang-ico" alt="en_flag" width="25" height="25" src={process.env.PUBLIC_URL + '/lang_icons/pl.ico'} />
            </a>
        </li>
        <li>
            <a href="#!" onClick={() => props.onChange("EN")}>
                EN <img className="lang-ico" alt="en_flag" width="25" height="25" src={process.env.PUBLIC_URL + '/lang_icons/en.ico'} />
            </a>
        </li>
    </ul>
);

const UserDrop = (props) => (
    <ul id="user-dropdown" className="dropdown-content">
        <li><a href="#user-info" className="modal-trigger">{props.text.edit}</a></li>
        <li><a href="#!" onClick={props.logOut}>{props.text.logout}</a></li>
    </ul>
)

export default class extends React.Component {
    componentDidUpdate = (prevProps) => {
        if (this.props.user !== prevProps.user) {
            M.Modal.init(document.querySelector('#user-info'));
        }
    }

    componentDidMount = () => {
        M.Dropdown.init(document.querySelector('#lang'), DROPDOWN_OPTIONS);
        M.Dropdown.init(document.querySelector("a.dropdown-trigger[data-target='user-dropdown']"), DROPDOWN_OPTIONS);
        M.Modal.init(document.querySelectorAll('.modal'));
    }

    openUserList = () => {
        M.Modal.getInstance(document.getElementById('userlist')).open();
        this.props.getUserList();
    }

    render = () => {
        // this is ugly, but due to some error with initializing the dropdown I had to do this that way
        // upside - it works; downsides - it's ugly
        const userOptions =
            <li style={{display: (this.props.user ? 'initial' : 'none')}}>
                <a href="#!" id="user-opt" data-target="user-dropdown" className="dropdown-trigger">
                    {this.props.user ? this.props.user.username : ""}<i className="material-icons right">arrow_drop_down</i>
                </a>
            </li>;

        let userList;
        if (this.props.user && this.props.user.role_id === 1) userList = <li><a href="#!" onClick={this.openUserList}>User list</a></li>;
        else userList = null;

        return (
            <nav>
                <LangDrop onChange={this.props.langChange} />
                <UserDrop text={this.props.text.forms} logOut={this.props.logOut} />
                <div className="nav-wrapper teal">
                <a href="/" className="brand-logo"><i className="material-icons left">library_music</i>Score Builder</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {userList}
                    {userOptions}
                    {this.props.registerButton}
                    {this.props.logButton}
                    <li><a href="#about" className="modal-trigger">{this.props.text.about}</a></li>
                    <li>
                        <a href="#!" id="lang" data-target="lang-dropdown" className="dropdown-trigger">
                            {this.props.text.lang}<i className="material-icons right">arrow_drop_down</i>
                        </a>
                    </li>
                    <li>
                        <a
                            className="z-depth-0 btn-floating btn-medium pulse teal accent-4 modal-trigger tooltipped"
                            data-position="right"
                            data-tooltip={this.props.text.help}
                            href="#help"
                        ><i className="material-icons">help_outline</i></a>
                    </li>
                </ul>
                </div>
            </nav>
        )
    }
};