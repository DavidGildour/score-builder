import { configureStore } from 'redux-starter-kit';

import rootReducer from './reducers/root';

const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
        message: '',
        staves: [
            {
                clef: 'treble',
                beatsNum: '4',
                beatsType: '4',
                keySig: 'C',
                voices: [
                    {
                        // every note has a 'modifiers' field that is used to map a single key from this note to
                        // corresponding modifier with the same index as a note.
                        // That's why sometimes 'modifiers' array have an empty element
                        notes: [
                            {
                                clef: 'treble',
                                keys: ['e##/5'],
                                duration: '8d',
                                modifiers: ['##.'],
                            },
                            {
                                clef: 'treble',
                                keys: ['eb/5'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['d/5', 'eb/4'],
                                duration: 'h',
                                modifiers: ['.', ''],
                            },
                            {
                                clef: 'treble',
                                keys: ['c/5', 'eb/5', 'g#/5'],
                                duration: 'q',
                                modifiers: ['.', 'b.', '#.'],
                            },
                        ],
                    },
                ],
            },
        ],
    },
});

export default store;
