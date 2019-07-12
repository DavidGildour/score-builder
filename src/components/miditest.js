// import MidiWriter from 'midi-writer-js';
import React from 'react';
import MIDISounds from 'midi-sounds-react';

import { midiMapping } from './mappings/midiMappings';
import { durToBeats } from './mappings/durationMappings';


export default class extends React.Component {
    state = {
        instrument: 2,
        tempo: 60,
    }

    handleClick = () => {
        this.midiSounds.playChordNow(this.state.instrument, ['C/4', 'G/4', 'C/5', 'Eb/5', 'G/5', 'Bb/5'].map(note => midiMapping[note]), 1);
    }

    shouldComponentUpdate = (nextProps) => {
        if (!nextProps.check) return false;
        else if (!this.props.check) return true;
        return (nextProps.check.voiceId !== this.props.check.voiceId        // active voice changed
            || nextProps.check.noteId !== this.props.check.noteId           // active note in a voice changed
            || nextProps.currentNote.keys !== this.props.currentNote.keys); // active note's pitch changed
    }

    componentDidUpdate() {
        if (!this.props.currentNote.duration.includes('r')) {
            const notes = this.props.currentNote.keys.map(note => midiMapping[note] || 109);
            const duration = durToBeats[this.props.currentNote.duration] * (60/this.state.tempo)
            this.midiSounds.playChordNow(this.state.instrument, notes, duration);
        }
    }

    componentDidMount() {
        this.midiSounds.setEchoLevel(0);
        this.midiSounds.setMasterVolume(1/9);
    }
    
    render = () => {
        return (
            <div>
                <button onClick={this.handleClick}>Spicy Cmin7!</button>
                <div hidden>
                    <MIDISounds ref={ref => this.midiSounds = ref} appElementName="root" instruments={[this.state.instrument]} />
                </div>
            </div>
        )
    }
}
