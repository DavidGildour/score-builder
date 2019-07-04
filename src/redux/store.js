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
                                keys: ['C/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['C##/4'],
                                duration: '16',
                                modifiers: ['##'],
                            },
                            {
                                clef: 'treble',
                                keys: ['Db/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['D/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['D#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['Eb/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['E/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['E##/4'],
                                duration: '16',
                                modifiers: ['##'],
                            },
                            {
                                clef: 'treble',
                                keys: ['Fbb/4'],
                                duration: '16',
                                modifiers: ['bb'],
                            },
                            {
                                clef: 'treble',
                                keys: ['F/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['F#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['Fb/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['G/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['G#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['Ab/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['A/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['A#/4'],
                                duration: '16',
                                modifiers: ['#'],
                            },
                            {
                                clef: 'treble',
                                keys: ['Bb/4'],
                                duration: '16',
                                modifiers: ['b'],
                            },
                            {
                                clef: 'treble',
                                keys: ['B/4'],
                                duration: '16',
                                modifiers: [''],
                            },
                            {
                                clef: 'treble',
                                keys: ['B##/4'],
                                duration: '16',
                                modifiers: ['##'],
                            },
                            {
                                clef: 'treble',
                                keys: ['D/5', 'eb/4'],
                                duration: 'q',
                                modifiers: ['.', ''],
                            },
                            {
                                clef: 'treble',
                                keys: ['C/5', 'Eb/5', 'G#/5'],
                                duration: 'q',
                                modifiers: ['.', 'b.', '#.'],
                            },
                        ],
                    },
                    {       
                        id: '1',
                        notes: [
                            {
                                clef: 'treble',
                                keys: ['d/4'],
                                duration: 'wdr',
                                modifiers: ['.'],
                            },
                            {
                                clef: 'treble',
                                keys: ['d/4'],
                                duration: 'qr',
                                modifiers: [''],
                            },
                        ],
                    },
                ],
            },
        ],
    },
});

export default store;
