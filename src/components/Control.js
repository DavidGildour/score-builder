/* eslint-disable object-shorthand */
import React from 'react';

import { connect } from 'react-redux';
import { setStaveField, addNoteToStave, deleteNoteFromStave } from '../redux/actions';
import { ClefOptions, TimeSigOptions, KeyOptions, AddNote, RemoveNote } from './ControlFields'; 

import './Control.css';

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
    0.09175: '16d',
    0.0625: '16',
    0.046875: '32d',
    0.03125: '32',
};

const noteToDuration = {
    w: 1,
    wd: 1.5,
    h: 0.5,
    hd: 0.75,
    q: 0.25,
    qd: 0.375,
    8: 0.125,
    '8d': 0.1875,
    16: 0.0625,
    '16d': 0.09175,
    32: 0.03125,
    '32d': 0.046875,
};

class Control extends React.Component {
    state = {
        id: this.props.id,
        clef: 'treble',
        beatsNum: '4',
        beatsType: '4',
        keySig: 'C',
    };

    populateVoiceWithRests = (voiceId, lackingDuration) => {
        let remainingDuration = lackingDuration;
        while (remainingDuration !== 0) {
            for (const duration of Object.keys(durationToNote)) {
                if (duration <= remainingDuration) {
                    remainingDuration -= duration;
                    const note = {
                        clef: this.state.clef,
                        keys: ['d/5'],
                        duration: `${durationToNote[duration]}r`,
                        modifiers: [''],
                    };
                    console.log('shoudl populate');
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
