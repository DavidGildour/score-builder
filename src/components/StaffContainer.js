import React from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css/dist/js/materialize.min';

import { setStaveField,
        addNoteToStave,
        deleteNoteFromStave,
        addVoiceToStave,
        deleteVoiceFromStave,
        updateNoteInStave,
        addMeasureToStave,
        removeMeasureFromStave } from '../redux/actions';
import { MAKE_NOT_REST, CHANGE_PITCH, MAKE_REST, CHANGE_DURATION, ADD_TONE } from '../redux/actionTypes';

import Staff from './Staff';
import { ClefOptions, TimeSigOptions, KeyOptions, AddRandomNote, RemoveNote, NoteDuration, Voices, AddRemoveVoice, AddRemoveMeasure } from './ControlFields';
import MelodyGenerator from './MelodyGeneratorOptions';
import MidiPlayer from './MidiPlayer';
import SaveScore from './SaveScore';
import toastMessage from '../utils/toast';
import sortNotes from '../utils/noteSorter';

import { noteToDuration, durationToNote } from './mappings/durationMappings';
import { clefMapping } from './mappings/clefMappings';
import { noteMapping } from './mappings/noteMappings';
import keyMapping from './mappings/keyMappings';

const getRandInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const mapStateToProps = state => ({
    staves: state.staves,
});

const mapDispatchToProps = {
    setStaveField,
    addNoteToStave,
    deleteNoteFromStave,
    addVoiceToStave,
    deleteVoiceFromStave,
    updateNoteInStave,
    addMeasureToStave,
    removeMeasureFromStave
};

class StaffContainer extends React.PureComponent {
    state = {
        restMode: false,
        editMode: false,
        dotted: false,
        id: this.props.id,
        timeOpened: this.props.scoreLoadedTime,
        stave: this.props.staves[this.props.id],
        currentVoice: '0',
        currentMeasure: '0',
        selectedNote: null,
        duration: '8',
        bpm: 80,
    };

    getRidOfRests = (measureId, voice, safetyIndex = NaN) => {
        const notes = voice.notes;
        const revNotes = notes.slice().reverse();
        let duration = 0;
        for (const n of revNotes) {
            if (n.persistent || notes.indexOf(n) === safetyIndex) { // break the loop when hitting persistent note
                break;
            }
            duration += noteToDuration[n.duration.replace('r', '')];
            this.props.deleteNoteFromStave({ noteId: notes.indexOf(n), measureId: measureId, staveId: this.state.id, voiceId: voice.id }); // actually remove the note from store
        }
        return duration;
    }

    populateVoiceWithRests = (measureId, voiceId, lackingDuration) => {
        const lineMapping = clefMapping[this.state.stave.clef];
        const restPlacement = {
            0: lineMapping[3*Math.floor(lineMapping.length/4)],
            1: lineMapping[Math.floor(lineMapping.length/4)],
            2: lineMapping[4*Math.floor(lineMapping.length/4)],
            3: lineMapping[2*Math.floor(lineMapping.length/4)]
        }
        let remainingDuration = lackingDuration;
        while (remainingDuration !== 0) {
            for (const duration of Object.keys(durationToNote).sort((a, b) => b - a)) {
                if (duration <= remainingDuration) {
                    remainingDuration -= duration;
                    const note = {
                        clef: this.state.stave.clef,
                        keys: [restPlacement[voiceId]],
                        duration: `${durationToNote[duration]}r`,
                        modifiers: [(durationToNote[duration].includes('d') ? '.' : '')],
                        persistent: false,
                    };
                    this.props.addNoteToStave({ staveId: this.state.id, measureId: measureId, voiceId: voiceId, note: note });
                    break;
                }
            }
        }
    }

    voiceDurationIsValid = (voice, beatsNum, beatsType) => {
        const expectedDuration = beatsNum * (1 / beatsType);
        let voiceDuration = 0;
        for (const note of voice.notes) {
            voiceDuration += noteToDuration[note.duration.replace('r', '')];
        }
        return expectedDuration - voiceDuration;
    }

    voiceIsNotEmpty = (voiceId) => {
        for (const measure of this.state.stave.measures) {
            for (const note of measure.voices[voiceId].notes) {
                if (!note.duration.includes('r')) return true;
            }
        }
        return false;
    }

    cutMeasures = (voiceId, lackingDuration) => {
        let remainingDuration = lackingDuration;
        for (let j = 0; j < this.state.stave.measures.length; j++) {
            const notes = this.state.stave.measures[j].voices[voiceId].notes.slice();
            while (remainingDuration < 0) {
                this.props.deleteNoteFromStave({ noteId: notes.length - 1, measureId: j.toString(), staveId: this.state.id, voiceId: voiceId });
                remainingDuration += noteToDuration[notes.pop().duration.replace('r', '')];
            }
            if (remainingDuration > 0) this.populateVoiceWithRests(j.toString(), voiceId, remainingDuration);
            remainingDuration = lackingDuration;
        }
        this.setState({
            selectedNote: null,
            editMode: false // quick fix
        })
    }

    timeChangeHandler = (event) => {
        const { name, value } = event.target;
        if (value === '' || value < 1 || value > 32) {
            return;
        }
        let beatsNum = this.state.stave.beatsNum;
        let beatsType = this.state.stave.beatsType;
        if (name === 'beatsNum') beatsNum = value;
        else beatsType = value;
        for (const voice of this.state.stave.measures[0].voices) {
            const lackingDuration = this.voiceDurationIsValid(voice, beatsNum, beatsType);
            const voiceId = voice.id;
            if (lackingDuration > 0) {
                for (let j = 0; j < this.state.stave.measures.length; j++) {
                    this.populateVoiceWithRests(j.toString(), voiceId, lackingDuration);
                }
            } else if (lackingDuration < 0) {
                this.cutMeasures(voiceId, lackingDuration);
            }
        }
        this.props.setStaveField({ id: this.state.id, field: name, value: value });
        this.props.updateChange();
        this.setState({
            [name]: value,
        });
    }

    getLastNoteInAVoice = (voice) => {
        const notes = voice.notes.slice();
        const revNotes = notes.slice().reverse();
        for (const note of revNotes) {
            if (note.persistent) return notes.indexOf(note);
        }
        return -1;
    }

    getLatestAvailableMeasure = () => {
        for (const measure of this.state.stave.measures) {
            for (const note of measure.voices[this.state.currentVoice].notes) {
                if (!note.persistent) return measure;
            }
        }
        return null;
    }

    addNote = (durationLeft, note) => {
        let availableDuration = durationLeft;
        const declaredDuration = this.state.duration + (this.state.dotted ? 'd' : '');
        if (availableDuration >= noteToDuration[declaredDuration]) {
            const modifiers = [note.match(/[A-G]([#b]*)\//)[1]];
            if (declaredDuration.includes('d')) modifiers[0] += '.';
            const newNote = {
                clef: this.state.stave.clef,
                keys: [note],
                duration: this.state.restMode ? declaredDuration + 'r' : declaredDuration,
                modifiers: modifiers,
                persistent: true,
            }
            availableDuration -= noteToDuration[newNote.duration.replace('r', '')];
            this.props.addNoteToStave({ note: newNote, staveId: this.state.id, measureId: this.state.currentMeasure, voiceId: this.state.currentVoice });
            const newNoteId = this.getLastNoteInAVoice(this.state.stave.measures[this.state.currentMeasure].voices[this.state.currentVoice]) + 1;
            const maxIndex = this.state.stave.measures[this.state.currentMeasure].voices[this.state.currentVoice].notes.length - 1;
            const actualIndex = Math.min(newNoteId, maxIndex);
            this.setState((state) => ({
                selectedNote: {
                    noteId: actualIndex.toString(),
                    noteHead: 0,
                    voiceId: state.currentVoice,
                    measureId: state.currentMeasure,
                    duration: newNote.duration,
                },
            }))
            this.props.updateChange();
        }
        return availableDuration;
    }

    handleRandomNote = () => {
        const measure = this.getLatestAvailableMeasure();
        if (!measure) return;
        const voice = measure.voices[this.state.currentVoice];
        const durationLeft = this.getRidOfRests(measure.id, voice);
        const durationLeftAfterAdding = this.addRandomNote(durationLeft).duration;
        const newNoteId = this.getLastNoteInAVoice(measure.voices[this.state.currentVoice]) + 1;
        const maxIndex = measure.voices[this.state.currentVoice].notes.length - 1;
        const actualIndex = Math.min(newNoteId, maxIndex);
        this.populateVoiceWithRests(measure.id, voice.id, durationLeftAfterAdding);
        this.setState((_state) => ({
            selectedNote: {
                noteId: actualIndex.toString(),
                voiceId: this.state.currentVoice,
                measureId: measure.id,
                duration: durationToNote[durationLeft - durationLeftAfterAdding],
            },
        }));
        this.props.updateChange();
    }

    getAvailableNotes = (interval, declaredNote, diatonic) => {
        const [ chromaSteps, scaleSteps ] = interval.split(' ').map( e => parseInt(e, 10));
        const mapping = keyMapping[this.state.stave.keySig];
        const diatonicNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const chromatic = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
        const filteredChroma = chromatic.filter(v => !v.includes((Object.values(mapping)[0] === '#') ? 'b' : '#'));
        const lineMapping = clefMapping[this.state.stave.clef];
        // defining the boundaries in which the note can be placed -
        // an octave up and down from the middle line of the clef
        let maxNote = lineMapping[Math.floor(lineMapping.length/2)].replace(/\d/, match => +match + 1);
        let minNote = lineMapping[Math.floor(lineMapping.length/2)].replace(/\d/, match => +match - 1);
        let centerNote = declaredNote;
        if (declaredNote === '') centerNote = lineMapping[Math.floor(lineMapping.length/2)];
        const availableNotes = [];
        let upOctave = centerNote.match(/\d/)[0];
        let downOctave = centerNote.match(/\d/)[0];
        if (diatonic) {
            // diatonic melodies are a little bit trickier to limit (octave-wise) due to key signatures
            // and their impact on stave lines
            const boundarySymbol = maxNote[0]; // we dont have to worry about the accidental
            if (mapping[boundarySymbol]) {
                maxNote = maxNote.replace(boundarySymbol, boundarySymbol + mapping[boundarySymbol]);
                minNote = minNote.replace(boundarySymbol, boundarySymbol + mapping[boundarySymbol]);
            }
            const notes = diatonicNotes;
            const index = notes.indexOf(centerNote[0]);
            for (let i = 0; i < scaleSteps; i++) {
                const up = notes[(index + i) % notes.length];
                const down = notes[(2*notes.length + (index - i)) % notes.length];
                availableNotes.push(`${up}${mapping[up] || ''}/${upOctave}`);
                availableNotes.unshift(`${down}${mapping[down] || ''}/${downOctave}`);
                if (up[0] === 'B') upOctave++;
                if (down[0] === 'C') downOctave--;
            }
            const firstIndex = filteredChroma.indexOf(availableNotes[0].match(/^(.+)\//)[1]);
            const lastIndex = filteredChroma.indexOf(availableNotes[availableNotes.length-1].match(/^(.+)\//)[1]);
            const centerIndex = filteredChroma.indexOf(centerNote.match(/^(.+)\//)[1]);
            const len = filteredChroma.length;
            if (((len + centerIndex - firstIndex) % len) > chromaSteps) availableNotes.shift();
            if (((len + lastIndex - centerIndex) % len) > chromaSteps) availableNotes.pop();
        } else {
            const notes = filteredChroma;
            const index = notes.indexOf(centerNote.match(/^(.+)\//)[1]);
            for (let i = 0; i <= chromaSteps; i++) {
                const up = notes[(index + i) % notes.length];
                const down = notes[(2*notes.length + (index - i)) % notes.length];
                availableNotes.push(`${up}/${upOctave}`);
                availableNotes.unshift(`${down}/${downOctave}`);
                if (up === 'B') upOctave++;
                if (down === 'C') downOctave--;
            }
        }
        const minIndex = Math.max(availableNotes.indexOf(minNote), 0);
        const maxIndex = availableNotes.indexOf(maxNote) === -1 ? availableNotes.length - 1 : availableNotes.indexOf(maxNote);
        return availableNotes.filter((note, i) => note !== centerNote && i <= maxIndex && i >= minIndex);
    }

    addRandomNote = (
        availableDuration,
        durToNote = durationToNote,
        noteToDur = noteToDuration,
        voice = this.state.currentVoice,
        measure = this.getLatestAvailableMeasure(),
        diatonic = false,
        lastNote = [''],
        allowRests = false,
        interval = '12 8',
        ) => {
        let duration = availableDuration;
        // console.log(duration, durToNote, noteToDur, voice);
        if (duration !== 0) {
        // CHOOSING A DURATION
            const notesReversed = Object.keys(durToNote).sort((a, b) => a - b);
            const durationsReversed = Object.values(durToNote).sort((a, b) => noteToDuration[a] - noteToDuration[b]);
            let upperIndex;
            // determine the maximum valid duration of the note to ba added
            for (const [i, val] of Object.entries(notesReversed)) {
                if (val > duration) break; // value
                upperIndex = i; // index
            }
            let noteDuration = upperIndex ? durationsReversed[getRandInt(0, upperIndex)] : durationToNote[duration];
            if (allowRests && getRandInt(0, 6) === 0) noteDuration += 'r';
        // CHOOSING PITCH
            const centerNote = lastNote[0];
            const availableNotes = this.getAvailableNotes(interval, centerNote, diatonic);
            let accidental = '';
            const symbol = availableNotes[getRandInt(0, availableNotes.length)];
            if (['b', '#'].includes(symbol[1])) {
                accidental = symbol[1];
            }
            // ensuring proper naturals handling
            const mapping = keyMapping[this.state.stave.keySig];
            if (!diatonic && Object.keys(mapping).includes(symbol[0]) && accidental === '') {
                accidental = 'n';
            }
            const modifiers = noteDuration.includes('d') ? accidental + '.' : accidental;
            const newNote = {
                clef: this.state.stave.clef,
                keys: [symbol],
                duration: noteDuration,
                modifiers: [modifiers],
                persistent: true,
            };
            const notePitches = newNote.keys;
            duration -= noteToDur[noteDuration.replace('r', '')] || duration;
            this.props.addNoteToStave({ note: newNote, staveId: this.state.id, measureId: measure.id, voiceId: voice });
            return { duration: duration, notePitches: notePitches }
        };
        return { duration: duration, notePitches: [''] };
    }

    removeLastNote = (_e) => {
        let lastNonEmptyMeasureId = this.state.stave.measures.length - 1;
        let note = null;
        let notes;
        for (const measure of this.state.stave.measures.slice().reverse()) {
            notes = measure.voices[this.state.currentVoice].notes;
            for (const n of notes.slice().reverse()) {
                if (n.persistent) {
                    note = n;
                    break;
                }
            }
            if (note) break;
            lastNonEmptyMeasureId -= 1;
        }
        if (!note) return;
        this.props.deleteNoteFromStave({ noteId: notes.indexOf(note), measureId: lastNonEmptyMeasureId.toString(), staveId: this.state.id, voiceId: this.state.currentVoice });
        const duration = noteToDuration[note.duration.replace('r', '')];
        this.populateVoiceWithRests(lastNonEmptyMeasureId.toString(), this.state.currentVoice, duration);
        this.props.updateChange();
    }

    getNote(note) {
        return this.state.stave.measures[note.measureId].voices[note.voiceId].notes[note.noteId]
    }

    handleDelete = (note) => {
        const consideredNote = this.getNote(note);
        if (consideredNote.keys.length > 1) {
            this.props.updateNoteInStave({
                ...note,
                staveId: this.state.id,
                update: {
                    type: 'REMOVE_TONE',
                    payload: { noteHead: note.noteHead }
                }
            })
            this.setState(state => ({ selectedNote: {
                ...state.selectedNote,
                noteHead: Math.min(consideredNote.keys.length - 2, state.selectedNote.noteHead),
                }
            }))
        } else {
            this.props.updateNoteInStave({
                staveId: this.state.id,
                measureId: note.measureId,
                voiceId: note.voiceId,
                noteId: note.noteId,
                update: {
                    type: MAKE_REST,
                    payload: {},
                }
            })
            this.setState(state => ({ selectedNote: {
                ...state.selectedNote,
                duration: state.selectedNote.duration + 'r',
                }
            }))
        }
    }

    transposeNote = (transposition) => {
        const selected = this.state.selectedNote;
        if (!selected) return;
        const note = this.getNote(selected);
        const keys = note.keys.slice();
        const key = keys[selected.noteHead];
        if (transposition[0] === 'o') {
            keys[selected.noteHead] = key.replace(/\d/, match => + match + (transposition[1] === 'u' ? 1 : -1));
        } else if (transposition[0] === 's') {
            const [ , oldKey, oldOctave] = key.match(/(.+)\/(\d)/);
            const oldSymbol = oldKey[0];
            const oldAcc = oldKey.match(/[#b]+/);
            const oldIndex = noteMapping.indexOf(oldSymbol.toUpperCase());
            let newSymbol;
            let newAcc;
            let newOctave;
            if (transposition[1] === 'u') {
                const isDiatonic = ['B','E'].includes(oldSymbol.toUpperCase());
                if (oldAcc) {
                    switch (oldAcc[0]) {
                        case '##':
                            newSymbol = noteMapping[(oldIndex + (isDiatonic ? 2 : 1)) % 7];
                            newAcc = isDiatonic ? '' : '#';
                            break;
                        case '#':
                            newSymbol = noteMapping[(oldIndex + 1) % 7];
                            newAcc = isDiatonic ? '#' : '';
                            break;
                        case 'bb':
                            newSymbol = oldSymbol;
                            newAcc = 'b';
                            break;
                        case 'b':
                            newSymbol = oldSymbol;
                            newAcc = '';
                            break;
                        default:
                            newSymbol = noteMapping[(oldIndex + 1) % 7];
                            newAcc = '#';
                    }
                } else {
                    if (isDiatonic && keyMapping[this.state.stave.keySig][oldSymbol] !== '#') {
                        newSymbol = noteMapping[(oldIndex + 1) % 7];
                        newAcc = '';
                    } else {
                        newSymbol = oldSymbol;
                        newAcc = '#';
                    }
                }
                if (oldIndex === 6 && !['Bb', 'Bbb'].includes(oldKey)) newOctave = +oldOctave + 1;
                if (keyMapping[this.state.stave.keySig].B === '#' && oldKey === 'B') newOctave -= 1;
            } else {
                const isDiatonic = ['C','F'].includes(oldSymbol.toUpperCase());
                if (oldAcc) {
                    switch (oldAcc[0]) {
                        case '##':
                            newSymbol = oldSymbol;
                            newAcc = '#';
                            break;
                        case '#':
                            newSymbol = oldSymbol;
                            newAcc = '';
                            break;
                        case 'bb':
                            let newIndex;
                            if (oldIndex === 0) {
                                newIndex = isDiatonic ? 5 : 6;
                            }  else if (oldIndex === 1) {
                                newIndex = isDiatonic ? 6 : 0;
                            } else newIndex = oldIndex - (isDiatonic ? 2 : 1);
                            newSymbol = noteMapping[newIndex];
                            newAcc = isDiatonic ? '' : 'b';
                            break;
                        case 'b':
                            newSymbol = noteMapping[oldIndex === 0 ? 6 : oldIndex - 1];
                            newAcc = isDiatonic ? 'b' : '';
                            break;
                        default:
                            newSymbol = noteMapping[oldIndex === 0 ? 6 : oldIndex - 1];
                            newAcc = 'b';
                    }
                } else {
                    if (isDiatonic && keyMapping[this.state.stave.keySig][oldSymbol] !== 'b') {
                        newSymbol = noteMapping[oldIndex === 0 ? 6 : oldIndex - 1];
                        newAcc = '';
                    } else {
                        newSymbol = oldSymbol;
                        newAcc = 'b';
                    }
                }
                if (oldIndex === 0 && !['C#', 'C##'].includes(oldKey)) newOctave = +oldOctave - 1;
                if (keyMapping[this.state.stave.keySig].C === 'b' && oldKey === 'C') newOctave += 1;
            }
            keys[selected.noteHead] = `${newSymbol + newAcc}/${newOctave || oldOctave}`;
        }
        const newKeys = sortNotes(keys);
        this.props.updateChange();
        this.props.updateNoteInStave({
            staveId: this.state.id,
            measureId: selected.measureId,
            voiceId: selected.voiceId,
            noteId: selected.noteId,
            update: {
                type: CHANGE_PITCH,
                payload: {
                    keys: newKeys || note.keys,
                }
            }
        });
    }

    addVoice = () => {
        if (this.state.stave.measures[0].voices.length === 4) {
            toastMessage(this.props.lang.options.errors.maxVoices);
            return;
        }
        const voiceId = this.state.stave.measures[0].voices.length.toString();
        this.props.addVoiceToStave({ staveId: this.state.id });
        for (let j = 0; j < this.state.stave.measures.length; j++) {
            this.populateVoiceWithRests(j.toString(), voiceId, this.state.stave.beatsNum * (1 / this.state.stave.beatsType));
        }
        this.props.updateChange();
    }

    removeVoice = () => {
        if (this.state.stave.measures[0].voices.length === 1) {
            toastMessage(this.props.lang.options.errors.minVoices);
            return;
        }

        const voiceId = (this.state.stave.measures[0].voices.length-1).toString();
        if (this.voiceIsNotEmpty(voiceId)) {
            toastMessage(this.props.lang.options.errors.voiceNotEmpty);
            return;
        }
        this.props.updateChange();
        this.props.deleteVoiceFromStave({ staveId: this.state.id, voiceId: voiceId });
        this.setState(state => ({
            currentVoice: state.currentVoice === voiceId ? (+voiceId-1).toString() : state.currentVoice,
            selectedNote: !state.selectedNote                         // if there was no selected note before removing the voice - it remains null
                          ? null                                      // however, if there was, we need to
                          : ((state.selectedNote.voiceId === voiceId) // check if maybe it was a part of the removed voice
                            ? null                                    // if so - we 'unselect' the note
                            : state.selectedNote),                    // if it was a part of a different voice though - we can keep it
        }));
    }

    clearVoices = (_e) => {
        const voiceNum = this.state.stave.measures[0].voices.length;
        for (const voice of this.state.stave.measures[0].voices) {
            this.props.deleteVoiceFromStave({ staveId: this.state.id, voiceId: voice.id});
        }
        for (let i = 0; i < voiceNum; i++) {
            this.props.addVoiceToStave({ staveId: this.state.id });
            for (let j = 0; j < this.state.stave.measures.length; j++) {
                this.populateVoiceWithRests(j.toString(), i.toString(), this.state.stave.beatsNum * (1 / this.state.stave.beatsType));
            }
        }
        this.props.updateChange();
        this.setState({
            selectedNote: null,
            editMode: false,
        })
    }

    generateMelody = (options) => {
        console.log(options);
        for (const measure of this.state.stave.measures) {
            for (const voice of measure.voices) {
                for (const note of voice.notes) {
                    if (note.persistent) {
                        toastMessage(this.props.lang.options.errors.voicesNotEmpty);
                        return;
                    }
                }
            }
        }
        const { shortNote, longNote, diatonic, allowRests, interval } = options;
        if (noteToDuration[longNote] < noteToDuration[shortNote]) {
            toastMessage(this.props.lang.options.errors.shortGreaterThanLong);
            return
        }
        let noteToDur = {};
        let durToNote = {};
        let assign = false;
        Object.entries(durationToNote).sort().forEach(([k, v]) => {
            if (v === shortNote) assign = true;
            if (assign) {
                noteToDur[v] = k;
                durToNote[k] = v;
            }
            if (v === longNote) assign = false;
        })
        // console.log(noteToDur, durToNote);
        for (const measure of this.state.stave.measures) {
            for (const voice of measure.voices) {
                let durationLeft = this.getRidOfRests(measure.id, voice);
                let lastNote = [''];
                while (durationLeft > 0) {
                    const noteAdded = this.addRandomNote(durationLeft, durToNote, noteToDur, voice.id, measure, diatonic, lastNote, allowRests, interval);
                    durationLeft = noteAdded.duration;
                    lastNote = noteAdded.notePitches;
                    }
                // does not have to populate with rests - the melody will always fill the measure
            }
        }
        this.props.updateChange();
    }

    addMeasure = () => {
        this.props.addMeasureToStave({ staveId: this.state.id, voicesNum: this.state.stave.measures[0].voices.length });
        for (let i = 0; i < this.state.stave.measures[0].voices.length; i++) {
            this.populateVoiceWithRests(this.state.stave.measures.length.toString(), i.toString(), this.state.stave.beatsNum * (1 / this.state.stave.beatsType))
        }
        this.props.updateChange();
    }

    removeMeasure = () => {
        if (this.state.stave.measures.length === 1) {
            toastMessage("At least one measure required.");
            return;
        }
        this.props.removeMeasureFromStave({ staveId: this.state.id })
        this.props.updateChange();
    }

    getNoteHeads = (noteElement) => Array.from(noteElement.getElementsByClassName('vf-notehead')).map(e => e.getBoundingClientRect());

    handleClick = (e) => {
        e.preventDefault();
        if (!this.state.currentMeasure) return;
        const curY = e.pageY;
        const curX = e.pageX;
        const notePositions = this.getNotePositions(this.state.currentMeasure)[this.state.currentVoice];
        let [noteSegment, noteId] = [null, null];
        let consideredNote;
        for (const [nId, n] of notePositions.entries()) {
            if (curX >= (n.position.left   + window.scrollX) &&
                curX <= (n.position.right  + window.scrollX)) {
                [noteSegment, noteId] = [n, nId];
                consideredNote = this.getNote({
                    ...this.state.selectedNote,
                    noteId: nId
                });
                break;
            }
        }

        const note = this.getNoteFromMousePos(curY);
        if (noteSegment && consideredNote.persistent && !consideredNote.duration.includes('r')) {
            const noteHeads = this.getNoteHeads(noteSegment.element);
            for (const [i, noteHead] of noteHeads.entries()) {
                if (curY >= (noteHead.top + window.scrollY) && curY <= (noteHead.bottom + window.scrollY)) {
                    this.setState({
                        selectedNote: {
                            voiceId: this.state.currentVoice,
                            noteId: noteId.toString(),
                            noteHead: i,
                            measureId: this.state.currentMeasure,
                            duration: this.state.stave.measures[this.state.currentMeasure].voices[this.state.currentVoice].notes[noteId].duration
                        }
                    });
                    return;
                }
            }
            this.props.updateNoteInStave({
                staveId: this.state.id,
                measureId: this.state.currentMeasure,
                voiceId: this.state.currentVoice,
                noteId: noteId.toString(),
                update: {
                    type: ADD_TONE,
                    payload: {
                        pitch: note
                    }
                }
            });
            const newNoteHead = sortNotes(consideredNote.keys.concat([note])).indexOf(note);
            this.setState((state) => ({
                selectedNote: {
                    ...state.selectedNote,
                    noteId: noteId.toString(),
                    noteHead: newNoteHead,
                }
            }));
        } else if (!this.state.editMode) {
            if (consideredNote && consideredNote.persistent) {
                this.props.updateNoteInStave({
                    staveId: this.state.id,
                    measureId: this.state.currentMeasure,
                    voiceId: this.state.currentVoice,
                    noteId: noteId.toString(),
                    update: {
                        type: MAKE_NOT_REST,
                        payload: {}
                    }
                });
                this.props.updateNoteInStave({
                    staveId: this.state.id,
                    measureId: this.state.currentMeasure,
                    voiceId: this.state.currentVoice,
                    noteId: noteId.toString(),
                    update: {
                        type: CHANGE_PITCH,
                        payload: {
                            keys: [note]
                        }
                    }
                });
            } else {
                const voice = this.state.stave.measures[this.state.currentMeasure].voices[this.state.currentVoice];
                let durationLeft = this.getRidOfRests(this.state.currentMeasure, voice);
                durationLeft = this.addNote(durationLeft, note);
                this.populateVoiceWithRests(this.state.currentMeasure, voice.id, durationLeft);
            }
        };
    }

    getNoteFromMousePos = (y) => {
        const lines = this.state.lines;
        const curYRelativeToClef = y % 200;

        let note;
        if      (curYRelativeToClef <=lines[0].relTop)                                             note = clefMapping[this.state.stave.clef][0];
        else if (curYRelativeToClef > lines[0].relTop    && curYRelativeToClef <= lines[0].relBot) note = clefMapping[this.state.stave.clef][1];
        else if (curYRelativeToClef > lines[0].relBot    && curYRelativeToClef <= lines[1].relTop) note = clefMapping[this.state.stave.clef][2];
        else if (curYRelativeToClef > lines[1].relTop    && curYRelativeToClef <= lines[1].relBot) note = clefMapping[this.state.stave.clef][3];
        else if (curYRelativeToClef > lines[1].relBot    && curYRelativeToClef <= lines[2].relTop) note = clefMapping[this.state.stave.clef][4];
        else if (curYRelativeToClef > lines[2].relTop    && curYRelativeToClef <= lines[2].relBot) note = clefMapping[this.state.stave.clef][5];
        else if (curYRelativeToClef > lines[2].relBot    && curYRelativeToClef <= lines[3].relTop) note = clefMapping[this.state.stave.clef][6];
        else if (curYRelativeToClef > lines[3].relTop    && curYRelativeToClef <= lines[3].relBot) note = clefMapping[this.state.stave.clef][7];
        else if (curYRelativeToClef > lines[3].relBot    && curYRelativeToClef <= lines[4].relTop) note = clefMapping[this.state.stave.clef][8];
        else if (curYRelativeToClef > lines[4].relTop    && curYRelativeToClef <= lines[4].relBot) note = clefMapping[this.state.stave.clef][9];
        else                                                                                       note = clefMapping[this.state.stave.clef][10];

        const symbol = note.split('/')[0];
        const symbolNeedsAccidental = keyMapping[this.state.stave.keySig][symbol];
        if (symbolNeedsAccidental) {
            return note.replace(/[A-G]/, symbol + symbolNeedsAccidental);
        }
        return note;
    }

    handleMouseMove = (e) => {
        const lines = this.state.lines;
        const curY = e.pageY;
        const curX = e.pageX;
        const measuresNum = this.state.measureBarLines.length;
        let currentMeasure;
        for (let i = 0; i < measuresNum; i += 2) {
            // y offset of the measures in calculated based on the top-most and bottom-most lines
            // on the stave, due to some bug with Staff's renderer
            const measureYOffSet = 200 * Math.floor((i / 2) / Staff.maxMeasuresInRow);
            if (curX >  this.state.measureBarLines[i].x
             && curX <= this.state.measureBarLines[i+1].x
             && curY >= (lines[0].top + measureYOffSet - 50)
             && curY <= (lines[4].bottom + measureYOffSet + 50)) currentMeasure = (i / 2).toString();
        }
        this.setState({
            currentMeasure: currentMeasure,
        })
    }

    setNextNote = (selected) => {
        let nextMeasureId;
        let nextNoteId;
        if (this.state.stave.measures[selected.measureId].voices[selected.voiceId].notes.length === (+selected.noteId + 1)) {
            if (this.state.stave.measures.length === (+selected.measureId + 1)) {
                nextMeasureId = selected.measureId;
                nextNoteId = selected.noteId;
            } else {
                nextMeasureId = (+selected.measureId + 1).toString();
                nextNoteId = '0';
            }
        } else {
            nextMeasureId = selected.measureId;
            nextNoteId = (+selected.noteId + 1).toString();
        }
        this.setState({
            selectedNote: {
                measureId: nextMeasureId,
                voiceId: selected.voiceId,
                noteId: nextNoteId,
                noteHead: 0,
                duration: this.state.stave.measures[nextMeasureId].voices[selected.voiceId].notes[nextNoteId].duration,
            }
        })
    }

    setPreviousNote = (selected) => {
        let nextMeasureId;
        let nextNoteId;
        // check if there are any notes left in measure
        if ((+selected.noteId - 1) < 0) {
            // if not, check if there are any measures left in stave
            if ((+selected.measureId - 1) < 0) {
                // if not, nothing changes
                nextMeasureId = selected.measureId;
                nextNoteId = selected.noteId;
            } else {
                // if there are, switch to the previous measure's last note
                nextMeasureId = (+selected.measureId - 1).toString();
                nextNoteId = (this.state.stave.measures[+selected.measureId - 1].voices[selected.voiceId].notes.length - 1).toString();
            }
        } else {
            // if there are, set selected note to the previous
            nextMeasureId = selected.measureId;
            nextNoteId = (+selected.noteId - 1).toString();
        }
        this.setState({
            selectedNote: {
                measureId: nextMeasureId,
                voiceId: selected.voiceId,
                noteId: nextNoteId,
                noteHead: 0,
                duration: this.state.stave.measures[nextMeasureId].voices[selected.voiceId].notes[nextNoteId].duration,
            }
        })
    }

    handleKeyPress = (e) => {
        e.preventDefault();
        const { key, shiftKey } = e;
        if (key === 'ArrowUp') {
            this.transposeNote('su');
        } else if (key === 'ArrowDown') {
            this.transposeNote('sd');
        } else if (key === 'PageUp') {
            this.transposeNote('ou');
        } else if (key === 'PageDown') {
            this.transposeNote('od');
        } else if (key === 'ArrowRight') {
            if (this.state.selectedNote) this.setNextNote(this.state.selectedNote);
        } else if (key === 'ArrowLeft') {
            if (this.state.selectedNote) this.setPreviousNote(this.state.selectedNote);
        } else if (key === 'Tab') {
            if (!this.state.currentMeasure) return;
            this.setState(state => {
                const nextVoice = shiftKey
                    ? (state.currentVoice === '0'
                        ? state.stave.measures[0].voices.length - 1
                        : +state.currentVoice - 1)
                    : ((+state.currentVoice + 1) % state.stave.measures[0].voices.length);
                return {
                    currentVoice: nextVoice.toString(),
                    selectedNote: {
                        voiceId: nextVoice.toString(),
                        noteId: '0',
                        measureId: state.currentMeasure,
                        duration: state.stave.measures[state.currentMeasure].voices[nextVoice].notes[0].duration,
                    }
            }})
        } else if (key === 'Delete') {
            if (this.state.selectedNote && !this.state.selectedNote.duration.includes('r')) {
                this.props.updateChange();
                this.handleDelete(this.state.selectedNote);
            }
        } else if (key === 'Escape') {
            this.setState({ selectedNote: null, editMode: false });
        } else if (key === ' ') {
            this.innerStateChange({ target: { name: 'editMode', type: 'checkbox'}});
        }
    }

    selectedNoteChange = (event) => {
        const { name, checked } = event.target;
        const selected = this.state.selectedNote;
        const duration = selected.duration;
        switch (name) {
            case 'editMode' : {
                this.setState({ editMode: false });
                return;
            }
            case 'restMode': {
                this.props.updateNoteInStave({
                    staveId: this.state.id,
                    measureId: selected.measureId,
                    voiceId: selected.voiceId,
                    noteId: selected.noteId,
                    update: {
                        type: !checked ? MAKE_NOT_REST : MAKE_REST,
                        payload: {},
                    }
                })
                this.props.updateChange();
                this.setState(state => ({
                    selectedNote: {
                        ...state.selectedNote,
                        duration: !checked ? duration.replace('r', '') : duration + 'r',
                    }
                }));
                return;
            }
            case 'dotted': {
                const newDuration = checked ? duration.replace(/([^r]*)(r?)/, '$1d$2') : duration.replace('d', '');
                let durationLeft = this.getRidOfRests(
                    selected.measureId,
                    this.state.stave.measures[selected.measureId].voices[selected.voiceId],
                    parseInt(selected.noteId)
                );
                const dotDuration = (noteToDuration[duration.replace('d', '').replace('r', '')] / 2) * (checked ? -1 : 1);
                if (durationLeft + dotDuration < 0) {
                    toastMessage("Not enough duration left in the measure.");
                    this.populateVoiceWithRests(selected.measureId, selected.voiceId, durationLeft);
                    return;
                }
                this.props.updateNoteInStave({
                    staveId: this.state.id,
                    measureId: selected.measureId,
                    voiceId: selected.voiceId,
                    noteId: selected.noteId,
                    update: {
                        type: CHANGE_DURATION,
                        payload: { duration: newDuration },
                    }
                })
                this.populateVoiceWithRests(selected.measureId, selected.voiceId, durationLeft + dotDuration);
                this.props.updateChange();
                this.setState(state => ({
                    selectedNote: {
                        ...state.selectedNote,
                        duration: newDuration,
                    }
                }))
                return;
            }
            case 'duration': {
                const { value } = event.target;
                const newDuration = duration.replace(/[^dr]*/, value);
                const newDurationValue = noteToDuration[newDuration.replace('r', '')];
                const durationValue = noteToDuration[duration.replace('r', '')];
                let durationLeft = this.getRidOfRests(
                    selected.measureId,
                    this.state.stave.measures[selected.measureId].voices[selected.voiceId],
                    parseInt(selected.noteId)
                );
                if (newDurationValue - durationValue > durationLeft) {
                    toastMessage("Not enough duration left in the measure.");
                    this.populateVoiceWithRests(selected.measureId, selected.voiceId, durationLeft);
                    return;
                }
                this.props.updateNoteInStave({
                    staveId: this.state.id,
                    measureId: selected.measureId,
                    voiceId: selected.voiceId,
                    noteId: selected.noteId,
                    update: {
                        type: CHANGE_DURATION,
                        payload: { duration: newDuration },
                    }
                });
                this.populateVoiceWithRests(selected.measureId, selected.voiceId, durationLeft - (newDurationValue - durationValue));
                this.props.updateChange();
                this.setState(state => ({
                    selectedNote: {
                        ...state.selectedNote,
                        duration: newDuration,
                    }
                }))
                return;
            }
        default: return;
        }
    }

    innerStateChange = (event) => {
        const { name, value, type } = event.target;
        if (type === 'checkbox') {
            if (name === 'editMode' && !this.state.selectedNote) {
                toastMessage(this.props.lang.options.errors.noSelectedNote);
                return;
            }
            this.setState((state) => ({
                [name]: !state[name],
            }));
        } else if (name === 'currentVoice') {
            this.setState((state) => ({
                ...state,
                selectedNote: {
                    voiceId: value,
                    noteId: '0',
                    noteHead: 0,
                    measureId: '0',
                    duration: this.state.stave.measures[0].voices[value].notes[0].duration,
                },
                currentVoice: value,
            }));
        } else {
            this.setState({
                [name]: value,
            });
        }
    }

    storeChange = (event) => {
        this.innerStateChange(event);
        this.props.updateChange();
        const { name, value } = event.target;
        this.props.setStaveField({ id: this.state.id, field: name, value: value });
    }

    getBarLines = (svg, lines = this.state.lines) => {
        this.setState({
            measureBarLines: [...svg.getElementsByTagName('rect')]
                .map((e, i) => {
                    const pos = e.getBoundingClientRect();
                    const measureYOffSet = 200 * Math.floor((i / 2) / Staff.maxMeasuresInRow);
                    return {
                        x: pos.x + window.scrollX,
                        y: pos.y + window.scrollY,
                        height: Math.round(pos.height),
                        top: lines[0].top + measureYOffSet,
                        bottom: lines[4].bottom + measureYOffSet,
                    }
                })
                .filter(e => e.height === 41)
                .sort((a, b) => (a.x) - (b.x))
                .sort((a, b) => (a.y) - (b.y)),
        });
    }

    getNotePositions = (measureId) => {
        const staveSVG = document.querySelector(`#stave${this.state.id} svg`);
        const voices = this.state.stave.measures[measureId].voices;
        const currentMeasureBarLines = { left: this.state.measureBarLines[2*measureId], right: this.state.measureBarLines[2*measureId + 1] };
        const notes = [...staveSVG.getElementsByClassName('vf-stavenote')]
            .map(e => ({
                position: e.getBoundingClientRect(),
                element: e
            }))
            // taking into account only notes in currently viewed measure
            .filter(e => (
                e.position.left >= currentMeasureBarLines.left.x &&
                e.position.right <= currentMeasureBarLines.right.x &&
                e.position.top + window.scrollY >= currentMeasureBarLines.left.top - 50 &&
                e.position.bottom + window.scrollY <= currentMeasureBarLines.left.bottom + 50
            ));
        let notePositions = [[]];
        let voiceId = 0;
        let noteId = 0;
        for (const n of notes) {
            let voice = voices[voiceId];
            let len = voice.notes.length;
            if (noteId >= len) {
                noteId = 0;
                voice = voices[++voiceId];
                notePositions.push([]);
                len = voice.notes.length;
            }
            notePositions[voiceId].push(n);
            noteId++;
        }
        return notePositions;
    }

    getLastNote = () => {
        let lastNote = null;
        for (const note of this.state.stave.measures[0].voices[this.state.currentVoice].notes) {
            if (!note.persistent) break;
            lastNote = note;
        }
        return lastNote;
    }

    static getDerivedStateFromProps = (props, state) => {
        let selectedNote;
        let editMode = state.editMode;
        if (props.scoreLoadedTime !== state.timeOpened) {
            selectedNote = null;
            editMode = false;
        }
        else selectedNote = state.selectedNote;
        return {
            stave: props.staves[state.id],
            selectedNote: selectedNote,
            timeOpened: props.scoreLoadedTime,
            editMode: editMode,
        }
    }

    componentDidMount(){
        // materialize-css javascript initialization
        M.FormSelect.init(document.querySelectorAll('select'));
        M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        const staveSVG = document.getElementById(`stave${this.state.id}`).childNodes[0];
        const lines = [];
        for (const [i, line] of staveSVG.childNodes.entries()) {
            if (i >= 5) break;
            const linePos = line.getBoundingClientRect();
            lines.push({
                top: linePos.top + window.scrollY,
                relTop: (linePos.top + window.scrollY) % 200,
                bottom: linePos.bottom + window.scrollY,
                relBot: (linePos.bottom + window.scrollY) % 200,
            });
        }
        this.getBarLines(staveSVG, lines);
        this.setState({
            lines: lines,
        });
    }

    render() {
        let currentNote;
        const selectedNote = this.state.selectedNote;
        selectedNote ? currentNote = this.getNote(selectedNote) : currentNote = null;
        return (
            <div onKeyDown={this.handleKeyPress}>
                <div style={{ position: 'absolute', top: '50%', left: '10px' }}>{currentNote ? currentNote.keys.join(' ') : null}</div>
                <div>
                    <NoteDuration
                        editMode={this.state.editMode}
                        lang={this.props.lang}
                        onChange={this.state.editMode ? this.selectedNoteChange : this.innerStateChange}
                        duration={this.state.editMode ? selectedNote.duration.replace('r', '').replace('d', '') : this.state.duration}
                        restMode={this.state.editMode ? selectedNote.duration.includes('r') : this.state.restMode}
                        dotted={this.state.editMode ? selectedNote.duration.includes('d') : this.state.dotted} />
                </div>
                <div className="row valign-wrapper">
                    <div className="col s11" tabIndex="0" onClick={this.handleClick} onMouseMove={this.handleMouseMove}>
                        <Staff
                            id="0"
                            stave={this.state.stave}
                            getBarLines={this.getBarLines}
                            selectedNote={this.state.selectedNote}
                            activeVoice={this.state.currentVoice}
                            bpm={this.state.bpm} />
                    </div>
                    <div className="col s1">
                        <SaveScore onClick={this.props.saveScore} changeIndicator={this.props.changeIndicator} justLoaded={Date.now() - this.state.timeOpened < 50} />
                    </div>
                </div>
                    <MidiPlayer
                        lang={this.props.lang.player}
                        check={selectedNote}
                        currentNote={currentNote}
                        currentVoice={this.state.currentVoice}
                        measures={this.state.stave.measures}
                        timeSig={[this.state.stave.beatsNum, this.state.stave.beatsType]}
                        setParentState={this.innerStateChange} />
                <div className="divider"></div>
                <div className="row section">
                    <div className="col s3">
                        <ClefOptions lang={this.props.lang.options.clef} clef={this.state.stave.clef} onChange={this.storeChange} />
                    </div>
                    <div className="col s3">
                        <KeyOptions lang={this.props.lang.options.key} keySig={this.state.stave.keySig} onChange={this.storeChange} />
                    </div>
                    <div className="col s3">
                        <TimeSigOptions
                                lang={this.props.lang.options.time}
                                beatsNum={this.state.stave.beatsNum}
                                beatsType={this.state.stave.beatsType}
                                onChange={this.timeChangeHandler} />
                    </div>
                    <div className="col s3">
                        <AddRemoveMeasure text={this.props.lang.options.measure} add={this.addMeasure} remove={this.removeMeasure} />
                    </div>
                </div>
                <div className="divider"></div>
                <div className="row section">
                    <div className="col s6">
                        <AddRemoveVoice
                                lang={this.props.lang.options.voices}
                                addVoice={this.addVoice}
                                removeVoice={this.removeVoice}
                                clearVoices={this.clearVoices} />
                    </div>
                    <div className="col s3">
                        <Voices
                            lang={this.props.lang.options.voices}
                            voices={this.state.stave.measures[0].voices}
                            currentVoice={this.state.currentVoice}
                            onChange={this.innerStateChange} />
                    </div>
                    <div className="col s3">
                        <div className="row">
                            <AddRandomNote text={this.props.lang.options.notes.add} onSubmit={this.handleRandomNote} />
                        </div>
                        <div className="row">
                            <RemoveNote text={this.props.lang.options.notes.remove} onClick={this.removeLastNote} />
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="row section">
                    <div className="col s12">
                        <MelodyGenerator lang={this.props.lang.options.melody} noteNames={this.props.lang.noteNames} generate={this.generateMelody} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StaffContainer);
