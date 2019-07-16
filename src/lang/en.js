export default {
    navbar: {
        help: 'Help',
        helpContent: `Lorem ipsumdolor sit amet, consectetur adipiscing elit. 
        Suspendisse vel ex ex. In tristique, est in pharetra tristique, ex mauris suscipit nunc, ac faucibus enim arcu sit amet neque. 
        Aenean commodo lorem eu sollicitudin viverra. In nec tellus vel mi lacinia convallis sed vel augue. Integer at libero dui. 
        Curabitur at feugiat lacus, sit amet tempor orci. Sed vel purus nisl. Ut posuere nunc ac bibendum fermentum. 
        Donec ullamcorper feugiat pretium. In fringilla quis felis sed ullamcorper. Curabitur bibendum tortor ac libero vehicula, 
        id faucibus nisl eleifend. `,
        about: 'About',
        aboutContent: `Lorem ipsumdolor sit amet, consectetur adipiscing elit. 
        Suspendisse vel ex ex. In tristique, est in pharetra tristique, ex mauris suscipit nunc, ac faucibus enim arcu sit amet neque. 
        Aenean commodo lorem eu sollicitudin viverra. In nec tellus vel mi lacinia convallis sed vel augue. Integer at libero dui. 
        Curabitur at feugiat lacus, sit amet tempor orci. Sed vel purus nisl. Ut posuere nunc ac bibendum fermentum. 
        Donec ullamcorper feugiat pretium. In fringilla quis felis sed ullamcorper. Curabitur bibendum tortor ac libero vehicula, 
        id faucibus nisl eleifend. `,
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
    },
    options: {
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
                subbas: 'Subbass',
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
            clear: 'Clear ALL voices',
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
            intervalLabel: 'Biggest interval',
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