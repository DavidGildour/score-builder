/* eslint-disable object-shorthand */
import React from 'react';

import { connect } from 'react-redux';
import { setStaveField, addNoteToStave, deleteNoteFromStave, addVoiceToStave, deleteVoiceFromStave, updateNoteInStave } from '../redux/actions';
import Staff from './Staff';
import { ClefOptions, TimeSigOptions, KeyOptions, AddNote, RemoveNote, NoteDuration, Voices, AddRemoveVoice } from './ControlFields';
import MelodyGenerator from './MelodyGeneratorOptions';
import Midi from './miditest';

import { noteToDuration, durationToNote } from './mappings/durationMappings';
import { clefMapping } from './mappings/clefMappings';
import { noteMapping } from './mappings/noteMappings';
import keyMapping from './mappings/keyMappings';

import './Control.css';

const getRandInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const mapStateToProps = state => ({
    staves: state.staves,
});

const mapDispatchToProps = { setStaveField, addNoteToStave, deleteNoteFromStave, addVoiceToStave, deleteVoiceFromStave, updateNoteInStave };

class StaffContainer extends React.Component {
    state = {
        error: '',
        note: null,
        restMode: false,
        dotted: false,
        id: this.props.id,
        stave: this.props.staves[this.props.id],
        currentVoice: '0',
        selectedNote: null,
        duration: '8',
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
                this.props.deleteNoteFromStave({ noteId: notes.indexOf(n), staveId: this.state.id, voiceId: voice.id }); // actually remove the note from store
            }
        }
        return duration;
    }

    populateVoiceWithRests = (voiceId, lackingDuration) => {
        const restPlacement = {
            0: 'A/4',
            1: 'E/5',
            2: 'F/4',
            3: 'C/5'
        }
        let remainingDuration = lackingDuration;
        while (remainingDuration !== 0) {
            for (const duration of Object.keys(durationToNote).sort((a, b) => b - a)) {
                if (duration <= remainingDuration) {
                    console.log(duration, remainingDuration);
                    remainingDuration -= duration;
                    const note = {
                        clef: this.state.stave.clef,
                        keys: [restPlacement[voiceId]],
                        duration: `${durationToNote[duration]}r`,
                        modifiers: [(durationToNote[duration].includes('d') ? '.' : '')],
                        persistent: false,
                    };
                    this.props.addNoteToStave({ staveId: this.state.id, voiceId: voiceId, note: note });
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
        for (const note of this.state.stave.voices[voiceId].notes) {
            if (!note.duration.includes('r')) return true;
        }
        return false;
    }

    cutMeasure = (voiceId, lackingDuration) => {
        let remainingDuration = lackingDuration;
        const notes = this.state.stave.voices[voiceId].notes.slice();

        while (remainingDuration < 0) {
            this.props.deleteNoteFromStave({ noteId: notes.length - 1, staveId: this.state.id, voiceId: voiceId });
            remainingDuration += noteToDuration[notes.pop().duration.replace('r', '')];
        }
        if (remainingDuration > 0) this.populateVoiceWithRests(voiceId, remainingDuration);
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

        for (const voice of this.state.stave.voices) {
            const lackingDuration = this.voiceDurationIsValid(voice, beatsNum, beatsType);
            const voiceId = voice.id;
            if (lackingDuration > 0) {
                this.populateVoiceWithRests(voiceId, lackingDuration);
            } else if (lackingDuration < 0) {
                this.cutMeasure(voiceId, lackingDuration);
            }
        }
        this.props.setStaveField({ id: this.state.id, field: name, value: value });
        this.setState({
            [name]: value,
        });
    }

    // computeDuration = (voice = this.state.stave.voices[this.state.currentVoice]) => {
    //     const notes = voice.notes.slice();
    //     const duration = notes.reduce((a, note) => a + noteToDuration[note.duration.replace('r', '')], 0);
    //     const measure = this.state.stave.beatsNum * (1 / this.state.stave.beatsType);

    //     return measure - duration;
    // }
 
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
            this.props.addNoteToStave({ note: newNote, staveId: this.state.id, voiceId: this.state.currentVoice });

            const lastNote = this.getLastNote();
            let noteIndex;
            if (!lastNote) noteIndex = 0;
            else noteIndex = this.state.stave.voices[this.state.currentVoice].notes.indexOf(lastNote) + 1;

            this.setState({
                selectedNote: {
                    voiceId: this.state.currentVoice,
                    noteId: noteIndex.toString(),
                },
            });
        }
        return availableDuration;
    }

    handleRandomNote = () => {
        const voice = this.state.stave.voices[this.state.currentVoice];
        let durationLeft = this.getRidOfRests(voice);
        durationLeft = this.addRandomNote(durationLeft);
        this.populateVoiceWithRests(voice.id, durationLeft);
    }

    addRandomNote = (
        availableDuration,
        pitches = noteMapping,
        durToNote = durationToNote,
        noteToDur = noteToDuration,
        voice = this.state.currentVoice,
        diatonic = false,
        ) => {
        let duration = availableDuration;
        // console.log(duration, durToNote, noteToDur, voice);
        if (duration !== 0) {
            const accidentals = diatonic ? [''] : ['', '#', '##', 'b', 'bb'];
            const mapping = keyMapping[this.state.stave.keySig];
            const keyPitches = pitches.map(e => e + (mapping[e] ? mapping[e] : ''));

            const notesReversed = Object.keys(durToNote).sort((a, b) => a - b);
            const durationsReversed = Object.values(durToNote).sort((a, b) => noteToDuration[a] - noteToDuration[b]);
            let upperIndex;

            // determine the maximum valid duration of the note to ba added
            for (const [i, val] of Object.entries(notesReversed)) {
                if (val > duration) break; // value
                upperIndex = i; // index
            }

            const noteDuration = upperIndex ? durationsReversed[getRandInt(0, upperIndex)] : durationToNote[duration];
            let accidental = accidentals[getRandInt(0, accidentals.length)];
            let root = keyPitches[getRandInt(0, keyPitches.length)];
            if (root.length > 1) {
                accidental = root[1];
                root = root[0];
            }
            const symbol = `${root}${accidental}/${getRandInt(4,6)}`;
            const modifiers = noteDuration.includes('d') ? accidental + '.' : accidental;

            console.log("symbol:", symbol);

            const newNote = {
                clef: this.state.stave.clef,
                keys: [symbol],
                duration: noteDuration,
                modifiers: [modifiers],
                persistent: true,
            };

            duration -= noteToDur[noteDuration] || duration;
            this.props.addNoteToStave({ note: newNote, staveId: this.state.id, voiceId: voice });
        };
        return duration;
    }

    removeNote = (_e) => {
        const notes = this.state.stave.voices[this.state.currentVoice].notes.slice();
        let note;
        for (const n of notes.slice().reverse()) {
            if (n.persistent) {
                note = n;
                break;
            }
        }

        if (!note) return;

        this.props.deleteNoteFromStave({ noteId: notes.indexOf(note), staveId: this.state.id, voiceId: this.state.currentVoice });
        const duration = noteToDuration[note.duration.replace('r', '')];

        this.populateVoiceWithRests(this.state.currentVoice, duration);
    }

    transposeNote = (transposition) => {
        const selected = this.state.selectedNote;
        if (!selected) return;

        const note = this.state.stave.voices[selected.voiceId].notes[selected.noteId];
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
                                        voiceId: selected.voiceId,
                                        noteId: selected.noteId,
                                        keys: keys || note.keys,
                                    });
    }

    addVoice = (e) => {
        if (this.state.stave.voices.length === 4) {
            this.setState({ error: "Maximum of four voices reached"});
            return;
        }

        const { value } = e.target;

        this.props.addVoiceToStave({ staveId: this.state.id });

        this.populateVoiceWithRests(value, this.state.stave.beatsNum * (1 / this.state.stave.beatsType))
        this.setState({ error: "" });
    }

    removeVoice = (e) => {
        if (this.state.stave.voices.length === 1) {
            this.setState({ error: "Needs to be at least one voice"});
            return;
        }

        const { value } = e.target;

        if (this.voiceIsNotEmpty(value)) {
            this.setState({ error: "Voice is not empty"});
            return;
        }

        this.props.deleteVoiceFromStave({ staveId: this.state.id, voiceId: value });
        this.setState({ error: "" });
    }

    clearVoices = (_e) => {
        const voiceNum = this.state.stave.voices.length;
        for (const voice of this.state.stave.voices) {
            this.props.deleteVoiceFromStave({ staveId: this.state.id, voiceId: voice.id});
        }
        for (let i = 0; i < voiceNum; i++) {
            this.props.addVoiceToStave({ staveId: this.state.id });
            this.populateVoiceWithRests(i.toString(), this.state.stave.beatsNum * (1 / this.state.stave.beatsType));
        }
        this.setState({
            selectedNote: null,
            error: '',
        })
    }

    generateMelody = (options) => {
        console.log(options);

        for (const voice of this.state.stave.voices) {
            for (const note of voice.notes) {
                if (note.persistent) {
                    this.setState({
                        error: 'You have to clear the voices first.'
                    })
                    return;
                }
            }
        }

        const { shortNote, longNote, diatonic } = options;

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

        for (const voice of this.state.stave.voices) {
            let durationLeft = this.getRidOfRests(voice);
            while (durationLeft > 0) {
                durationLeft = this.addRandomNote(durationLeft, noteMapping, durToNote, noteToDur, voice.id, diatonic);
                }
            // does not have to populate with rests - the melody will always fill the measure
        }
        this.setState({
            error: '',
        })
    }

    handleClick = (e) => {
        const curY = e.pageY;
        const curX = e.pageX;
        const notePositions = this.getNotePositions();
        let selectedNote = null;

        notePositions.forEach( (v, voiceId) => v.forEach( (n, noteId) => {
            if (curX >= n.left && curX <= n.right && curY >= n.top && curY <= n.bottom) {
                selectedNote = { voiceId: voiceId.toString(), noteId: noteId.toString() };
            }
        }));

        if (selectedNote) {
            this.setState({
                selectedNote: selectedNote,
                currentVoice: selectedNote.voiceId,
            })
        } else {
            const voice = this.state.stave.voices[this.state.currentVoice];
            let durationLeft = this.getRidOfRests(voice);
            durationLeft = this.addNote(durationLeft);
            this.populateVoiceWithRests(voice.id, durationLeft);
        };
    }

    handleMouseMove = (e) => {
        const lines = this.state.lines;
        const curY = e.pageY;
        let note;

        if (curY <= lines[0].top) note = clefMapping[this.state.stave.clef][0];
        else if (curY > lines[0].top && curY <= lines[0].bottom ) note = clefMapping[this.state.stave.clef][1];
        else if (curY > lines[0].bottom && curY <= lines[1].top ) note = clefMapping[this.state.stave.clef][2];
        else if (curY > lines[1].top && curY <= lines[1].bottom ) note = clefMapping[this.state.stave.clef][3];
        else if (curY > lines[1].bottom && curY <= lines[2].top ) note = clefMapping[this.state.stave.clef][4];
        else if (curY > lines[2].top && curY <= lines[2].bottom ) note = clefMapping[this.state.stave.clef][5];
        else if (curY > lines[2].bottom && curY <= lines[3].top ) note = clefMapping[this.state.stave.clef][6];
        else if (curY > lines[3].top && curY <= lines[3].bottom ) note = clefMapping[this.state.stave.clef][7];
        else if (curY > lines[3].bottom && curY <= lines[4].top ) note = clefMapping[this.state.stave.clef][8];
        else if (curY > lines[4].top && curY <= lines[4].bottom ) note = clefMapping[this.state.stave.clef][9];
        else if (curY > lines[4].bottom ) note = clefMapping[this.state.stave.clef][10];

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
                    noteId: (Math.min(+state.selectedNote.noteId + 1, state.stave.voices[state.selectedNote.voiceId].notes.length - 1)).toString(),
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
                        ? state.stave.voices.length - 1
                        : +state.currentVoice - 1)
                    : ((+state.currentVoice + 1) % state.stave.voices.length);
                console.log(nextVoice);
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
                selectedNote: null,
                [name]: value,
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

    getNotePositions = () => {
        const staveSVG = document.getElementById(`stave${this.state.id}`).childNodes[0];

        const voices = this.state.stave.voices.slice();

        const notes = staveSVG.getElementsByClassName('vf-stavenote');
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
                len = voice.notes.length
            }
            // console.log(n.getElementsByClassName("vf-notehead")[0]);
            notePositions[voiceId].push(n.getElementsByClassName("vf-notehead")[0].getBoundingClientRect());
            noteId++;
        }

        return notePositions;
    }

    getLastNote = () => {
        let lastNote = null;
        for (const note of this.state.stave.voices[this.state.currentVoice].notes) {
            if (!note.persistent) break;
            lastNote = note;
        }
        return lastNote;
    }

    static getDerivedStateFromProps = (props, state) => ({ stave: props.staves[state.id] })

    componentDidMount(){
        const staveSVG = document.getElementById(`stave${this.state.id}`).childNodes[0];

        const lines = [];

        for (const [i, line] of staveSVG.childNodes.entries()) {
            if (i >= 5) break;
            lines.push(line.getBoundingClientRect());
        }

        this.setState((state) => ({ 
            ...state,
            lines: lines,
        }))
    }

    render() {
        let currentNote;
        const selectedNote = this.state.selectedNote;
        selectedNote ? currentNote = this.state.stave.voices[selectedNote.voiceId].notes[selectedNote.noteId] : currentNote = null;
        return (
            <div>
                <div className="noteDur">
                    <NoteDuration
                        onChange={this.innerStateChange}
                        duration={this.state.duration}
                        restMode={this.state.restMode}
                        dotted={this.state.dotted} />
                </div>
                <div tabIndex="0" onKeyDown={this.handleKeyPress} onClick={this.handleClick} onMouseMove={this.handleMouseMove}>
                    <Staff id="0" selectedNote={this.state.selectedNote} activeVoice={this.state.currentVoice} />
                </div>
                <Midi check={selectedNote} currentNote={currentNote} notes={this.state.stave.voices[this.state.currentVoice].notes} />
                <div>
                    {this.state.selectedNote 
                        ? this.state.stave.voices[this.state.selectedNote.voiceId].notes[this.state.selectedNote.noteId].keys.join(' ') 
                        : ''}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Options:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Select clef type:
                            </td>
                            <td>
                                <ClefOptions clef={this.state.stave.clef} onChange={this.storeChange} />
                            </td>
                        
                            <td>
                                <AddNote onSubmit={this.handleRandomNote} />
                            </td>
                            <td rowSpan="3">
                                <Voices
                                    voices={this.state.stave.voices}
                                    currentVoice={this.state.currentVoice}
                                    onChange={this.innerStateChange} />
                            </td>
                            <td rowSpan="3">
                                <AddRemoveVoice
                                    addVoice={this.addVoice}
                                    removeVoice={this.removeVoice}
                                    clearVoices={this.clearVoices}
                                    error={this.state.error}
                                    newVoiceId={this.state.stave.voices.length} />
                            </td>
                            <td rowSpan="5">
                                <MelodyGenerator generate={this.generateMelody} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Select time signature:
                            </td>
                            <td>
                                <TimeSigOptions
                                    beatsNum={this.state.stave.beatsNum}
                                    beatsType={this.state.stave.beatsType}
                                    onChange={this.timeChangeHandler} />
                            </td>
                            <td>
                                <RemoveNote onClick={this.removeNote} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Select key signature:
                            </td>
                            <td>
                                <KeyOptions keySig={this.state.stave.keySig} onChange={this.storeChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="err">
                    {this.state.error}
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StaffContainer);
