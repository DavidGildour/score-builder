import React, { Component } from 'react';

import './App.css';
import StaffContainer from './StaffContainer';

class App extends Component {
    state = {
            x: 0,
            y: 0,
            note: null,
        }

    handleMouseMove = (e) => {
        const curX = e.pageX;
        const curY = e.pageY;
        let note;

        if (curY <= 140) note = 'F/5';
        else if (curY > 140 && curY <= 146 ) note = 'E/5';
        else if (curY > 146 && curY <= 150 ) note = 'D/5';
        else if (curY > 150 && curY <= 156 ) note = 'C/5';
        else if (curY > 156 && curY <= 160 ) note = 'B/4';
        else if (curY > 160 && curY <= 166 ) note = 'A/4';
        else if (curY > 166 && curY <= 170 ) note = 'G/4';
        else if (curY > 170 && curY <= 176 ) note = 'F/4';
        else if (curY > 176 && curY <= 180 ) note = 'E/4';
        else if (curY > 180 ) note = 'D/4';

        this.setState({x: curX, y: curY, note: note})
    }

    render() {
        return (
            <div id="main" className="App" onMouseMove={this.handleMouseMove}>
                <StaffContainer
                    note={this.state.note}
                    id="0" />
                <div>
                    X: {this.state.x}&nbsp;
                    Y: {this.state.y}&nbsp;
                    Note: {this.state.note}
                </div>
            </div>
        );
    }
}

export default App;
