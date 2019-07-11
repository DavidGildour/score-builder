import React, { Component } from 'react';

import StaffContainer from './StaffContainer';

export default () => (
    <div id="main" className="App">
        <nav>
            <div className="nav-wrapper green accent-4">
            <a href="/" className="brand-logo">Score Builder</a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><a href="/">Nice</a></li>
                <li><a href="/">Navbar</a></li>
                <li><a href="/">Huh?</a></li>
            </ul>
            </div>
        </nav>
        <StaffContainer id="0" />
    </div>
);
