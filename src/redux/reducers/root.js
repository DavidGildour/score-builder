/* eslint-disable object-shorthand */
import changeStave from './changeStave';
import { setField, addNoteToMeasure, deleteNoteFromMeasure, updateNoteInMeasure, addVoiceToMeasures } from '../actions';
import { preloadedState } from '../store';


const rootReducer = (state = preloadedState, action) => {
    switch (action.type) {
        case 'LOAD_SCORE': {
            return action.payload || preloadedState;
        }
        case 'SET_STAVE_FIELD': {
            const { id, field, value } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index === parseInt(id, 10)) return changeStave(stave, setField({ field, value }));
                    return stave;
                }),
            };
        }
        case 'ADD_NOTE_TO_STAVE': {
            const { staveId, measureId, voiceId, note } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index.toString() === staveId) {
                        return changeStave(stave,
                                           addNoteToMeasure({ measureId, voiceId, note }));
                    }
                    return stave;
                }),
            };
        }
        case 'DELETE_NOTE_FROM_STAVE': {
            const { staveId, measureId, voiceId, noteId } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index.toString() ===staveId) {
                        return changeStave(stave,
                                           deleteNoteFromMeasure({ measureId, voiceId, noteId }));
                    }
                    return stave;
                }),
            };
        }
        case 'UPDATE_NOTE_IN_STAVE': {
            const { staveId, measureId, voiceId, noteId, update } = action.payload;
            return {
                ...state,
                staves: state.staves.map((stave, index) => {
                    if (index.toString() === staveId) {
                        return changeStave(stave,
                                           updateNoteInMeasure({ measureId, voiceId, noteId, update }));
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
                    if (index.toString() === staveId) return changeStave(stave, addVoiceToMeasures());
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
                            measures: stave.measures.map(measure => ({
                                ...measure,
                                voices: measure.voices.filter(voice => voice.id !== voiceId),
                            })),
                        };
                    }
                    return stave;
                }),
            };
        }
        case 'ADD_MEASURE_TO_STAVE': {
            const { staveId, voicesNum } = action.payload;
            const voices = [];
            for (let i = 0; i < voicesNum; i++) {
                voices.push({
                    id: i.toString(),
                    notes: [],
                })
            }
            return {
                ...state,
                staves: state.staves.map((stave, i) => {
                    if (i.toString() === staveId) {
                        return {
                            ...stave,
                            measures: stave.measures.concat({
                                id: stave.measures.length.toString(),
                                voices: voices,
                            })
                        }
                    } else {
                        return stave;
                    }
                })
            }
        }
        default: return state;
    }
};

export default rootReducer;
