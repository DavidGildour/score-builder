/* eslint-disable object-shorthand */
import React from 'react';

import { connect } from 'react-redux';
import { setStaveField, addNoteToStave, deleteNoteFromStave } from '../redux/actions';

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


function ClefOptions(props) {
    return (
        <select className="ctrl" name="clef" value={props.clef} onChange={props.onChange}>
            <option value="treble">Treble clef</option>
            <option value="bass">Bass clef</option>
            <option value="alto">Alto clef</option>
            <option value="tenor">Tenor clef</option>
            <option value="percussion">Percussion clef</option>
            <option value="soprano">Soprano clef</option>
            <option value="mezzo-soprano">Mezzo Soprano clef</option>
            <option value="baritone-c">Baritone (C) clef</option>
            <option value="baritone-f">Bariton (F) clef</option>
            <option value="subbass">Subbass clef</option>
            <option value="french">French clef</option>
            <option value="tab">Tab clef</option>
        </select>
    );
}

function TimeSigOptions(props) {
    return (
        <div>
            <input
                className="ctrl timesig"
                name="beatsNum"
                type="number"
                value={props.beatsNum}
                placeholder="4"
                onChange={props.onChange} />
            /
            <select className="ctrl" name="beatsType" value={props.beatsType} onChange={props.onChange}>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
            </select>
        </div>
    );
}

function KeyOptions(props) {
    return (
        <select className="ctrl" name="keySig" value={props.keySig} onChange={props.onChange}>
            <option value="Cb">Cb major/Ab minor</option>
            <option value="Gb">Gb major/Eb minor</option>
            <option value="Db">Db major/Bb minor</option>
            <option value="Ab">Ab major/F minor</option>
            <option value="Eb">Eb major/C minor</option>
            <option value="Bb">Bb major/G minor</option>
            <option value="F">F major/D minor</option>
            <option value="C">C major/A minor</option>
            <option value="G">G major/E minor</option>
            <option value="D">D major/B minor</option>
            <option value="A">A major/F# minor</option>
            <option value="E">E major/C# minor</option>
            <option value="B">B major/G# minor</option>
            <option value="F#">F# major/D# minor</option>
            <option value="C#">C# major/A# minor</option>
        </select>
    );
}

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
