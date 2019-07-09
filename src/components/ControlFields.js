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
    <div>
        <input type="radio" name="duration" value="w" id="w" onChange={props.onChange} checked={props.duration === "w"} />
        <label htmlFor="w"> Wholenote</label>
    
        <input type="radio" name="duration" value="h" id="h" onChange={props.onChange} checked={props.duration === "h"} />
        <label htmlFor="h">  Halfnote</label>
    
        <input type="radio" name="duration" value="q" id="q" onChange={props.onChange} checked={props.duration === "q"} />
        <label htmlFor="q"> Quarternote</label>
        <input type="radio" name="duration" value="8" id="8" onChange={props.onChange} checked={props.duration === "8"} />
        <label htmlFor="8"> Eightnote</label>
        <input type="radio" name="duration" value="16" id="16" onChange={props.onChange} checked={props.duration === "16"} />
        <label htmlFor="16"> Sixteenth</label>
        <input type="radio" name="duration" value="32" id="32" onChange={props.onChange} checked={props.duration === "32"} />
        <label htmlFor="32"> Thirtysecond</label>
        <input type="radio" name="duration" value="64" id="64" onChange={props.onChange} checked={props.duration === "64"} />
        <label htmlFor="64"> Sixtyfourth (like somebody uses it)</label>
        <br />
        <input type="checkbox" name="dotted" id="dotted" onChange={props.onChange} checked={props.dotted} />
        <label htmlFor="dotted"> Dotted</label>
        <input type="checkbox" name="restMode" id="rest" onChange={props.onChange} checked={props.restMode} />
        <label htmlFor="rest"> Rest</label>
    </div>
);


export const AddRandomNote = (props) => (
        <button onClick={props.onSubmit}>Add random note</button>
);


export const RemoveNote = (props) => (
        <button onClick={props.onClick}>Remove last note</button>
);

const numMapping = ['First', 'Second', 'Third', 'Fourth']

export const Voices = (props) => (
    <div>
        Select voice:
        {props.voices.map((voice) => (
            <div key={voice.id}>
                <input type="radio"
                    name="currentVoice"
                    value={voice.id}
                    id={voice.id}
                    onChange={props.onChange}
                    checked={props.currentVoice === voice.id} />
                <label htmlFor={voice.id}> {numMapping[voice.id]}</label>
            </div>
        ))}
    </div>
);

export const AddRemoveVoice = (props) => (
    <div>
        <button name="addVoice" value={props.newVoiceId} onClick={props.addVoice}>
            Add voice
        </button><br />
        <button name="removeVoice" value={props.newVoiceId - 1} onClick={props.removeVoice}>
            Remove voice
        </button><br />
        <button name="clearVoices" onClick={props.clearVoices}>
            Clear ALL voices
        </button>
    </div>
);
