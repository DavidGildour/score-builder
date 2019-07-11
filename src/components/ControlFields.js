import React from 'react';
import M from 'materialize-css/dist/js/materialize.min';

export const ClefOptions = (props) => (
    <div className="input-field">
        <select name="clef" value={props.clef} onChange={props.onChange}>
            <option value="treble" data-icon={process.env.PUBLIC_URL + '/clefs/treble.png'}>Treble</option>
            <option value="bass" data-icon={process.env.PUBLIC_URL + '/clefs/bass.png'}>Bass</option>
            <option value="alto" data-icon={process.env.PUBLIC_URL + '/clefs/alto.png'}>Alto</option>
            <option value="tenor" data-icon={process.env.PUBLIC_URL + '/clefs/tenor.png'}>Tenor</option>
            <option value="percussion" data-icon={process.env.PUBLIC_URL + '/clefs/percussion.png'}>Percussion</option>
            <option value="soprano" data-icon={process.env.PUBLIC_URL + '/clefs/soprano.png'}>Soprano</option>
            <option value="mezzo-soprano" data-icon={process.env.PUBLIC_URL + '/clefs/mezzosoprano.png'}>Mezzo Soprano</option>
            <option value="baritone-c" data-icon={process.env.PUBLIC_URL + '/clefs/baritone-c.png'}>Baritone (C)</option>
            <option value="baritone-f" data-icon={process.env.PUBLIC_URL + '/clefs/baritone-f.png'}>Baritone (F)</option>
            <option value="subbass" data-icon={process.env.PUBLIC_URL + '/clefs/subbass.png'}>Subbass</option>
            <option value="french" data-icon={process.env.PUBLIC_URL + '/clefs/french.png'}>French</option>
        </select>
        <label>Select clef type</label>
    </div>
)

export const TimeSigOptions = (props) => (
    <div className="row">
        <div className="col s6">
            <div className="input-field">
                <input
                    name="beatsNum"
                    id="beatsNum"
                    type="number"
                    className="validate"
                    value={props.beatsNum}
                    placeholder="4"
                    onChange={props.onChange} />
                    <label htmlFor="beatsNum">Beats number</label>
            </div>
        </div>
        <div className="col s6">
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
    </div>
)

export const KeyOptions = (props) => (
    <div className="input-field">
        <select name="keySig" value={props.keySig} onChange={props.onChange}>
            <option value="Cb" data-icon={process.env.PUBLIC_URL + '/keys/Cb.png'}>Cb maj/Ab min</option>
            <option value="Gb" data-icon={process.env.PUBLIC_URL + '/keys/Gb.png'}>Gb maj/Eb min</option>
            <option value="Db" data-icon={process.env.PUBLIC_URL + '/keys/Db.png'}>Db maj/Bb min</option>
            <option value="Ab" data-icon={process.env.PUBLIC_URL + '/keys/Ab.png'}>Ab maj/F min</option>
            <option value="Eb" data-icon={process.env.PUBLIC_URL + '/keys/Eb.png'}>Eb maj/C min</option>
            <option value="Bb" data-icon={process.env.PUBLIC_URL + '/keys/Bb.png'}>Bb maj/G min</option>
            <option value="F" data-icon={process.env.PUBLIC_URL + '/keys/F.png'}>F maj/D min</option>
            <option value="C" data-icon={process.env.PUBLIC_URL + '/keys/C.png'}>C maj/A min</option>
            <option value="G" data-icon={process.env.PUBLIC_URL + '/keys/G.png'}>G maj/E min</option>
            <option value="D" data-icon={process.env.PUBLIC_URL + '/keys/D.png'}>D maj/B min</option>
            <option value="A" data-icon={process.env.PUBLIC_URL + '/keys/A.png'}>A maj/F# min</option>
            <option value="E" data-icon={process.env.PUBLIC_URL + '/keys/E.png'}>E maj/C# min</option>
            <option value="B" data-icon={process.env.PUBLIC_URL + '/keys/B.png'}>B maj/G# min</option>
            <option value="F#" data-icon={process.env.PUBLIC_URL + '/keys/Fsh.png'}>F# maj/D# min</option>
            <option value="C#" data-icon={process.env.PUBLIC_URL + '/keys/Csh.png'}>C# maj/A# min</option>
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
    <button className="waves-effect waves-light btn fill" onClick={props.onSubmit}>
        Add random note <i className="material-icons right">cached</i>
    </button>
);


export const RemoveNote = (props) => (
    <button className="waves-effect waves-light btn fill" onClick={props.onClick}>
        Remove last note <i className="material-icons right">remove</i>
    </button>
);

export class Voices extends React.Component {
    static numMapping = ['First', 'Second', 'Third', 'Fourth'];

    componentDidUpdate = () => {
        M.AutoInit();
    }

    render = () => (
        <div className="input-field">
            <select name="currentVoice" value={this.props.currentVoice} onChange={this.props.onChange}>
            {this.props.voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                    {Voices.numMapping[voice.id]}
                </option>
            ))}
            </select>
            <label>Select voice</label>
        </div>
    )
};

export const AddRemoveVoice = (props) => (
    <div className="row top-margin">
        <div className="col s4">
            <button className="waves-effect waves-light btn fill" name="addVoice" value={props.newVoiceId} onClick={props.addVoice}>
                Add voice <i className="material-icons right">add</i>
            </button>
        </div>
        <div className="col s4">
            <button className="waves-effect waves-light btn fill" name="removeVoice" value={props.newVoiceId - 1} onClick={props.removeVoice}>
                Remove<i className="material-icons right">remove</i>
            </button>
        </div>
        <div className="col s4">
            <button className="waves-effect waves-light btn fill" name="clearVoices" onClick={props.clearVoices}>
                Clear ALL<i className="material-icons right">clear</i>
            </button>
        </div>
    </div>
);
