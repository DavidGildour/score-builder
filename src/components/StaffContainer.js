/* eslint-disable object-shorthand */
import React from 'react';

import { connect } from 'react-redux';
import { setStaveField, addNoteToStave, deleteNoteFromStave, addVoiceToStave, deleteVoiceFromStave } from '../redux/actions';
import Staff from './Staff';
import { ClefOptions, TimeSigOptions, KeyOptions, AddNote, RemoveNote, NoteDuration, Voices, AddRemoveVoice } from './ControlFields'; 

import { noteToDuration, durationToNote } from './mappings/durationMappings';
import { clefMapping } from './mappings/clefMappings';

import './Control.css';

const getRandInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const mapStateToProps = state => ({
    staves: state.staves,
});

const mapDispatchToProps = { setStaveField, addNoteToStave, deleteNoteFromStave, addVoiceToStave, deleteVoiceFromStave };

class StaffContainer extends React.Component {
    state = {
        error: '',
        note: null,
        restMode: false,
        dotted: false,
        id: this.props.id,
        stave: this.props.staves[this.props.id],
        currentVoice: '0',
        clef: this.props.staves[this.props.id].clef,
        beatsNum: this.props.staves[this.props.id].beatsNum,
        beatsType: this.props.staves[this.props.id].beatsType,
        keySig: this.props.staves[this.props.id].keySig,
        duration: '8',
    };

    populateVoiceWithRests = (voiceId, lackingDuration) => {
        let remainingDuration = lackingDuration;
        // const maxIter = Object.keys(noteToDuration).length;
        // let count = 0;
        while (remainingDuration !== 0) {
            for (const duration of Object.keys(durationToNote)) {
                console.log(duration, remainingDuration);
                // count++;
                if (duration <= remainingDuration) {
                    remainingDuration -= duration;
                    const note = {
                        clef: this.state.clef,
                        keys: ['d/5'],
                        duration: `${durationToNote[duration]}r`,
                        modifiers: [(durationToNote[duration].includes('d') ? '.' : '')],
                    };
                    console.log('should populate voice:', voiceId);
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
            console.log(remainingDuration);
            this.props.deleteNoteFromStave({ noteId: notes.length - 1, staveId: this.state.id, voiceId: voiceId });
            remainingDuration += noteToDuration[notes.pop().duration.replace('r', '')];
        }
        if (remainingDuration > 0) this.populateVoiceWithRests(voiceId, remainingDuration);
    }

    timeChangeHandler = (event) => {
        const { name, value } = event.target;

        if (value === '' || value < 1 || value > 32) {
            return;
        }

        let beatsNum = this.state.beatsNum;
        let beatsType = this.state.beatsType;

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

        console.log(declaredDuration);

        if (availableDuration >= noteToDuration[declaredDuration]) {
            const newNote = {
                clef: this.state.clef,
                keys: [this.state.note],
                duration: this.state.restMode ? declaredDuration + 'r' : declaredDuration,
                modifiers: [(declaredDuration.includes('d') ? '.' : '')],
            }

            availableDuration -= noteToDuration[newNote.duration.replace('r', '')];
            console.log('added note: ', newNote);
            this.props.addNoteToStave({ note: newNote, staveId: this.state.id, voiceId: this.state.currentVoice });
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
            clef: this.state.clef,
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

        console.log(note);

        this.props.deleteNoteFromStave({ noteId: notes.indexOf(note), staveId: this.state.id, voiceId: this.state.currentVoice });
        const duration = noteToDuration[note.duration.replace('r', '')];

        this.populateVoiceWithRests(this.state.currentVoice, duration);
    }

    addVoice = (e) => {
        if (this.state.stave.voices.length === 4) {
            this.setState({ error: "Maximum of four voices reached"});
            return;
        }

        const { value } = e.target;

        this.props.addVoiceToStave({ staveId: this.state.id });

        this.populateVoiceWithRests(value, this.state.beatsNum * (1 / this.state.beatsType))
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

    handleMouseMove = (e) => {
        const curY = e.pageY;
        let note;

        if (curY <= 140) note = clefMapping[this.state.clef][0];
        else if (curY > 140 && curY <= 146 ) note = clefMapping[this.state.clef][1];
        else if (curY > 146 && curY <= 150 ) note = clefMapping[this.state.clef][2];
        else if (curY > 150 && curY <= 156 ) note = clefMapping[this.state.clef][3];
        else if (curY > 156 && curY <= 160 ) note = clefMapping[this.state.clef][4];
        else if (curY > 160 && curY <= 166 ) note = clefMapping[this.state.clef][5];
        else if (curY > 166 && curY <= 170 ) note = clefMapping[this.state.clef][6];
        else if (curY > 170 && curY <= 176 ) note = clefMapping[this.state.clef][7];
        else if (curY > 176 && curY <= 180 ) note = clefMapping[this.state.clef][8];
        else if (curY > 180 ) note = clefMapping[this.state.clef][9];

        this.setState({note: note})
    }

    innerStateChange = (event) => {
        const { name, value, type } = event.target;

        if (type !== 'checkbox') {
            this.setState({
                [name]: value,
            });
        } else {
            this.setState((state) => ({
                [name]: !state[name],
            }));
        }
    }

    storeChange = (event) => {
        this.innerStateChange(event);
        const { name, value } = event.target;

        this.props.setStaveField({ id: this.state.id, field: name, value: value });
    }

    static getDerivedStateFromProps = (props, state) => ({ stave: props.staves[state.id] })

    render() {
        return (
            <div>
                <div onClick={this.addNote} onMouseMove={this.handleMouseMove}>
                    <Staff id="0" activeVoice={this.state.currentVoice} />
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
                                <ClefOptions clef={this.state.clef} onChange={this.storeChange} />
                            </td>
                        
                            <td>
                                <AddNote onSubmit={this.addRandomNote} />
                            </td>
                            <td rowSpan="3">
                                <NoteDuration
                                    onChange={this.innerStateChange}
                                    duration={this.state.duration}
                                    restMode={this.state.restMode}
                                    dotted={this.state.dotted} />
                            </td>
                            <td rowSpan="3">
                                <Voices
                                    voices={this.state.stave.voices}
                                    currentVoice={this.state.currentVoice}
                                    onChange={this.innerStateChange} />
                            </td>
                            <td>
                                <AddRemoveVoice
                                    addVoice={this.addVoice}
                                    removeVoice={this.removeVoice}
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
                                    beatsNum={this.state.beatsNum}
                                    beatsType={this.state.beatsType}
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
                                <KeyOptions keySig={this.state.keySig} onChange={this.storeChange} />
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
