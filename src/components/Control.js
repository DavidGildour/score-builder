/* eslint-disable object-shorthand */
import React from 'react';

import { connect } from 'react-redux';
import { setStaveField, addNoteToStave, deleteNoteFromStave } from '../redux/actions';
import { ClefOptions, TimeSigOptions, KeyOptions, AddNote, RemoveNote } from './ControlFields'; 

import './Control.css';

const getRandInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const mapStateToProps = state => ({
    staves: state.staves,
});

const mapDispatchToProps = { setStaveField, addNoteToStave, deleteNoteFromStave };

const durationToNote = {
    1.5: 'wd',
    1: 'w',
    0.75: 'hd',
    0.5: 'h',
    0.375: 'qd',
    0.25: 'q',
    0.1875: '8d',
    0.125: '8',
    0.09375: '16d',
    0.0625: '16',
    0.046875: '32d',
    0.03125: '32',
    0.015625: '64',
};

const noteToDuration = {
    wd: 1.5,
    w: 1,
    hd: 0.75,
    h: 0.5,
    qd: 0.375,
    q: 0.25,
    '8d': 0.1875,
    8: 0.125,
    '16d': 0.09375,
    16: 0.0625,
    '32d': 0.046875,
    32: 0.03125,
    64: 0.015625,
};

class Control extends React.Component {
    state = {
        error: false,
        id: this.props.id,
        clef: 'treble',
        beatsNum: '4',
        beatsType: '4',
        keySig: 'C',
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
                        modifiers: [''],
                    };
                    console.log('should populate');
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

    cutMeasure = (voiceId, lackingDuration) => {
        let remainingDuration = lackingDuration;
        const notes = this.props.staves[0].voices[voiceId].notes.slice();

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

        for (const voice of this.props.staves[0].voices) {
            const lackingDuration = this.voiceDurationIsValid(voice, beatsNum, beatsType);
            const voiceId = this.props.staves[0].voices.indexOf(voice);
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

    changeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value,
        });

        this.props.setStaveField({ id: this.state.id, field: name, value: value });
    }

    addNote = (e) => {
        e.preventDefault();

        const notes = this.props.staves[0].voices[0].notes.slice();
        const revNotes = notes.slice().reverse();
        let duration = 0;
        if (!revNotes[0].duration.includes('r')) return; // if the last note is not a pause - return, cause there's no room for another

        for (const n of revNotes) {
            if (!n.duration.includes('r')) { // break the loop when hitting non-pause note
                break;
            }
            duration += noteToDuration[n.duration.replace('r', '')]; // compute the duration we are reducing by removing trailing pauses
            this.props.deleteNoteFromStave({ noteId: notes.indexOf(n), staveId: this.state.id, voiceId: 0 }); // actually remove the note from store
        }

        const pitches = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const accidentals = ['', '#', '##', 'b', 'bb'];

        const notesReversed = Object.keys(durationToNote).sort((a, b) => a - b);
        const durationsReversed = Object.values(durationToNote).reverse();
        let upperIndex;

        // determine the maximum valid duration of the note to ba added
        for (const val of Object.entries(notesReversed)) {
            if (val[1] > duration) break; // value
            upperIndex = val[0]; // index
        }

        console.log(duration, upperIndex);

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

        console.log('Added note: ', newNote);

        duration -= noteToDuration[noteDuration];
        this.props.addNoteToStave({ note: newNote, staveId: this.state.id, voiceId: 0 });
        this.populateVoiceWithRests(0, duration);   
    }

    removeNote = (e) => {
        e.preventDefault();

        const notes = this.props.staves[0].voices[0].notes.slice();
        let note;
        for (const n of notes.slice().reverse()) {
            if (!n.duration.includes('r')) {
                note = n;
                break;
            }
        }

        if (!note) return;

        console.log(note);

        this.props.deleteNoteFromStave({ noteId: notes.indexOf(note), staveId: this.state.id, voiceId: 0 });
        const duration = noteToDuration[note.duration.replace('r', '')];

        this.populateVoiceWithRests(0, duration);
    }

    render() {
        return (
            <div>
                <h3>Options:</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Select clef type:
                            </td>
                            <td>
                                <ClefOptions clef={this.state.clef} onChange={this.changeHandler} />
                            </td>
                        
                            <td>
                                <AddNote onSubmit={this.addNote} />
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
                                <KeyOptions keySig={this.state.keySig} onChange={this.changeHandler} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Control);
