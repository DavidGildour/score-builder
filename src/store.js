import { configureStore } from 'redux-starter-kit';

import rootReducer from './reducers/root';

const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
        message: '',
        clef: 'treble',
        beatsNum: '4',
        beatsType: '4',
        keySig: 'C',
    },
});

export default store;
