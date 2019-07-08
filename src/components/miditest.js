import MidiWriter from 'midi-writer-js';
import React from 'react';


export default class extends React.Component {
    handleClick = () => {
        this.track = new MidiWriter.Track();

        this.note = new MidiWriter.NoteEvent({pitch: ['C3', 'G3', 'C4', 'Eb4', 'G4', 'Bb4', 'Eb5'], duration: '1'});
        this.track.addEvent(this.note);

        this.write = new MidiWriter.Writer(this.track);
        this.midiUri = this.write.dataUri();
        window.MIDIjs.play(this.midiUri);
    }

    shouldComponentUpdate = (nextProps) => {
        if (!nextProps.check) return false;
        else if (!this.props.check) return true;
        return (nextProps.check.voiceId !== this.props.check.voiceId 
            || nextProps.check.noteId !== this.props.check.noteId);
    }

    componentDidUpdate() {
        const map = {
            w: '1',
            h: '2',
            q: '4',
        }

        const note = this.props.currentNote;
        const keys = note.keys.map(n => n.replace('/', ''));
        const duration = map[note.duration] || note.duration.includes('d')
                                               ? `d${note.duration.slice(note.duration.length - 1)}`
                                               : note.duration;
        this.track = new MidiWriter.Track();

        this.note = new MidiWriter.NoteEvent({pitch: keys, duration: duration});
        this.track.addEvent(this.note);

        this.write = new MidiWriter.Writer(this.track);
        this.midiUri = this.write.dataUri();
        window.MIDIjs.play(this.midiUri);
    }
    
    render = () => {
        return (
            <button onClick={this.handleClick}>Spicy Cmin7!</button>
        )
    }
}
