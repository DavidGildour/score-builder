import React, { Component } from 'react';

import StaffContainer from './StaffContainer';

class App extends Component {
    state = {
            x: 0,
            y: 0,
        }

    handleMouseMove = (e) => {
        const curX = e.pageX;
        const curY = e.pageY;

        this.setState({x: curX, y: curY})
    }

    render() {
        return (
            <div id="main" className="App" onMouseMove={this.handleMouseMove}>
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
                <div>
                    X: {this.state.x}&nbsp;
                    Y: {this.state.y}&nbsp;
                </div>
                <StaffContainer id="0" />
            </div>
        );
    }
}

export default App;
