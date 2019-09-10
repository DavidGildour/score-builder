import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';
import 'materialize-css/dist/css/materialize.min.css';
import './custom.css';
import './anim.css';
import store from './redux/store';

ReactDOM.render(
    <div className="container">
        <Provider store={store}>
            <App />
        </Provider>
    </div>,
    document.getElementById('root'),
);
