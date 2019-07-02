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
            <option value="baritone-f">Baritone (F) clef</option>
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

export const NoteDuration = (props) => (
    <table>
        <tbody>
            <tr>
                <td>
                    <input type="radio" name="duration" value="wd" id="wd" onChange={props.onChange} checked={props.duration === "wd"} />
                    <label htmlFor="wd"> Dotted wholenote</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="w" id="w" onChange={props.onChange} checked={props.duration === "w"} />
                    <label htmlFor="w"> Wholenote</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="hd" id="hd" onChange={props.onChange} checked={props.duration === "hd"} />
                    <label htmlFor="hd"> Dotted halfnote</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="h" id="h" onChange={props.onChange} checked={props.duration === "h"} />
                    <label htmlFor="h">  Halfnote</label><br />
                </td>
            </tr>
            <tr>
                <td>
                    <input type="radio" name="duration" value="qd" id="qd" onChange={props.onChange} checked={props.duration === "qd"} />
                    <label htmlFor="qd"> Dotted quarternote</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="q" id="q" onChange={props.onChange} checked={props.duration === "q"} />
                    <label htmlFor="q"> Quarternote</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="8d" id="8d" onChange={props.onChange} checked={props.duration === "8d"} />
                    <label htmlFor="8d"> Dotted eight</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="8" id="8" onChange={props.onChange} checked={props.duration === "8"} />
                    <label htmlFor="8"> Eightnote</label><br />
                </td>
            </tr>
            <tr>
                <td>
                    <input type="radio" name="duration" value="16d" id="16d" onChange={props.onChange} checked={props.duration === "16d"} />
                    <label htmlFor="16d"> Dotted sixteenth</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="16" id="16" onChange={props.onChange} checked={props.duration === "16"} />
                    <label htmlFor="16"> Sixteenth</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="32d" id="32d" onChange={props.onChange} checked={props.duration === "32d"} />
                    <label htmlFor="32d"> Dotted thirtysecond</label>
                </td>
                <td>
                    <input type="radio" name="duration" value="32" id="32" onChange={props.onChange} checked={props.duration === "32"} />
                    <label htmlFor="32"> Thirtysecond</label><br />
                </td>
            </tr>
            <tr>
                <td colSpan="4">
                    <input type="radio" name="duration" value="64" id="64" onChange={props.onChange} checked={props.duration === "64"} />
                    <label htmlFor="64"> Sixtyfourth (like somebody uses it)</label>
                </td>
            </tr>
        </tbody>
    </table>
);


export const AddNote = (props) => (
        <button onClick={props.onSubmit}>Add random note</button>
);


export const RemoveNote = (props) => (
        <button onClick={props.onClick}>Remove last note</button>
);
