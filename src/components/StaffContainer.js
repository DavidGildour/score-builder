/* eslint-disable object-shorthand */
import React from 'react';

import { connect } from 'react-redux';
import { setStaveField, addNoteToStave, deleteNoteFromStave, addVoiceToStave, deleteVoiceFromStave, updateNoteInStave } from '../redux/actions';
import Staff from './Staff';
import { ClefOptions, TimeSigOptions, KeyOptions, AddNote, RemoveNote, NoteDuration, Voices, AddRemoveVoice } from './ControlFields'; 

import { noteToDuration, durationToNote } from './mappings/durationMappings';
import { clefMapping } from './mappings/clefMappings';
import { noteMapping } from './mappings/noteMappings';

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

    populateVoiceWithRests = (voiceId, lackingDuration) => {
        const restPlacement = {
            0: 'A/4',
            1: 'E/5',
            2: 'F/4',
            3: 'C/5'
        }
        let remainingDuration = lackingDuration;
        while (remainingDuration !== 0) {
            for (const duration of Object.keys(durationToNote)) {
                if (duration <= remainingDuration) {
                    remainingDuration -= duration;
                    const note = {
                        clef: this.state.stave.clef,
                        keys: [restPlacement[voiceId]],
                        duration: `${durationToNote[duration]}r`,
                        modifiers: [(durationToNote[duration].includes('d') ? '.' : '')],
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

    computeDuration = () => {
        const notes = this.state.stave.voices[this.state.currentVoice].notes.slice();
        const revNotes = notes.slice().reverse();
        let duration = 0;
        if (!revNotes[0].duration.includes('r')) return duration; // if the last note is not a pause - return, cause there's no room for another

        for (const n of revNotes) {
            if (!n.duration.includes('r')) { // break the loop when hitting non-pause note
                break;
            }
            duration += noteToDuration[n.duration.replace('r', '')]; // compute the duration we are reducing by removing trailing pauses
            this.props.deleteNoteFromStave({ noteId: notes.indexOf(n), staveId: this.state.id, voiceId: this.state.currentVoice }); // actually remove the note from store
        }
        return duration;
    }
 
    addNote = (_e) => {
        let availableDuration = this.computeDuration();
        const declaredDuration = this.state.duration + (this.state.dotted ? 'd' : '');

        if (availableDuration >= noteToDuration[declaredDuration]) {
            const newNote = {
                clef: this.state.stave.clef,
                keys: [this.state.note],
                duration: this.state.restMode ? declaredDuration + 'r' : declaredDuration,
                modifiers: [(declaredDuration.includes('d') ? '.' : '')],
            }

            availableDuration -= noteToDuration[newNote.duration.replace('r', '')];
            this.props.addNoteToStave({ note: newNote, staveId: this.state.id, voiceId: this.state.currentVoice });
            this.setState({
                selectedNote: null, // quick fix 
            })
        }
        this.populateVoiceWithRests(this.state.currentVoice, availableDuration);
    }

    addRandomNote = (_e) => {
        let duration = this.computeDuration();
        if (duration === 0) return;

        const pitches = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const accidentals = ['', '#', '##', 'b', 'bb'];

        const notesReversed = Object.keys(durationToNote).sort((a, b) => a - b);
        const durationsReversed = Object.values(durationToNote).reverse();
        let upperIndex;

        // determine the maximum valid duration of the note to ba added
        for (const [i, val] of Object.entries(notesReversed)) {
            if (val > duration) break; // value
            upperIndex = i; // index
        }

        const noteDuration = durationsReversed[getRandInt(0, upperIndex)];
        const accidental = accidentals[getRandInt(0, accidentals.length)];
        const symbol = `${pitches[getRandInt(0, pitches.length)]}${accidental}/${getRandInt(4,6)}`;
        const modifiers = noteDuration.includes('d') ? accidental + '.' : accidental;

        const newNote = {
            clef: this.state.stave.clef,
            keys: [symbol],
            duration: noteDuration,
            modifiers: [modifiers],
        };

        duration -= noteToDuration[noteDuration];
        this.props.addNoteToStave({ note: newNote, staveId: this.state.id, voiceId: this.state.currentVoice });
        this.populateVoiceWithRests(this.state.currentVoice, duration);   
    }

    removeNote = (e) => {
        e.preventDefault();

        const notes = this.state.stave.voices[this.state.currentVoice].notes.slice();
        let note;
        for (const n of notes.slice().reverse()) {
            if (!n.duration.includes('r')) {
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
                                newSymbol = noteMapping[oldIndex === 0 ? (isDiatonic ? 5 : 6) : oldIndex - (isDiatonic ? 2 : 1)];
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
        } else this.addNote(e);
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
        }
        if (key === 'ArrowDown') {
            this.transposeNote('sd');
        }
        if (key === 'PageUp') {
            this.transposeNote('ou');
        }
        if (key === 'PageDown') {
            this.transposeNote('od');
        }
        if (key === 'ArrowRight') {
            this.setState(state => ({
                selectedNote: {
                    voiceId: state.selectedNote.voiceId,
                    noteId: (Math.min(+state.selectedNote.noteId + 1, state.stave.voices[state.selectedNote.voiceId].notes.length - 1)).toString(),
                }
            }))
        }
        if (key === 'ArrowLeft') {
            this.setState(state => ({
                selectedNote: {
                    voiceId: state.selectedNote.voiceId,
                    noteId: (Math.max(+state.selectedNote.noteId - 1, 0)).toString(),
                }
            }))
        }
        if (key === 'Tab') {
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
                                <AddNote onSubmit={this.addRandomNote} />
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
