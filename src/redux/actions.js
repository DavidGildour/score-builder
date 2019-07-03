import { SET_STAVE_FIELD, 
        SET_FIELD,
        SET_CLEF,
        ADD_NOTE_TO_VOICE,
        ADD_NOTE_TO_STAVE,
        DELETE_NOTE_FROM_STAVE,
        DELETE_NOTE_FROM_VOICE,
        ADD_VOICE_TO_STAVE,
        REMOVE_VOICE_FROM_STAVE,
        UPDATE_NOTE_IN_STAVE,
        UPDATE_NOTE_IN_VOICE,
        CHANGE_PITCH} from './actionTypes';

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

export const addNoteToStave = ({ note, staveId, voiceId }) => ({
    type: ADD_NOTE_TO_STAVE,
    payload: {
        note,
        staveId,
        voiceId,
    },
});

export const addNoteToVoice = ({ note, voiceId }) => ({
    type: ADD_NOTE_TO_VOICE,
    payload: {
        note,
        voiceId,
    },
});

export const deleteNoteFromStave = ({ noteId, staveId, voiceId }) => ({
    type: DELETE_NOTE_FROM_STAVE,
    payload: {
        noteId,
        staveId,
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

export const updateNoteInStave = ({ staveId, voiceId, noteId, keys }) => ({
    type: UPDATE_NOTE_IN_STAVE,
    payload: {
        staveId,
        voiceId,
        noteId,
        keys,
    }
})

export const updateNoteInVoice = ({ noteId, voiceId, keys }) => ({
    type: UPDATE_NOTE_IN_VOICE,
    payload: {
        noteId,
        voiceId,
        keys,
    }
})

export const changePitch = ({ keys }) => ({
    type: CHANGE_PITCH,
    payload: { keys },
})

export const addVoiceToStave = ({ staveId }) => ({
    type: ADD_VOICE_TO_STAVE,
    payload: {
        staveId,
    },
});

export const deleteVoiceFromStave = ({ staveId, voiceId }) => ({
    type: REMOVE_VOICE_FROM_STAVE,
    payload: {
        staveId,
        voiceId,
    },
});
