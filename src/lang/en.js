export default {
    author: 'Application author: ',
    navbar: {
        close: 'Close',
        help: 'Help',
        helpContent: [
            `Click on the stave to add a note.`,
            `To change the duration and type of the note to be added choose one of the options above the stave.`,
            `Click on the note to select it. 
            Arrows up and down as well as 'PageUp' and 'PageDown' keys change the pitch of the selected note 
            by a halfstep and octave accordingly. Arrows left and right change the selected note to its neighbour in a current voice.`,
            `To remove a note from the stave either press 'Remove Last Note' button, or press 'Delete' key to remove selected note.`,
            `To change the current voice, either click on a note of that voice, select it from the dropdown list, 
            or press 'Tab' ('Shift' + 'Tab') to switch to the next (previous) voice.
            'Remove Voice' button removes the last added voice (however, only if that voice is empty). 
            'Clear All' button removes every note from EVERY active voice. Use with caution!`,
            `To change the playback tempo use the slider beneath the stave. 'Metronome' checkbox toggles metronome playing alongside the track.`,
            `This app gives the option to randomly generate a melody in every voice in somehow controlled way.
            'Allow Rests' checkbox determines whether the melody will include rests. 'Diatonic' checkbox determines whether the melody will include
            only notes from the current key (will be diatonic) or notes from the entire chromatic scale (will not be diatonic).
            'Shortest' and 'Longest note' dropdowns allow to set the shortest and longest available note duration in the melody, accordingly.
            'Largest interval' dropdown serves as a control over the largest available interval between 
            two neighbouring notes in a voice (melodic interval).
            This does not control the harmonic interval between voices.
            Additionally the generated melody will not include notes higher than one line above the highest 
            and lower than one line beneath the lowest line in the current clef.`
        ],
        about: 'About',
        aboutContent: [
            `Welcome to Score Builder!`,
            `Score Builder is a web application that enables for creating and editing musical notation on every device with web browser that 
            supports JavaScript.`,
            `Application interface is written entirely in React.js framework, version 16.8.6.
            It uses various other JavaScript and CSS libraries, such as:`,
            `- VexFlow v1.2.89`,
            `- midi-sounds-react v1.2.54`,
            `- Materialize CSS v1.0.0`,
            `From this place I would like to thank every wonderful person involved in developing these libraries; without you this app wouldn't exist!
            I would like to thank the creator of VexFlow - Mohit Muthanna Cheppudira - in particular for incredibly well documented and powerful
            library for rendering musical notation. It does everything you'd want it to do, and more!`
        ],
        lang: 'Language',
    },
    noteNames: {
        wd: 'Dotted wholenote',
        w: 'Wholenote',
        hd: 'Dotted halfnote',
        h: 'Halfnote',
        qd: 'Dotted quarternote',
        q: 'Quarternote',
        '8d': 'Dotted eightnote',
        '8': 'Eightnote',
        '16d': 'Dotted sixteenth',
        '16': 'Sixteenth',
        '32d': 'Dotted thirtysecond',
        '32': 'Thirtysecond',
        '64': 'Sixtyfourth',
    },
    noteModifiers: {
        dot: 'Dotted',
        rest: 'Rest',
    },
    player: {
        playVoice: 'Play the current voice',
        playAll: 'Play all the voices',
        metro: 'Metronome',
        save: 'Save to file'
    },
    options: {
        errors: {
            maxVoices: 'Maximum of four voices reached.',
            minVoices: 'Minimum one voice required.',
            voiceNotEmpty: 'Voice is not empty.',
            voicesNotEmpty: 'You need to clear the voices first.',
            shortGreaterThanLong: 'Shortest note duration exceeds the longest.',
            noSelectedNote: 'Select a note to edit first.',
        },
        addMode: 'Add',
        editMode: 'Edit',
        measure: 'Measure',
        clef: {
            label: 'Select clef type',
            clefs: {
                treble: 'Treble',
                bass: 'Bass',
                alto: 'Alto',
                tenor: 'Tenor',
                percussion: 'Percussion',
                soprano: 'Soprano',
                mezzoSoprano: 'Mezzo soprano',
                baritone_c: 'Baritone (C)',
                baritone_f: 'Baritone (F)',
                subbass: 'Subbass',
                french: 'French',
            }
        },
        key: {
            label: 'Select key signature',
            keys: {
                Cb: 'Cb maj/Ab min',
                Gb: 'Gb maj/Eb min',
                Db: 'Db maj/Bb min',
                Ab: 'Ab maj/F min',
                Eb: 'Eb maj/C min',
                Bb: 'Bb maj/G min',
                F: 'F maj/D min',
                C: 'C maj/A min',
                G: 'G maj/E min',
                D: 'D maj/B min',
                A: 'A maj/F# min',
                E: 'E maj/C# min',
                B: 'B maj/G# min',
                Fsh: 'F# maj/D# min',
                Csh: 'C# maj/A# min',
            }
        },
        time: {
            numLabel: 'Beats number',
            typeLabel: 'Beats type'
        },
        voices: {
            add: 'Add voice',
            remove: 'Remove voice',
            clear: 'Clear ALL',
            mapping: ['First', 'Second', 'Third', 'Fourth'],
            label: 'Select voice',
        },
        notes: {
            add: 'Add random note',
            remove: 'Remove last note',
        },
        melody: {
            rests: 'Allow rests',
            diatonic: 'Diatonic',
            shortLabel: 'Shortest note',
            longLabel: 'Longest note',
            intervalLabel: 'Largest interval',
            generate: 'Generate melody',
            intervals: {
                m2: 'Minor second',
                M2: 'Major second',
                m3: 'Minor third',
                M3: 'Major third',
                P4: 'Perfect fourth',
                A4: 'Tritone',
                P5: 'Perfect fifth',
                m6: 'Minor sixth',
                M6: 'Major sixth',
                m7: 'Minor seventh',
                M7: 'Major seventh',
                P8: 'Perfect octave',
            }
        }
    }
};