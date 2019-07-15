// import MidiWriter from 'midi-writer-js';
import React from 'react';
import MIDISounds from 'midi-sounds-react';

import { midiMapping } from './mappings/midiMappings';
import { durToBeats, noteToDuration } from './mappings/durationMappings';

// TO DO
// const MidiOptions = () => (
//     <div>
//         <button data-target="slide-out" className="sidenav-trigger btn">Midi Options</button>
//         <ul id="slide-out" class="sidenav">
//             <li>
//                 <div class="user-view">
//                     <div class="background">
//                         <img src="images/office.jpg" />
//                     </div>
//                     <a href="/"><img class="circle" src="images/yuna.jpg" /></a>
//                     <a href="/"><span class="white-text name">John Doe</span></a>
//                     <a href="/"><span class="white-text email">jdandturk@gmail.com</span></a>
//                 </div>
//             </li>
//             <li><a href="/"><i class="material-icons">cloud</i>First Link With Icon</a></li>
//             <li><a href="/">Second Link</a></li>
//             <li><div class="divider"></div></li>
//             <li><a class="subheader">Subheader</a></li>
//             <li><a class="waves-effect" href="/">Third Link With Waves</a></li>
//         </ul>
//     </div>
// )

export default class extends React.Component {
    state = {
        instrument: 281,
        tempo: 60,
        metronome: false,
        stateChange: false,
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
        if (this.state.metronome) this.playMetronome();
    }

    playAllVoices = () => {
        this.midiSounds.cancelQueue();
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
        if (this.state.metronome) this.playMetronome();
    }

    playMetronome = () => {
        const [beatsNum, beatsType] = this.props.timeSig.map(n => parseInt(n, 10));
        let t = this.midiSounds.contextTime();
        for (let i = 0; i < beatsNum; i++) {
            this.midiSounds.setDrumVolume(204, i === 0 ? 9/9: 3/9);
            this.midiSounds.playDrumsAt(t, [204]);
            t += (4/beatsType) * (60 / this.state.tempo);
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (!nextProps.check) return false;                                 // > dont if theres no selectedNote in new props
        else if (!this.props.check) return true;                            // > do if there is a selected note in new props
                                                                            //   and not in the old ones
        return (nextProps.check.voiceId !== this.props.check.voiceId        // > active voice changed
            || nextProps.check.noteId !== this.props.check.noteId           // > active note in a voice changed
            || nextProps.currentNote.keys !== this.props.currentNote.keys); // > active note's pitch changed
    }

    componentDidUpdate() {
        if (!this.state.stateChange && this.props.check && !this.props.currentNote.duration.includes('r')) {
            this.midiSounds.cancelQueue(); // stop the current sound
            const notes = this.props.currentNote.keys.map(note => midiMapping[note] || 109);
            const duration = durToBeats[this.props.currentNote.duration] * (60/this.state.tempo)
            this.midiSounds.playChordNow(this.state.instrument, notes, duration);
        }
        this.setState({
            stateChange: false,
        })
    }

    componentDidMount() {
        this.midiSounds.setEchoLevel(0);
        this.midiSounds.setMasterVolume(1/9);
    }

    handleChange = (e) => {
        const { name } = e.target;

        this.setState((state) => ({
            [name]: !state[name],
            stateChange: true,
        }));
        this.forceUpdate();
    }
    
    render = () => {
        return (
            <div className="row section">
                <div className="col s6">
                    <button className="waves-effect waves-light btn fill" onClick={this.playVoice}>
                        Play the current voice<i className="material-icons right">play_arrow</i>
                    </button>
                </div>
                <div className="col s5">
                    <button className="waves-effect waves-light btn fill" onClick={this.playAllVoices}>
                        Play all the voices<i className="material-icons right">play_arrow</i>
                    </button>
                </div>
                <div className="col s1">
                    <label>
                        <input type="checkbox" name="metronome" id="metronome" onChange={this.handleChange} checked={this.state.metronome} />
                        <span>Metronome</span>
                    </label>
                </div>
                {/* <div className="col s2">
                    <MidiOptions />
                </div> */}
                <div hidden>
                    <MIDISounds ref={ref => this.midiSounds = ref}
                        appElementName="root"
                        instruments={[this.state.instrument]}
                        drums={[204]} />
                </div>
            </div>
        )
    }
}
