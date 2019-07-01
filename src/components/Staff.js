import React from 'react';
import Vex from 'vexflow';

import { connect } from 'react-redux';
import './Staff.css';
import { Cb, Gb, Db, Ab, Eb, Bb, F, C, G, D, A, E, B, Fsh, Csh } from './mappings/keyMappings';

const VF = Vex.Flow;

const mapStateToProps = state => ({
    ...state.staves[0],
});

class Staff extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.renderer = null;
        this.stave = null;
        this.formatter = new VF.Formatter();
        this.staveWidth = 700;
    }

    mapVoices = (beatsNum, beatsType) => this.props.voices
        // mapping this object's voices array to an array of VF voices
        .map(voice => new VF.Voice({ num_beats: beatsNum, beat_value: beatsType })
            // adding notes from these voices inner array 'notes'
            .addTickables(voice.notes.map((note) => {
                // initializing a single note to ba added to the voice
                const staveNote = new VF.StaveNote(note);
                // checking if this note has any accidentals/modifiers attached to it (see note.modifiers)
                if (note.modifiers.length > 0) {
                    for (const [i, mod] of note.modifiers.entries()) {
                        // applying according modifiers
                        if (mod === '.') staveNote.addDot(i);
                        else if (mod.includes('.')) staveNote.addAccidental(i, new VF.Accidental(mod.replace('.', ''))).addDot(i);
                        else if (mod) staveNote.addAccidental(i, new VF.Accidental(mod.replace('.', '')));
                    }
                }
                return staveNote;
            })),
        )

    renderStaff = () => {
        const beatsNum = this.props.beatsNum;
        const beatsType = this.props.beatsType;

        console.log(this.props);

        this.stave = new VF.Stave(10, 90, this.staveWidth)
                            .setClef(this.props.clef)
                            .setTimeSignature(`${this.props.beatsNum}/${this.props.beatsType}`)
                            .addModifier(new VF.KeySignature(this.props.keySig));

        const context = this.renderer.getContext();

        const voices = this.mapVoices(beatsNum, beatsType);

        try {
            this.formatter.joinVoices(voices).format(voices, this.staveWidth);
        } catch {
            console.log("Voice invalid, notes:");
            console.table(this.props.voices[0].notes);
            return;
        }

        context.clear();
        this.stave.setContext(context).draw();
        voices.forEach(v => v.draw(context, this.stave));
    }

    componentDidMount() {
        const div = this.ref.current;

        this.renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        this.renderer.resize(800, 200);

        this.renderStaff();
    }

    componentDidUpdate() {
        for (const voice of this.props.voices) {
            for (const note of voice.notes) {
                note.clef = this.props.clef;
            }
        }

        this.renderStaff();
    }

    render() {
        const message = 'Everything OK.';

        return (
            <div>
                <div className="message">
                    {message}
                </div>
                <div ref={this.ref} className="mainField" />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    null,
)(Staff);
