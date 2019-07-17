import changeNote from './changeNote';

import { changePitch } from '../actions';

export default (state = {}, action) => {
    switch (action.type) {
        case 'ADD_NOTE_TO_VOICE': {
            const { voiceId, note } = action.payload;
            return {
                ...state,
                voices: state.voices.map((voice, i) => {
                    if (i.toString() === voiceId) return {
                        ...voice,
                        notes: voice.notes.concat([note]),
                    };
                    return voice;
                })
            }
        }
        case 'DELETE_NOTE_FROM_VOICE': {
            const { voiceId, noteId } = action.payload;
            return {
                ...state,
                voices: state.voices.map((voice, i) => {
                    if (i.toString() === voiceId) return {
                        ...voice,
                        notes: voice.notes.filter((n, i) => i !== noteId),
                    };
                    return voice;
                }),
            }
        }
        case 'UPDATE_NOTE_IN_VOICE': {
            const { voiceId, noteId, keys } = action.payload;
            return {
                ...state,
                voices: state.voices.map((voice) => {
                    if (voice.id === voiceId) return {
                        ...voice,
                        notes: voice.notes.map((note, i) => {
                            if (i.toString() === noteId) return changeNote(note, changePitch({ keys }));
                            return note;
                        })
                    }
                    return voice;
                })
            }
        }
        case 'ADD_VOICE_TO_MEASURE': {
            return {
                ...state,
                voices: state.voices.concat([{
                    id: state.voices.length.toString(),
                    notes: [],
                }])
            }
        }
        default: return state;
    }
}