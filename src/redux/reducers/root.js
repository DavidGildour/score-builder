/* eslint-disable object-shorthand */
import changeStave from './changeStave';
import { setField, addNoteToVoice, deleteNoteFromVoice, updateNoteInVoice } from '../actions';

const defaultState = {
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
};


const rootReducer = (state = defaultState, action) => {
    console.log('root', action);
    switch (action.type) {
        case 'SET_STAVE_FIELD': {
            const { id, field, value } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index === parseInt(id, 10)) return changeStave(stave, setField({ field: field, value: value }));
                    return stave;
                }),
            };
        }
        case 'ADD_NOTE_TO_STAVE': {
            const { staveId, voiceId, note } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index === parseInt(staveId, 10)) {
                        return changeStave(stave,
                                           addNoteToVoice({ voiceId: voiceId, note: note }));
                    }
                    return stave;
                }),
            };
        }
        case 'DELETE_NOTE_FROM_STAVE': {
            const { staveId, voiceId, noteId } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index === parseInt(staveId, 10)) {
                        return changeStave(stave,
                                           deleteNoteFromVoice({ voiceId: voiceId, noteId: noteId }));
                    }
                    return stave;
                }),
            };
        }
        case 'UPDATE_NOTE_IN_STAVE': {
            const { staveId, voiceId, noteId, keys } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index.toString() === staveId) {
                        return changeStave(stave,
                                           updateNoteInVoice({ voiceId: voiceId, noteId: noteId, keys: keys }));
                    }
                    return stave;
                }),
            };
        }
        case 'ADD_VOICE_TO_STAVE': {
            const { staveId } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index.toString() === staveId) {
                        return {
                            ...stave,
                            voices: stave.voices.concat({
                                id: stave.voices.length.toString(),
                                notes: [],
                            }),
                        };
                    }
                    return stave;
                }),
            };
        }
        case 'REMOVE_VOICE_FROM_STAVE': {
            const { staveId, voiceId } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index.toString() === staveId) {
                        return {
                            ...stave,
                            voices: stave.voices.filter(voice => voice.id !== voiceId),
                        };
                    }
                    return stave;
                }),
            };
        }
        default: return state;
    }
};

export default rootReducer;
