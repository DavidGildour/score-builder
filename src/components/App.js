import React from 'react';

import StaffContainer from './StaffContainer';
import language from '../lang/language';

export default class extends React.Component {
    state = {
        lang: 'PL',
    }

    render = () => (
        <div id="main" className="App">
            <ul id="dropdown" className="dropdown-content">
                <li><a href="#!" onClick={() => this.setState({lang: 'PL'})}>PL</a></li>
                <li><a href="#!" onClick={() => this.setState({lang: 'EN'})}>EN</a></li>
            </ul>
            <nav>
                <div className="nav-wrapper green accent-4">
                <a href="/" className="brand-logo"><i className="material-icons left">library_music</i>Score Builder</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><a href="#about" className="modal-trigger">{language[this.state.lang].navbar.about}</a></li>
                    <li>
                        <a
                            className="z-depth-0 btn-floating btn-large pulse green accent-3 modal-trigger"
                            href="#!"
                            data-target="help"
                            style={{ textTransform: 'none' }}
                            >{language[this.state.lang].navbar.help}</a>
                    </li>
                    <li>
                        <a href="#!" data-target="dropdown" className="dropdown-trigger">
                            {language[this.state.lang].navbar.lang} <i className="material-icons right">arrow_drop_down</i>
                        </a>
                    </li>
                </ul>
                </div>
            </nav>
            <div id="about" className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h4 className="center">{language[this.state.lang].navbar.about}</h4>
                    {language[this.state.lang].navbar.aboutContent}
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">{language[this.state.lang].navbar.close}</a>
                </div>
            </div>
            <div id="help" className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h4 className="center">{language[this.state.lang].navbar.help}</h4>
                    {language[this.state.lang].navbar.helpContent.map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">{language[this.state.lang].navbar.close}</a>
                </div>
            </div>
            <StaffContainer lang={language[this.state.lang]} id="0" />
        </div>
    );
}
