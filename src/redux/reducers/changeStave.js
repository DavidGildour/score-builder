import changeNote from './changeNote';
import changeMeasure from './changeMeasure';
import { setClef, updateNoteInVoice, addNoteToVoice, deleteNoteFromVoice, addVoiceToMeasure } from '../actions';

export default (state = {}, action) => {
    // console.log('changestave', action);
    switch (action.type) {
        case 'SET_FIELD': {
            const { field, value } = action.payload;
            if (field === 'clef') {
                return {
                    ...state,
                    measures: state.measures.map(measure => ({
                        ...measure,
                        voices: measure.voices.map(voice => ({
                            ...voice,
                            notes: voice.notes.map(note => changeNote(note, setClef({ clef: value }))),
                        })),
                    })),
                    [field]: value,
                };
            }
            return {
                ...state,
                [field]: value,
            };
        }
        case 'ADD_VOICE_TO_MEASURES': {
            return {
                ...state,
                measures: state.measures.map((measure) => changeMeasure(measure, addVoiceToMeasure()))
            }
        }
        case 'ADD_NOTE_TO_MEASURE': {
            const { measureId, voiceId, note } = action.payload;
            return {
                ...state,
                measures: state.measures.map((measure, i) => {
                    if (i.toString() === measureId) return changeMeasure(measure, addNoteToVoice({ note: note, voiceId: voiceId }));
                    return measure;
                    }
                ),
            };
        }
        case 'DELETE_NOTE_FROM_MEASURE': {
            const { measureId, voiceId, noteId } = action.payload;
            return {
                ...state,
                measures: state.measures.map((measure, i) => {
                    if (i.toString() === measureId) return changeMeasure(measure, deleteNoteFromVoice({ noteId: noteId, voiceId: voiceId }));
                    return measure;
                },
            )};
        }
        case 'UPDATE_NOTE_IN_MEASURE': {
            const { measureId, voiceId, noteId, update } = action.payload;
            return {
                ...state,
                measures: state.measures.map((measure) => {
                    if (measure.id === measureId) return changeMeasure(measure, updateNoteInVoice({ voiceId, noteId, update}));
                    return measure;
                }),
            };
        }
        default: return state;
    }
};
