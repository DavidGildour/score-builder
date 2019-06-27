/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';

import './App.css';
import Staff from './Staff';
import Control from './Control';
import store from '../store';

class App extends Component {
    componentDidMount() {
        // 测试 devServer 的代理功能
        // fetch('/api/category')
        //     .then(resp => resp.json())
        //     .then(res => console.log('here here', res));
    }

    changeHandler = (name, val) => {
        store.dispatch({ type: 'SET_FIELD', field: name, value: val });
        this.forceUpdate();
    }

    render() {
        const state = store.getState();
        return (
            <div className="App">
                <Staff
                    clef={state.clef}
                    timeSig={`${state.beatsNum}/${state.beatsType}`}
                    keySig={state.keySig}
                    beatsNum={parseInt(state.beatsNum, 10)}
                    beatsType={parseInt(state.beatsType, 10)} />
                <Control update={this.changeHandler.bind(this)} />
            </div>
        );
    }
}

export default App;
