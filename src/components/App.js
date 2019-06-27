/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';

import './App.css';
import Staff from './Staff';
import Control from './Control';
import store from '../store';

class App extends Component {
    // constructor() {
    //     super();
    //     // store.subscribe(this.render);
    //     console.log(store.getState(), 'wut');
    // }

    componentDidMount() {
        // 测试 devServer 的代理功能
        // fetch('/api/category')
        //     .then(resp => resp.json())
        //     .then(res => console.log('here here', res));
    }

    parseTimeSig = () => `${store.getState().beatsNum}/${store.getState().beatsType}`

    changeHandler = (name, val) => {
        store.dispatch({ type: 'SET_FIELD', field: name, value: val });
    }

    render() {
        const state = store.getState();
        return (
            <div className="App">
                <Staff
                    clef={state.clef}
                    timeSig={this.parseTimeSig()}
                    keySig={state.keySig}
                    beatsNum={parseInt(state.beatsNum, 10)}
                    beatsType={parseInt(state.beatsType, 10)} />
                <Control update={this.changeHandler.bind(this)} />
                <div className="message">
                    {state.message}
                </div>
            </div>
        );
    }
}

export default App;
