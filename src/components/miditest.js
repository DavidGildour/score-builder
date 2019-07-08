import MidiWriter from 'midi-writer-js';
import React from 'react';


export default class extends React.Component {
    handleClick = () => {
        const track = new MidiWriter.Track();

        const note = new MidiWriter.NoteEvent({pitch: ['C3', 'G3', 'C4', 'Eb4', 'G4', 'Bb4', 'Eb5'], duration: '1'});
        track.addEvent(note);

        const write = new MidiWriter.Writer(track);
        const midiUri = write.dataUri();
        window.MIDIjs.play(midiUri);
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
        if (!duration.includes('r')) {
            const track = new MidiWriter.Track();

            const note = new MidiWriter.NoteEvent({pitch: keys, duration: duration});
            track.addEvent(note);
    
            const write = new MidiWriter.Writer(track);
            const midiUri = write.dataUri();
            window.MIDIjs.play(midiUri);
        };
    }
    
    render = () => {
        return (
            <button onClick={this.handleClick}>Spicy Cmin7!</button>
        )
    }
}
