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
        instrument: 2,
        bpm: 30,
        metronome: false,
        stateChange: false,
    }

    playVoice = () => {
        this.midiSounds.cancelQueue();
        if (!this.props.check) return;
        let t = this.midiSounds.contextTime();
        for (const measure of this.props.measures){
            if (this.state.metronome) this.playMetronomeAt(t);
            const voice =  measure.voices[this.props.check.voiceId];
            for (const note of voice.notes) {
                if (!note.duration.includes('r')) {
                    this.midiSounds.playBeatAt(t, [
                        [],
                        [[this.state.instrument, note.keys.map(pitch => midiMapping[pitch]), noteToDuration[note.duration]]]
                    ], this.state.bpm);
                }
                t += durToBeats[note.duration.replace('r', '')] * (60 / this.state.bpm);
            }
        }
    }

    playAllVoices = () => {
        this.midiSounds.cancelQueue();
        let t = this.midiSounds.contextTime();
        for (const measure of this.props.measures) {
            if (this.state.metronome) this.playMetronomeAt(t);
            const voices = measure.voices;
            let m_t;
            for (const voice of voices) {
                m_t = t;
                for (const note of voice.notes) {
                    if (!note.duration.includes('r')) {
                        this.midiSounds.playBeatAt(m_t, [
                            [],
                            [[this.state.instrument, note.keys.map(pitch => midiMapping[pitch]), noteToDuration[note.duration]]]
                        ], this.state.bpm);
                    }
                    m_t += durToBeats[note.duration.replace('r', '')] * (60 / this.state.bpm);
                }
            }
            t = m_t;
        }
        
    }

    playMetronomeAt = (when) => {
        const [beatsNum, beatsType] = this.props.timeSig.map(n => parseInt(n, 10));
        let t = when;
        for (let i = 0; i < beatsNum; i++) {
            this.midiSounds.setDrumVolume(204, i === 0 ? 9/9: 3/9);
            this.midiSounds.playDrumsAt(t, [204]);
            t += (4/beatsType) * (60 / this.state.bpm);
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.lang !== nextProps.lang) {                           // > do if only language changed
            this.setState({ stateChange: true });
            return true;
        }
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
            const duration = durToBeats[this.props.currentNote.duration] * (60/this.state.bpm)
            this.midiSounds.playChordNow(this.state.instrument, notes, duration);
        }
        this.setState({
            stateChange: false,
        })
    }

    componentDidMount() {
        this.midiSounds.setEchoLevel(0);
        this.midiSounds.setMasterVolume(1/9);
        // computing pixel shift per one bpm for tempo indicator
        this.tempoFactor = (document.getElementById('tempo').getBoundingClientRect().width - 14)/170;
        window.addEventListener('resize', () => {
            this.tempoFactor = (document.getElementById('tempo').getBoundingClientRect().width - 14)/170;
            this.forceUpdate();
        });
    }

    handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            this.setState((state) => ({
                [name]: !state[name],
                stateChange: true,
            }));
        } else {
            this.props.setParentState(e);
            this.setState({
                [name]: [value],
                stateChange: true,
            });
        }
        this.forceUpdate();
    }
    
    render = () => {
        return (
            <div>
                <div className="row">
                    <p className="range-field">
                        <input type="range" style={{border: 'none'}} id="tempo" name="bpm" min="30" max="200" value={this.state.bpm} onChange={this.handleChange} />
                        <span className="thumb active" style={{
                                                        height: '30px',
                                                        width: '30px',
                                                        top: '-30px',
                                                        marginLeft: '-7px',
                                                        left: (this.state.bpm - 30)*this.tempoFactor || 0}}>
                            <span className="value">{this.state.bpm}</span>
                        </span>
                    </p>
                </div>
                <div className="row">
                    <div className="col s5">
                        <button className="waves-effect waves-light btn fill" onClick={this.playVoice}>
                            {this.props.lang.playVoice}<i className="material-icons right">play_arrow</i>
                        </button>
                    </div>
                    <div className="col s4">
                        <button className="waves-effect waves-light btn fill" onClick={this.playAllVoices}>
                        {this.props.lang.playAll}<i className="material-icons right">play_arrow</i>
                        </button>
                    </div>
                    <div className="col s1 center-align" style={{marginTop: '-3px'}}>
                        <button className="waves-effect waves-light btn-floating" onClick={() => this.midiSounds.cancelQueue()}>
                            <i className="material-icons">stop</i>
                        </button>
                    </div>
                    <div className="col s2">
                        <label>
                            <input type="checkbox"
                                name="metronome"
                                id="metronome"
                                onChange={this.handleChange}
                                checked={this.state.metronome} />
                            <span style={{marginTop: '7px'}}>{this.props.lang.metro}</span>
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
            </div>
        )
    }
}
