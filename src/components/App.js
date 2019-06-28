import React, { Component } from 'react';

import './App.css';
import Staff from './Staff';
import Control from './Control';

class App extends Component {
    componentDidMount() {
        // 测试 devServer 的代理功能
        // fetch('/api/category')
        //     .then(resp => resp.json())
        //     .then(res => console.log('here here', res));
    }

    render() {
        return (
            <div className="App">
                <Staff id="0" />
                <Control
                    id="0" />
            </div>
        );
    }
}

export default App;
