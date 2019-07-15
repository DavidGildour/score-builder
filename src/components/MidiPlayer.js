// import MidiWriter from 'midi-writer-js';
import React from 'react';
import MIDISounds from 'midi-sounds-react';

import { midiMapping } from './mappings/midiMappings';
import { durToBeats, noteToDuration } from './mappings/durationMappings';


export default class extends React.Component {
    state = {
        instrument: 2,
        tempo: 90,
    }

    playVoice = () => {
        this.midiSounds.cancelQueue();
        if (!this.props.check) return;
        const voice =  this.props.voices[this.props.check.voiceId];
        let t = this.midiSounds.contextTime();
        for (const note of voice.notes) {
            if (!note.duration.includes('r')) {
                this.midiSounds.playBeatAt(t, [
                    [],
                    [[this.state.instrument, note.keys.map(pitch => midiMapping[pitch]), noteToDuration[note.duration]]]
                ], this.state.tempo);
            }
            t += durToBeats[note.duration.replace('r', '')] * (60 / this.state.tempo);
        }
    }

    playAllVoices = () => {
        const voices = this.props.voices;
        for (const voice of voices) {
            let t = this.midiSounds.contextTime();
            for (const note of voice.notes) {
                if (!note.duration.includes('r')) {
                    this.midiSounds.playBeatAt(t, [
                        [],
                        [[this.state.instrument, note.keys.map(pitch => midiMapping[pitch]), noteToDuration[note.duration]]]
                    ], this.state.tempo);
                }
                t += durToBeats[note.duration.replace('r', '')] * (60 / this.state.tempo);
            }
        }
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
            this.midiSounds.cancelQueue(); // stop the current sound
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
                <button onClick={this.playVoice}>Play the current voice</button>
                <button onClick={this.playAllVoices}>Play the all the voices</button>
                <div hidden>
                    <MIDISounds ref={ref => this.midiSounds = ref} appElementName="root" instruments={[this.state.instrument]} />
                </div>
            </div>
        )
    }
}
