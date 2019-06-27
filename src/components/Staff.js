import React from 'react';
import Vex from 'vexflow';

import './Staff.css';

const VF = Vex.Flow;

const noteToDuration = {
    w: 1,
    wd: 1.5,
    h: 0.5,
    hd: 0.75,
    q: 0.25,
    qd: 0.375,
    8: 0.125,
    '8d': 0.1875,
    16: 0.0625,
    '16d': 0.09175,
    32: 0.03125,
    '32d': 0.046875,
};

const durationToNote = {
    1.5: 'wd',
    1: 'w',
    0.75: 'hd',
    0.5: 'h',
    0.375: 'qd',
    0.25: 'q',
    0.1875: '8d',
    0.125: '8',
    0.09175: '16d',
    0.0625: '16',
    0.046875: '32d',
    0.03125: '32',
};

class Staff extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.renderer = null;
        this.stave = null;
        this.formatter = new VF.Formatter();
        this.staveWidth = 700;
        this.voices = [
            {
                // every note has a 'modifiers' field that is used to map a single key from this note to
                // corresponding modifier with the same index as a note.
                // That's why sometimes 'modifiers' array have an empty element
                notes: [
                    {
                        clef: props.clef,
                        keys: ['e##/5'],
                        duration: '8d',
                        modifiers: ['##.'],
                    },
                    {
                        clef: props.clef,
                        keys: ['eb/5'],
                        duration: '16',
                        modifiers: ['b'],
                    },
                    {
                        clef: props.clef,
                        keys: ['d/5', 'eb/4'],
                        duration: 'h',
                        modifiers: ['.', ''],
                    },
                    {
                        clef: props.clef,
                        keys: ['c/5', 'eb/5', 'g#/5'],
                        duration: 'q',
                        modifiers: ['.', 'b.', '#.'],
                    },
                ],
            },
            // {
            //     notes: [
            //         {
            //             clef: props.clef,
            //             keys: ['c/4'],
            //             duration: 'w',
            //             modifiers: [''],
            //         },
            //     ],
            // },
        ];
    }

    voiceDurationIsVaild = (voice) => {
        const expectedDuration = this.props.beatsNum * (1 / this.props.beatsType);
        let voiceDuration = 0;
        for (const note of voice.notes) {
            voiceDuration += noteToDuration[note.duration.replace('r', '')];
        }
        if (voiceDuration !== expectedDuration) {
            return expectedDuration - voiceDuration;
        }
        return 0;
    }

    populateVoiceWithRests = (voice, lackingDuration) => {
        let remainingDuration = lackingDuration;
        while (remainingDuration !== 0) {
            for (const duration of Object.keys(durationToNote)) {
                if (duration <= remainingDuration) {
                    remainingDuration -= duration;
                    voice.notes.push({
                        clef: this.props.clef,
                        keys: ['d/5'],
                        duration: `${durationToNote[duration]}r`,
                        modifiers: [''],
                    });
                    break;
                }
            }
        }
    }

    mapVoices = (beatsNum, beatsType) => this.voices
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

        for (const voice of this.voices) {
            const lackingDuration = this.voiceDurationIsVaild(voice);
            if (lackingDuration > 0) {
                this.populateVoiceWithRests(voice, lackingDuration);
            } else if (lackingDuration < 0) {
                // This is a quick bug fix, definetely meant for REFACTORING
                while (this.voiceDurationIsVaild(voice) < 0) {
                    voice.notes.pop();
                }
                while (this.voiceDurationIsVaild(voice) > 0) {
                    this.populateVoiceWithRests(voice, this.voiceDurationIsVaild(voice));
                }
            }
        }

        this.stave = new VF.Stave(10, 90, this.staveWidth)
                            .setClef(this.props.clef)
                            .setTimeSignature(this.props.timeSig)
                            .addModifier(new VF.KeySignature(this.props.keySig));

        const context = this.renderer.getContext();

        context.clear();

        const voices = this.mapVoices(beatsNum, beatsType);

        this.formatter.joinVoices(voices).format(voices, this.staveWidth);

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
        for (const voice of this.voices) {
            for (const note of voice.notes) {
                note.clef = this.props.clef;
            }
        }

        this.renderStaff();
    }

    render() {
        let message = 'Everything OK.';

        for (const voice of this.voices) {
            if (this.voiceDurationIsVaild(voice) !== 0) {
                message = 'Invalid voice duration!';
                break;
            }
        }

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

export default Staff;
