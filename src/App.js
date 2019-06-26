/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';

import './App.css';
import Staff from './Staff';
import Control from './Control';

class App extends Component {
    state = {
        message: '',
        clef: 'treble',
        beatsNum: '4',
        beatsType: '4',
        keySig: 'C',
    };

    componentDidMount() {
        // 测试 devServer 的代理功能
        // fetch('/api/category')
        //     .then(resp => resp.json())
        //     .then(res => console.log('here here', res));
    }

    parseTimeSig = () => `${this.state.beatsNum}/${this.state.beatsType}`

    changeHandler = (name, val) => {
        this.setState({
            [name]: val,
        });
        this.forceUpdate();
    }

    render() {
        return (
            <div className="App">
                <Staff
                    clef={this.state.clef}
                    timeSig={this.parseTimeSig()}
                    keySig={this.state.keySig}
                    beatsNum={parseInt(this.state.beatsNum, 10)}
                    beatsType={parseInt(this.state.beatsType, 10)} />
                <Control update={this.changeHandler.bind(this)} />
                <div className="message">
                    {this.state.message}
                </div>
            </div>
        );
    }
}

export default App;
