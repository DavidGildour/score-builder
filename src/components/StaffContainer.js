import React from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css/dist/js/materialize.min';

import { setStaveField, addNoteToStave, deleteNoteFromStave, addVoiceToStave, deleteVoiceFromStave, updateNoteInStave, addMeasureToStave } from '../redux/actions';
import Staff from './Staff';
import { ClefOptions, TimeSigOptions, KeyOptions, AddRandomNote, RemoveNote, NoteDuration, Voices, AddRemoveVoice, AddMeasure } from './ControlFields';
import MelodyGenerator from './MelodyGeneratorOptions';
import MidiPlayer from './MidiPlayer';

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
};

class StaffContainer extends React.Component {
    state = {
        error: '',
        note: null,
        restMode: false,
        dotted: false,
        id: this.props.id,
        stave: this.props.staves[this.props.id],
        currentVoice: '0',
        currentMeasure: null,
        selectedNote: null,
        duration: '8',
        bpm: 30,
    };

    getRidOfRests = (voice) => {
        const notes = voice.notes;
        const revNotes = notes.slice().reverse();

        let duration = 0;
        if (!revNotes[0].persistent) { // if the last note is persistent - return, cause there's no room for another
            for (const n of revNotes) {
                if (n.persistent) { // break the loop when hitting persistent note
                    break;
                }
                duration += noteToDuration[n.duration.replace('r', '')];
                this.props.deleteNoteFromStave({ noteId: notes.indexOf(n), measureId: '0', staveId: this.state.id, voiceId: voice.id }); // actually remove the note from store
            }
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
        if (voiceDuration !== expectedDuration) {
            return expectedDuration - voiceDuration;
        }
        return 0;
    }

    voiceIsNotEmpty = (voiceId) => {
        for (const note of this.state.stave.measures[0].voices[voiceId].notes) {
            if (!note.duration.includes('r')) return true;
        }
        return false;
    }

    cutMeasure = (voiceId, lackingDuration) => {
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
            selectedNote: null, // quick fix 
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
                this.cutMeasure(voiceId, lackingDuration);
            }
        }
        this.props.setStaveField({ id: this.state.id, field: name, value: value });
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
 
    addNote = (durationLeft) => {
        let availableDuration = durationLeft;
        const declaredDuration = this.state.duration + (this.state.dotted ? 'd' : '');

        if (availableDuration >= noteToDuration[declaredDuration]) {
            const newNote = {
                clef: this.state.stave.clef,
                keys: [this.state.note],
                duration: this.state.restMode ? declaredDuration + 'r' : declaredDuration,
                modifiers: [(declaredDuration.includes('d') ? '.' : '')],
                persistent: true,
            }

            availableDuration -= noteToDuration[newNote.duration.replace('r', '')];
            this.props.addNoteToStave({ note: newNote, staveId: this.state.id, measureId: '0', voiceId: this.state.currentVoice });
            const newNoteId = this.getLastNoteInAVoice(this.state.stave.measures[0].voices[this.state.currentVoice]) + 1;
            this.setState({
                selectedNote: {
                    noteId: Math.min(newNoteId, this.state.stave.measures[0].voices[this.state.currentVoice].notes.length - 1).toString(),
                    voiceId: this.state.currentVoice,
                },
            })
        }
        return availableDuration;
    }

    handleRandomNote = () => {
        const voice = this.state.stave.measures[0].voices[this.state.currentVoice];
        let durationLeft = this.getRidOfRests(voice);
        durationLeft = this.addRandomNote(durationLeft).duration;
        const newNoteId = this.getLastNoteInAVoice(this.state.stave.measures[0].voices[this.state.currentVoice]) + 1;
        this.setState({
            selectedNote: {
                noteId: Math.min(newNoteId, this.state.stave.measures[0].voices[this.state.currentVoice].notes.length - 1).toString(),
                voiceId: this.state.currentVoice,
            },
        })
        this.populateVoiceWithRests('0', voice.id, durationLeft);
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
        console.log(minNote, minIndex, maxNote, maxIndex);
        return availableNotes.filter((note, i) => note !== centerNote && i <= maxIndex && i >= minIndex);
    }

    addRandomNote = (
        availableDuration,
        durToNote = durationToNote,
        noteToDur = noteToDuration,
        voice = this.state.currentVoice,
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
            console.log(voice, centerNote, availableNotes);
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
            this.props.addNoteToStave({ note: newNote, staveId: this.state.id, measureId: '0', voiceId: voice });
            return { duration: duration, notePitches: notePitches }
        };
        return { duration: duration, notePitches: [''] };
    }

    removeNote = (_e) => {
        const notes = this.state.stave.measures[0].voices[this.state.currentVoice].notes.slice();
        let note;
        for (const n of notes.slice().reverse()) {
            if (n.persistent) {
                note = n;
                break;
            }
        }

        if (!note) return;

        this.props.deleteNoteFromStave({ noteId: notes.indexOf(note), measureId: '0', staveId: this.state.id, voiceId: this.state.currentVoice });
        const duration = noteToDuration[note.duration.replace('r', '')];

        this.populateVoiceWithRests('0', this.state.currentVoice, duration);
    }

    transposeNote = (transposition) => {
        const selected = this.state.selectedNote;
        if (!selected) return;

        const note = this.state.stave.measures[0].voices[selected.voiceId].notes[selected.noteId];
        let keys = [];
        for (const key of note.keys) {
            if (transposition[0] === 'o') {
                keys.push(key.replace(/\d/, match => + match + (transposition[1] === 'u' ? 1 : -1)));
            }
            if (transposition[0] === 's') {
                const [ , oldKey, oldOctave] = key.match(/(.+)\/(\d)/);
                const oldSymbol = oldKey[0];
                const oldAcc = oldKey.match(/[#b]+/);
                const oldIndex = noteMapping.indexOf(oldSymbol.toUpperCase());

                let newSymbol;
                let newAcc;
                let newOctave;

                console.log("old: ", oldSymbol, oldAcc, oldOctave, oldIndex);

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
                        newSymbol = isDiatonic ? noteMapping[(oldIndex + 1) % 7] : oldSymbol;
                        newAcc = isDiatonic ? '' : '#';
                    }
                    if (oldIndex === 6 && !['Bb', 'Bbb'].includes(oldKey)) newOctave = +oldOctave + 1;
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
                        newSymbol = isDiatonic ? noteMapping[oldIndex === 0 ? 6 : oldIndex - 1] : oldSymbol;
                        newAcc = isDiatonic ? '' : 'b';
                    }
                    if (oldIndex === 0 && !['C#', 'C##'].includes(oldKey)) newOctave = +oldOctave - 1;
                }
                console.log("new: ", newSymbol, newAcc, newOctave || oldOctave);

                keys.push(`${newSymbol + newAcc}/${newOctave || oldOctave}`);
            }
        }

        this.props.updateNoteInStave({  
                                        staveId: this.state.id,
                                        measureId: '0',
                                        voiceId: selected.voiceId,
                                        noteId: selected.noteId,
                                        keys: keys || note.keys,
                                    });
    }

    addVoice = (e) => {
        if (this.state.stave.measures[0].voices.length === 4) {
            this.setState({ error: "Maximum of four voices reached"});
            return;
        }

        const voiceId = this.state.stave.measures[0].voices.length.toString();

        this.props.addVoiceToStave({ staveId: this.state.id });

        for (let j = 0; j < this.state.stave.measures.length; j++) {
            this.populateVoiceWithRests(j.toString(), voiceId, this.state.stave.beatsNum * (1 / this.state.stave.beatsType));
        }
        this.setState({ error: "" });
    }

    removeVoice = (e) => {
        if (this.state.stave.measures[0].voices.length === 1) {
            this.setState({ error: "Needs to be at least one voice"});
            return;
        }

        const voiceId = (this.state.stave.measures[0].voices.length-1).toString();

        if (this.voiceIsNotEmpty(voiceId)) {
            this.setState({ error: "Voice is not empty"});
            return;
        }

        this.props.deleteVoiceFromStave({ staveId: this.state.id, voiceId: voiceId });
        this.setState(state => ({ 
            error: "",
            currentVoice: state.currentVoice === voiceId ? (+voiceId-1).toString() : state.currentVoice,
            selectedNote: !state.selectedNote // if there was no selected note before removing the voice - it remains null
                          ? null                                    // however, if there was, we need to
                          : ((state.selectedNote.voiceId === voiceId) // check if maybe it was a part of the removed voice
                            ? null // if so - we 'unselect' the note
                            : { voiceId: voiceId, noteId: state.selectedNote.noteId, measureId: state.selectedNote.measureId }), // if it was a part of a different voice though - we can keep it
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
        this.setState({
            selectedNote: null,
            error: '',
        })
    }

    generateMelody = (options) => {
        console.log(options);

        for (const voice of this.state.stave.measures[0].voices) {
            for (const note of voice.notes) {
                if (note.persistent) {
                    this.setState({
                        error: 'You have to clear the voices first.'
                    })
                    return;
                }
            }
        }

        const { shortNote, longNote, diatonic, allowRests, interval } = options;

        if (noteToDuration[longNote] < noteToDuration[shortNote]) {
            this.setState({
                error: 'Shortest note exceeds the duration of a longest note',
            })
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

        for (const voice of this.state.stave.measures[0].voices) {
            let durationLeft = this.getRidOfRests(voice);
            let lastNote = [''];
            while (durationLeft > 0) {
                const noteAdded = this.addRandomNote(durationLeft, durToNote, noteToDur, voice.id, diatonic, lastNote, allowRests, interval);
                durationLeft = noteAdded.duration;
                lastNote = noteAdded.notePitches;
                }
            // does not have to populate with rests - the melody will always fill the measure
        }
        this.setState({
            error: '',
        })
    }

    addMeasure = () => {
        console.log('measure');
        this.props.addMeasureToStave({ staveId: this.state.id, voicesNum: this.state.stave.measures[0].voices.length });
        for (let i = 0; i < this.state.stave.measures[0].voices.length; i++) {
            this.populateVoiceWithRests(this.state.stave.measures.length.toString(), i.toString(), this.state.stave.beatsNum * (1 / this.state.stave.beatsType))
        }
    }

    handleClick = (e) => {
        e.preventDefault();
        const curY = e.pageY;
        const curX = e.pageX;
        const notePositions = this.getNotePositions('0');
        let selectedNote = null;

        notePositions.forEach( (v, voiceId) => v.forEach( (n, noteId) => {
            if (curX >= (n.left   + window.scrollX)
             && curX <= (n.right  + window.scrollX)
             && curY >= (n.top    + window.scrollY)
             && curY <= (n.bottom + window.scrollY)) {
                selectedNote = { voiceId: voiceId.toString(), noteId: noteId.toString() };
            }
        }));

        if (selectedNote) {
            this.setState({
                selectedNote: selectedNote,
                currentVoice: selectedNote.voiceId,
            })
        } else {
            const voice = this.state.stave.measures[0].voices[this.state.currentVoice];
            let durationLeft = this.getRidOfRests(voice);
            console.log(durationLeft);
            durationLeft = this.addNote(durationLeft);
            this.populateVoiceWithRests('0', voice.id, durationLeft);
        };
    }

    handleMouseMove = (e) => {
        const lines = this.state.lines;
        const curY = e.pageY;
        let note;

        if      (curY <=lines[0].top)                               note = clefMapping[this.state.stave.clef][0];
        else if (curY > lines[0].top    && curY <= lines[0].bottom) note = clefMapping[this.state.stave.clef][1];
        else if (curY > lines[0].bottom && curY <= lines[1].top   ) note = clefMapping[this.state.stave.clef][2];
        else if (curY > lines[1].top    && curY <= lines[1].bottom) note = clefMapping[this.state.stave.clef][3];
        else if (curY > lines[1].bottom && curY <= lines[2].top   ) note = clefMapping[this.state.stave.clef][4];
        else if (curY > lines[2].top    && curY <= lines[2].bottom) note = clefMapping[this.state.stave.clef][5];
        else if (curY > lines[2].bottom && curY <= lines[3].top   ) note = clefMapping[this.state.stave.clef][6];
        else if (curY > lines[3].top    && curY <= lines[3].bottom) note = clefMapping[this.state.stave.clef][7];
        else if (curY > lines[3].bottom && curY <= lines[4].top   ) note = clefMapping[this.state.stave.clef][8];
        else if (curY > lines[4].top    && curY <= lines[4].bottom) note = clefMapping[this.state.stave.clef][9];
        else if (curY > lines[4].bottom)                            note = clefMapping[this.state.stave.clef][10];

        this.setState({note: note})
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
            if (this.state.selectedNote) this.setState(state => ({
                selectedNote: {
                    voiceId: state.selectedNote.voiceId,
                    noteId: (Math.min(+state.selectedNote.noteId + 1, state.stave.measures[0].voices[state.selectedNote.voiceId].notes.length - 1)).toString(),
                }
            }))
        } else if (key === 'ArrowLeft') {
            if (this.state.selectedNote) this.setState(state => ({
                selectedNote: {
                    voiceId: state.selectedNote.voiceId,
                    noteId: (Math.max(+state.selectedNote.noteId - 1, 0)).toString(),
                }
            }))
        } else if (key === 'Tab') {
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
                    }
            }})
        } else if (key === ' ') {
            this.addNote();
        }
        
    }

    innerStateChange = (event) => {
        const { name, value, type } = event.target;

        if (type === 'checkbox') {
            this.setState((state) => ({
                [name]: !state[name],
            }));
        } else if (name === 'currentVoice') {
            this.setState((state) => ({
                ...state,
                selectedNote: {
                    voiceId: value,
                    noteId: '0',
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
        const { name, value } = event.target;

        this.props.setStaveField({ id: this.state.id, field: name, value: value });
    }

    getNotePositions = (measureId) => {
        const staveSVG = document.getElementById(`stave${this.state.id}`).childNodes[0];

        const voices = this.state.stave.measures[measureId].voices;

        const measureBarLines = [...staveSVG.getElementsByTagName('rect')]
            .map(e => e.getBoundingClientRect())
            .filter(e => Math.round(e.height) === 41);

        const currentMeasureBarLines = { left: measureBarLines[2*measureId], right: measureBarLines[2*measureId + 1] };

        const notes = [...staveSVG.getElementsByClassName('vf-stavenote')]
            .map(e => e.getElementsByClassName("vf-notehead")[0].getBoundingClientRect())
            // taking into account only notes in currently viewed measure
            .filter(e => e.left >= currentMeasureBarLines.left.x && e.right <= currentMeasureBarLines.right.x);
        let notePositions = [];
        
        let voiceId = 0;
        let noteId = 0;
        notePositions.push([]);
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

    static getDerivedStateFromProps = (props, state) => ({ stave: props.staves[state.id] })

    componentDidMount(){
        M.AutoInit();
        // document.addEventListener('DOMContentLoaded', () => {
        //     const elems = document.querySelectorAll('.sidenav');
        //     const instances = M.Sidenav.init(elems, {edge: 'right'});
        // });
    
        const staveSVG = document.getElementById(`stave${this.state.id}`).childNodes[0];

        const lines = [];

        for (const [i, line] of staveSVG.childNodes.entries()) {
            if (i >= 5) break;
            const linePos = line.getBoundingClientRect();
            lines.push({ top: linePos.top + window.scrollY, bottom: linePos.bottom + window.scrollY });
        }

        this.setState({
            lines: lines,
        });
    }

    render() {
        let currentNote;
        const selectedNote = this.state.selectedNote;
        selectedNote ? currentNote = this.state.stave.measures[0].voices[selectedNote.voiceId].notes[selectedNote.noteId] : currentNote = null;
        // console.log(this.state.stave);
        return (
            <div>
                <div className="center red-text">
                    {this.state.error || <span>&nbsp;</span>}
                </div>
                <div>
                    <NoteDuration
                        lang={this.props.lang}
                        onChange={this.innerStateChange}
                        duration={this.state.duration}
                        restMode={this.state.restMode}
                        dotted={this.state.dotted} />
                </div>
                <div tabIndex="0" onKeyDown={this.handleKeyPress} onClick={this.handleClick} onMouseMove={this.handleMouseMove}>
                    <Staff id="0" selectedNote={this.state.selectedNote} activeVoice={this.state.currentVoice} bpm={this.state.bpm} />
                </div>
                <div>
                    {this.state.selectedNote 
                        ? this.state.stave.measures[0].voices[this.state.selectedNote.voiceId].notes[this.state.selectedNote.noteId].keys.join(' ') 
                        : <span>&nbsp;</span>}
                </div>
                <MidiPlayer 
                    lang={this.props.lang.player}
                    check={selectedNote}
                    currentNote={currentNote}
                    voices={this.state.stave.measures[0].voices}
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
                    <div className="col s4">
                        <TimeSigOptions
                                lang={this.props.lang.options.time}
                                beatsNum={this.state.stave.beatsNum}
                                beatsType={this.state.stave.beatsType}
                                onChange={this.timeChangeHandler} />
                    </div>
                    <div className="col s2">
                        <AddMeasure onClick={this.addMeasure}/>
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
                            <RemoveNote text={this.props.lang.options.notes.remove} onClick={this.removeNote} />
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
