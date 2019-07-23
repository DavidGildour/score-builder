import React from 'react';
import MidiWriter from 'midi-writer-js';

import { VFDurToMidi } from './mappings/durationMappings';

export default class extends React.Component {
    saveMidi = () => {
        const tracks = this.props.measures[0].voices.map(_ => (
            new MidiWriter.Track()
            .setTempo(parseInt(this.props.bpm, 10))
            .setTimeSignature(this.props.timeSig[0], this.props.timeSig[1])
        ));

        for (const measure of this.props.measures) {
            for (const voice of measure.voices) {
                tracks[voice.id].addEvent(voice.notes.map(note => {
                    const duration = note.duration.includes('r') ? 'wait' : 'duration';
                    return new MidiWriter.NoteEvent({
                        pitch: note.keys.map(key => key.replace('/', '')),
                        duration: VFDurToMidi[note.duration.replace('r', '')],
                        [duration]: VFDurToMidi[note.duration.replace('r', '')], // every note needs 'duration' field, but rests need additional 'wait' wtf
                    })
                }));
            }
        }

        const write = new MidiWriter.Writer(tracks);

        const downloader = document.createElement('a');
        downloader.setAttribute('href', write.dataUri());
        downloader.setAttribute('download', 'score.mid');

        downloader.style.display = 'none';
        document.body.appendChild(downloader);

        downloader.click();

        document.body.removeChild(downloader);
    }

    render = () => (
        <button
            className="btn-floating waves-effect tooltipped"
            data-position="right"
            data-tooltip={this.props.text}
            onClick={this.saveMidi}>
            <i className="material-icons">save_alt</i>
        </button>
    )
};
