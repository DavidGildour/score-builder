import { SET_STAVE_FIELD, 
        SET_FIELD,
        SET_CLEF,
        ADD_NOTE_TO_VOICE,
        ADD_NOTE_TO_STAVE,
        DELETE_NOTE_FROM_STAVE,
        DELETE_NOTE_FROM_VOICE,
        UPDATE_NOTE_IN_STAVE,
        UPDATE_NOTE_IN_MEASURE,
        UPDATE_NOTE_IN_VOICE,
        ADD_MEASURE_TO_STAVE,
        ADD_NOTE_TO_MEASURE, 
        DELETE_NOTE_FROM_MEASURE,
        ADD_VOICE_TO_MEASURES,
        ADD_VOICE_TO_MEASURE,
        ADD_VOICE_TO_STAVE, 
        REMOVE_VOICE_FROM_STAVE} from './actionTypes';

export const setStaveField = content => ({
    type: SET_STAVE_FIELD,
    payload: { ...content },
});

export const setField = content => ({
    type: SET_FIELD,
    payload: { ...content },
});

export const setClef = clef => ({
    type: SET_CLEF,
    payload: { ...clef },
});

export const addNoteToStave = ({ note, measureId, staveId, voiceId }) => ({
    type: ADD_NOTE_TO_STAVE,
    payload: {
        note,
        staveId,
        measureId,
        voiceId,
    },
});

export const addNoteToMeasure = ({ note, measureId, voiceId }) => ({
    type: ADD_NOTE_TO_MEASURE,
    payload: {
        note,
        measureId,
        voiceId,
    }
})

export const addNoteToVoice = ({ note, voiceId }) => ({
    type: ADD_NOTE_TO_VOICE,
    payload: {
        note,
        voiceId,
    },
});

export const deleteNoteFromStave = ({ noteId, staveId, measureId, voiceId }) => ({
    type: DELETE_NOTE_FROM_STAVE,
    payload: {
        noteId,
        staveId,
        measureId,
        voiceId,
    },
});

export const deleteNoteFromMeasure = ({ noteId, measureId, voiceId }) => ({
    type: DELETE_NOTE_FROM_MEASURE,
    payload: {
        noteId,
        measureId,
        voiceId,
    },
});

export const deleteNoteFromVoice = ({ noteId, voiceId }) => ({
    type: DELETE_NOTE_FROM_VOICE,
    payload: {
        noteId,
        voiceId,
    },
});

export const updateNoteInStave = ({ staveId, measureId, voiceId, noteId, update }) => ({
    type: UPDATE_NOTE_IN_STAVE,
    payload: {
        staveId,
        measureId,
        voiceId,
        noteId,
        update,
    }
})

export const updateNoteInVoice = ({ noteId, voiceId, update }) => ({
    type: UPDATE_NOTE_IN_VOICE,
    payload: {
        noteId,
        voiceId,
        update,
    }
})

export const updateNoteInMeasure = ({ measureId, noteId, voiceId, update }) => ({
    type: UPDATE_NOTE_IN_MEASURE,
    payload: {
        noteId,
        voiceId,
        measureId,
        update,
    }
})

export const addVoiceToMeasures = () => ({
    type: ADD_VOICE_TO_MEASURES,
    payload: {}
});

export const addVoiceToStave = ({ staveId }) => ({
    type: ADD_VOICE_TO_STAVE,
    payload: {
        staveId,
    }
});

export const addVoiceToMeasure = () => ({
    type: ADD_VOICE_TO_MEASURE,
    payload: {}
});

export const deleteVoiceFromStave = ({ staveId, voiceId }) => ({
    type: REMOVE_VOICE_FROM_STAVE,
    payload: {
        staveId,
        voiceId,
    },
});

export const addMeasureToStave = ({ staveId, voicesNum }) => ({
    type: ADD_MEASURE_TO_STAVE,
    payload: {
        staveId,
        voicesNum,
    }
});
