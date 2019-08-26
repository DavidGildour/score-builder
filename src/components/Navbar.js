import React from 'react';

export const LangDrop = (props) => (
    <ul id="dropdown" className="dropdown-content">
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

export const NavBar = (props) => (
        <nav>
            <div className="nav-wrapper teal">
            <a href="/" className="brand-logo"><i className="material-icons left">library_music</i>Score Builder</a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                {props.registerButton}
                {props.logButton}
                <li><a href="#about" className="modal-trigger">{props.text.about}</a></li>
                <li>
                    <a href="#!" data-target="dropdown" className="dropdown-trigger">
                        {props.text.lang}<i className="material-icons right">arrow_drop_down</i>
                    </a>
                </li>
                <li>
                    <a
                        className="z-depth-0 btn-floating btn-medium pulse teal accent-4 modal-trigger tooltipped"
                        data-position="right"
                        data-tooltip={props.text.help}
                        href="#!"
                        data-target="help"
                        ><i className="material-icons">help_outline</i></a>
                </li>
            </ul>
            </div>
        </nav>
    );