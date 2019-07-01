import React from 'react';


export const ClefOptions = (props) => (
        <select className="ctrl" name="clef" value={props.clef} onChange={props.onChange}>
            <option value="treble">Treble clef</option>
            <option value="bass">Bass clef</option>
            <option value="alto">Alto clef</option>
            <option value="tenor">Tenor clef</option>
            <option value="percussion">Percussion clef</option>
            <option value="soprano">Soprano clef</option>
            <option value="mezzo-soprano">Mezzo Soprano clef</option>
            <option value="baritone-c">Baritone (C) clef</option>
            <option value="baritone-f">Bariton (F) clef</option>
            <option value="subbass">Subbass clef</option>
            <option value="french">French clef</option>
        </select>
);

export const TimeSigOptions = (props) => (
        <div>
            <input
                className="ctrl timesig"
                name="beatsNum"
                type="number"
                value={props.beatsNum}
                placeholder="4"
                onChange={props.onChange} />
            /
            <select className="ctrl" name="beatsType" value={props.beatsType} onChange={props.onChange}>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
            </select>
        </div>
);

export const KeyOptions = (props) => (
        <select className="ctrl" name="keySig" value={props.keySig} onChange={props.onChange}>
            <option value="Cb">Cb major/Ab minor</option>
            <option value="Gb">Gb major/Eb minor</option>
            <option value="Db">Db major/Bb minor</option>
            <option value="Ab">Ab major/F minor</option>
            <option value="Eb">Eb major/C minor</option>
            <option value="Bb">Bb major/G minor</option>
            <option value="F">F major/D minor</option>
            <option value="C">C major/A minor</option>
            <option value="G">G major/E minor</option>
            <option value="D">D major/B minor</option>
            <option value="A">A major/F# minor</option>
            <option value="E">E major/C# minor</option>
            <option value="B">B major/G# minor</option>
            <option value="F#">F# major/D# minor</option>
            <option value="C#">C# major/A# minor</option>
        </select>
);


export const AddNote = (props) => (
        <button onClick={props.onSubmit}>Add random note</button>
);


export const RemoveNote = (props) => (
        <button onClick={props.onClick}>Remove last note</button>
);
