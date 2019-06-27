/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';

import './App.css';
import store from '../store';
import Staff from './Staff';
import Control from './Control';

class App extends Component {
    componentDidMount() {
        // 测试 devServer 的代理功能
        // fetch('/api/category')
        //     .then(resp => resp.json())
        //     .then(res => console.log('here here', res));
    }

    parseTimeSig = () => `${store.beatsNum}/${store.beatsType}`

    changeHandler = (name, val) => {
        store.dispatch({ type: 'SET_FIELD', field: name, value: val });
    }

    render() {
        return (
            <div className="App">
                <Staff
                    clef={store.clef}
                    timeSig={this.parseTimeSig()}
                    keySig={store.keySig}
                    beatsNum={parseInt(store.beatsNum, 10)}
                    beatsType={parseInt(store.beatsType, 10)} />
                <Control update={this.changeHandler.bind(this)} />
                <div className="message">
                    {store.message}
                </div>
            </div>
        );
    }
}

export default App;
