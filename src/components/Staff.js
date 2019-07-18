import React from 'react';
import Vex from 'vexflow';

import keyMapping from './mappings/keyMappings';
import { colorMapping } from './mappings/colorMappings';

const VF = Vex.Flow;

export default class Staff extends React.Component {
    constructor(props) {
        super(props);
        this.staveId = this.props.id;
        this.ref = React.createRef();
        this.renderer = null;
        this.formatter = new VF.Formatter();
    }

    static accidentalWidth = {
        null: 0,
        '#': 8.86,
        'b': 7.5,
    }

    mapNote = (note) => {
        const key = this.props.stave.keySig;
        const mods = note.modifiers.slice();
        const mapping = keyMapping[key];

        for (const [i, pitch] of note.keys.entries()) {
            const symbol = pitch[0];
            const accidental = mapping[symbol.toUpperCase()];
            if (accidental) {
                // if the note contains accidental already provided with key signature - ignore it
                // if the note does not and the key signature indicates it should - add a natural
                // unless the note contains another accidental - then leave it be
                if (mods[i] === '.') mods[i] += 'n';
                else if (mods[i] !== '') mods[i] = mods[i].includes(accidental) ? mods[i].replace(accidental, '') : mods[i];
                else mods[i] = 'n';
            // getting rid of unnecessary naturals (if current line does not contain any accidentals in current key)
            } else if (mods[i].includes('n')) mods[i] = mods[i].replace('n', '');
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

    mapVoices = (measure, beatsNum, beatsType) => {
        const selected = this.props.selectedNote ? this.props.selectedNote : null;
        return measure.voices
        // mapping this object's voices array to an array of VF voices
        .map(voice => new VF.Voice({ num_beats: beatsNum, beat_value: beatsType })
            // adding notes from these voices inner array 'notes'
            .addTickables(voice.notes.map((note, i) => {
                const newNote = this.mapNote(note);
                if (selected && voice.id === selected.voiceId && i.toString() === selected.noteId && measure.id === selected.measureId) {
                    newNote.setStyle({fillStyle: '#f00', strokeStyle: '#f00'});
                } else if (voice.id === this.props.activeVoice) {
                    newNote.setStyle(colorMapping[voice.id]);
                }
                return newNote;
            }))
        )}

    renderStaff = () => {
        const beatsNum = this.props.stave.beatsNum;
        const beatsType = this.props.stave.beatsType;
        const keyMap = keyMapping[this.props.stave.keySig];

        // computing the offset generated by key signature's accidentals
        const accidentalNum = Object.keys(keyMap).length;
        const accidentalType = Object.values(keyMap)[0] || null;
        const keyOffset = accidentalNum * Staff.accidentalWidth[accidentalType];

        const context = this.renderer.getContext();
        context.clear();
        // context.scale(0.8, 0.8); // may consider scaling the stave when the window gets too small

        // neatly rendering the stave based on the width of the renderer's div
        const divWidth = this.ref.current.getBoundingClientRect().width;
        const staveWidth = (divWidth * (9/10)) / this.props.stave.measures.length; // = 90% of the div width
        const staveXOffset = divWidth * (1/20); // = 5% of the div width (which leaves another 5% on the right)

        let measures = [];
        for (const measure of this.props.stave.measures) {
            let stave;
            if (measure.id === '0') {
                stave = new VF.Stave(staveXOffset, 50, staveWidth)
                                .setClef(this.props.stave.clef)
                                .setTimeSignature(`${beatsNum}/${beatsType}`)
                                .addModifier(new VF.KeySignature(this.props.stave.keySig))
                                .setTempo({duration: 'q', dots: false, bpm: this.props.bpm}, 0);
            } else {
                const measureXOffset = (staveWidth * parseInt(measure.id, 10)) + staveXOffset;
                stave = new VF.Stave(measureXOffset, 50, staveWidth);
            }
            stave.setContext(context).draw()
            const voices = this.mapVoices(measure, beatsNum, beatsType);
            
            const beamGroups = voices.map((voice, i) => VF.Beam.generateBeams(voice.getTickables(), {
                groups: [new VF.Fraction(1, 4)],
                stem_direction: 1 * Math.pow(-1, i),
            }));
            
            if (measure.id === '0') {
                // 35 px is here due to first measure having clef and time signature
                this.formatter.joinVoices(voices).format(voices, staveWidth - staveXOffset - keyOffset - 35);
            } else {
                this.formatter.joinVoices(voices).format(voices, staveWidth - staveXOffset)
            }

            voices.forEach((v, i) => {
                v.draw(context, stave);
                beamGroups[i].forEach(beam => {
                    if (i.toString() === this.props.activeVoice) beam.setStyle(colorMapping[i]);
                    beam.setContext(context).draw();
                });
            });
            measures.push(stave);
        }

    }

    componentDidMount() {
        const div = this.ref.current;

        this.renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        this.renderer.resize(div.getBoundingClientRect().width, 200);
        window.addEventListener('resize', () => {
            const div = this.ref.current;
            this.renderer.resize(div.getBoundingClientRect().width, 200);
            this.renderStaff();
        })

        this.renderStaff();
    }

    componentDidUpdate(nextProps) {
        this.renderStaff();
        if (nextProps.stave.measures.length !== this.props.stave.measures.length) {
            this.props.getBarLines(document.getElementById(`stave${this.staveId}`).childNodes[0]);
        }
    }

    render() {
        return <div ref={this.ref} id={`stave${this.staveId}`} />;
    }
};
