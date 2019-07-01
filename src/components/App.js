import React, { Component } from 'react';

import './App.css';
import Staff from './Staff';
import Control from './Control';

class App extends Component {
    state = {
            x: 0,
            y: 0,
        }

    render() {
        return (
            <div id="main" className="App"  onMouseMove={e => this.setState({x: e.pageX, y: e.pageY})}>
                <Staff />
                <Control
                    id="0" />
                <div>
                    X: {this.state.x}&nbsp;
                    Y: {this.state.y}
                </div>
            </div>
        );
    }
}

export default App;
