import React from 'react';
import Vex from 'vexflow';

import { connect } from 'react-redux';
import './Staff.css';
import keyMapping from './mappings/keyMappings';
import { colorMapping } from './mappings/colorMappings';

const VF = Vex.Flow;

const mapStateToProps = state => ({
    staves: state.staves,
});

class Staff extends React.Component {
    constructor(props) {
        super(props);
        this.staveId = this.props.id;
        this.ref = React.createRef();
        this.renderer = null;
        this.stave = null;
        this.formatter = new VF.Formatter();
        this.staveWidth = 1200;
    }

    mapNote = (note) => {
        const key = this.props.staves[this.staveId].keySig;
        const mods = note.modifiers.slice();
        const mapping = keyMapping[key];

        for (const [i, pitch] of note.keys.entries()) {
            const symbol = pitch[0];
            const accidental = mapping[symbol.toUpperCase()];
            if (accidental) {
                if (mods[i] !== '') mods[i] = mods[i].replace(accidental, '');
                else mods[i] = 'n';
            }
        }

        // initializing a single note to ba added to the voice
        const staveNote = new VF.StaveNote(note);
        // checking if this note has any accidentals/modifiers attached to it (see note.modifiers)
        if (mods.length > 0) {
            for (const [i, mod] of mods.entries()) {
                // applying according modifiers
                if (note.duration.includes('r')) { // rests do not need accidentals
                    if (mod.includes('.')) staveNote.addDot(i);
                } else {
                    if (mod === '.') staveNote.addDot(i);
                    else if (mod.includes('.')) staveNote.addAccidental(i, new VF.Accidental(mod.replace('.', ''))).addDot(i);
                    else if (mod) staveNote.addAccidental(i, new VF.Accidental(mod.replace('.', '')));
                }
            }
        }
        return staveNote;
    }

    mapVoices = (beatsNum, beatsType) => {
        const selected = this.props.selectedNote ? this.props.selectedNote : null;
        return this.props.staves[this.staveId].voices
        // mapping this object's voices array to an array of VF voices
        .map(voice => new VF.Voice({ num_beats: beatsNum, beat_value: beatsType })
            // adding notes from these voices inner array 'notes'
            .addTickables(voice.notes.map(note => {
                const newNote = this.mapNote(note);
                if (selected && voice.id === selected.voiceId && voice.notes.indexOf(note).toString() === selected.noteId) {
                    newNote.setStyle({fillStyle: '#f00', strokeStyle: '#f00'});
                } else if (voice.id === this.props.activeVoice) {
                    newNote.setStyle(colorMapping[voice.id]);
                }
                return newNote;
            })))
        }

    renderStaff = () => {
        const beatsNum = this.props.staves[this.staveId].beatsNum;
        const beatsType = this.props.staves[this.staveId].beatsType;

        // console.log(this.props);

        this.stave = new VF.Stave(10, 50, this.staveWidth)
                            .setClef(this.props.staves[this.staveId].clef)
                            .setTimeSignature(`${beatsNum}/${beatsType}`)
                            .addModifier(new VF.KeySignature(this.props.staves[this.staveId].keySig));

        const context = this.renderer.getContext();

        const voices = this.mapVoices(beatsNum, beatsType);

        try {
            this.formatter.joinVoices(voices).format(voices, this.staveWidth);
        } catch {
            console.log("Voice invalid, notes:");
            console.table(this.props.staves[this.staveId].voices[0].notes);
            return;
        }
        context.clear();

        this.stave.setContext(context).draw();
        voices.forEach(v => v.draw(context, this.stave));
    }

    componentDidMount() {
        const div = this.ref.current;

        this.renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        this.renderer.resize(1500, 200);

        this.renderStaff();
    }

    componentDidUpdate() {
        for (const voice of this.props.staves[this.staveId].voices) {
            for (const note of voice.notes) {
                note.clef = this.props.staves[this.staveId].clef;
            }
        }

        this.renderStaff();
    }

    render() {
        return <div ref={this.ref} id={`stave${this.staveId}`} />;
    }
}

export default connect(
    mapStateToProps,
    null,
)(Staff);
