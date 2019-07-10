import React from 'react';

export const ClefOptions = (props) => (
    <div className="input-field">
        <select name="clef" value={props.clef} onChange={props.onChange}>
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
        <label>Select clef type</label>
    </div>
)

export const TimeSigOptions = (props) => (
    <div>
        <div className="input-field">
            <input
                name="beatsNum"
                id="beatsNum"
                type="number"
                className="validate"
                value={props.beatsNum}
                placeholder="4"
                onChange={props.onChange} />
                <label htmlFor="beatsNum">Number of beats</label>
        </div>
        <div className="input-field">
            <select id="beatsType" name="beatsType" value={props.beatsType} onChange={props.onChange}>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
            </select>
            <label htmlFor="beatsType">Beats type</label>
        </div>
    </div>
)

export const KeyOptions = (props) => (
    <div className="input-field">
        <select name="keySig" value={props.keySig} onChange={props.onChange}>
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
        <label>Select key signature</label>
    </div>
);

export const NoteDuration = (props) => (
    <div className="center-align">
        <label>
            <input type="radio" name="duration" value="w" id="w" onChange={props.onChange} checked={props.duration === "w"} />
            <span>Wholenote&nbsp;&nbsp;&nbsp;</span>
        </label>
        <label>
            <input type="radio" name="duration" value="h" id="h" onChange={props.onChange} checked={props.duration === "h"} />
            <span>Halfnote&nbsp;&nbsp;&nbsp;</span>
        </label>
        <label>
            <input type="radio" name="duration" value="q" id="q" onChange={props.onChange} checked={props.duration === "q"} />
            <span>Quarternote&nbsp;&nbsp;&nbsp;</span>
        </label>
        <label>
            <input type="radio" name="duration" value="8" id="8" onChange={props.onChange} checked={props.duration === "8"} />
            <span>Eightnote&nbsp;&nbsp;&nbsp;</span>
        </label>
        <label>
            <input type="radio" name="duration" value="16" id="16" onChange={props.onChange} checked={props.duration === "16"} />
            <span>Sixteenth&nbsp;&nbsp;&nbsp;</span>
        </label>
        <label>
            <input type="radio" name="duration" value="32" id="32" onChange={props.onChange} checked={props.duration === "32"} />
            <span>Thirtysecond&nbsp;&nbsp;&nbsp;</span>
        </label>
        <label>
            <input type="radio" name="duration" value="64" id="64" onChange={props.onChange} checked={props.duration === "64"} />
            <span>Sixtyfourth (like somebody uses it)</span>
        </label>
        <br />
        <label>
            <input type="checkbox" name="dotted" id="dotted" onChange={props.onChange} checked={props.dotted} />
            <span>Dotted&nbsp;&nbsp;&nbsp;</span>
        </label>
        <label>
            <input type="checkbox" name="restMode" id="rest" onChange={props.onChange} checked={props.restMode} />
            <span>Rest</span>
        </label>
    </div>
);


export const AddRandomNote = (props) => (
    <button className="waves-effect waves-light btn" onClick={props.onSubmit}>Add random note</button>
);


export const RemoveNote = (props) => (
    <button className="waves-effect waves-light btn" onClick={props.onClick}>Remove last note</button>
);

const numMapping = ['First', 'Second', 'Third', 'Fourth']

export const Voices = (props) => (
    <div>
        Select voice:
        {props.voices.map((voice) => (
            <div key={voice.id}>
                <label>
                <input type="radio"
                    name="currentVoice"
                    value={voice.id}
                    id={voice.id}
                    onChange={props.onChange}
                    checked={props.currentVoice === voice.id} />
                <span>{numMapping[voice.id]}</span>
                </label>
            </div>
        ))}
    </div>
);

export const AddRemoveVoice = (props) => (
    <div>
        <button className="waves-effect waves-light btn" name="addVoice" value={props.newVoiceId} onClick={props.addVoice}>
            Add voice
        </button><br />
        <button className="waves-effect waves-light btn" name="removeVoice" value={props.newVoiceId - 1} onClick={props.removeVoice}>
            Remove voice
        </button><br />
        <button className="waves-effect waves-light btn" name="clearVoices" onClick={props.clearVoices}>
            Clear ALL voices
        </button>
    </div>
);
