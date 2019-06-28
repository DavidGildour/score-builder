import changeNote from './changeNote';
import { setClef } from '../actions';

export default (state = {}, action) => {
    console.log('changestave', action);
    switch (action.type) {
        case 'SET_FIELD': {
            const { field, value } = action.payload;
            if (field === 'clef') {
                return {
                    ...state,
                    voices: state.voices.map(voice => ({
                        ...voice,
                        notes: voice.notes.map(note => changeNote(note, setClef({ clef: value }))),
                    })),
                    [field]: value,
                };
            }
            return {
                ...state,
                [field]: value,
            };
        }
        case 'ADD_NOTE_TO_VOICE': {
            const { voiceId, note } = action.payload;
            return {
                ...state,
                voices: state.voices.map((voice, index) => {
                    if (parseInt(index, 10) === voiceId) {
                        return {
                            ...voice,
                            notes: voice.notes.concat([note]),
                        };
                    }
                    return voice;
                }),
            };
        }
        case 'DELETE_NOTE_FROM_VOICE': {
            const { voiceId, noteId } = action.payload;
            return {
                ...state,
                voices: state.voices.map((voice, index) => {
                    if (parseInt(index, 10) === voiceId) {
                        return {
                            ...voice,
                            notes: voice.notes.filter((note, i) => i !== noteId),
                        };
                    }
                    return voice;
                }),
            };
        }
        default: return state;
    }
};
