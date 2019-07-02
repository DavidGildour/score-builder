import { configureStore } from 'redux-starter-kit';

import rootReducer from './reducers/root';

const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
        message: '',
        staves: [
            {
                clef: 'treble',
                beatsNum: '7',
                beatsType: '4',
                keySig: 'C',
                voices: [
                    {
                        // every note has a 'modifiers' field that is used to map a single key from this note to
                        // corresponding modifier with the same index as a note.
                        // That's why sometimes 'modifiers' array have an empty element
                        id: '0',
                        notes: [
                            {
                                clef: 'treble',
                                keys: ['c/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['c#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['db/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['d/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['d#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['eb/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['e/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['e#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['fb/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['f/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['f#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['gb/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['g/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['g#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['ab/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['a/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['a#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['bb/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['b/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['b#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['d/5', 'eb/4'],
                                duration: 'q',
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
