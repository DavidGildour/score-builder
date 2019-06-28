export const getTimeSignature = (store, staveId) => [store.staves[staveId].beatsNum, store.staves[staveId].beatsNum];

export const getLastNoteFromVoice = (store, staveId, voiceId) => store
    .staves[staveId].voices[voiceId].notes.slice(-1)[0];

