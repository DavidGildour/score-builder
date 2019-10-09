import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';

import rootReducer from './reducers/root';

const preloadedState = {
    message: '',
    staves: [
        {
            clef: 'treble',
            beatsNum: '4',
            beatsType: '4',
            keySig: 'C',
            measures: [
                {
                    id: '0',
                    voices: [
                        {
                            // every note has a 'modifiers' field that is used to map a single key from this note to
                            // corresponding modifier with the same index as a note.
                            // That's why sometimes 'modifiers' array have an empty element
                            id: '0',
                            notes: [
                                {
                                    clef: 'treble',
                                    keys: ['A/4'],
                                    duration: 'wr',
                                    modifiers: [''],
                                    persistent: false,
                                },
                            ],
                        },
                        {       
                            id: '1',
                            notes: [
                                {
                                    clef: 'treble',
                                    keys: ['E/5'],
                                    duration: 'wr',
                                    modifiers: [''],
                                    persistent: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: preloadedState,
});

export default store;
