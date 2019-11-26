import React from 'react';
import M from 'materialize-css/dist/js/materialize.min';

export const ClefOptions = (props) => (
    <div className="input-field" name="clef">
        <select name="clef" value={props.clef} onChange={props.onChange}>
            <option value="treble" data-icon={process.env.PUBLIC_URL + '/clefs/treble.png'}>{props.lang.clefs.treble}</option>
            <option value="bass" data-icon={process.env.PUBLIC_URL + '/clefs/bass.png'}>{props.lang.clefs.bass}</option>
            <option value="alto" data-icon={process.env.PUBLIC_URL + '/clefs/alto.png'}>{props.lang.clefs.alto}</option>
            <option value="tenor" data-icon={process.env.PUBLIC_URL + '/clefs/tenor.png'}>{props.lang.clefs.tenor}</option>
            <option value="percussion" data-icon={process.env.PUBLIC_URL + '/clefs/percussion.png'}>{props.lang.clefs.percussion}</option>
            <option value="soprano" data-icon={process.env.PUBLIC_URL + '/clefs/soprano.png'}>{props.lang.clefs.soprano}</option>
            <option value="mezzo-soprano" data-icon={process.env.PUBLIC_URL + '/clefs/mezzosoprano.png'}>{props.lang.clefs.mezzoSoprano}</option>
            <option value="baritone-c" data-icon={process.env.PUBLIC_URL + '/clefs/baritone-c.png'}>{props.lang.clefs.baritone_c}</option>
            <option value="baritone-f" data-icon={process.env.PUBLIC_URL + '/clefs/baritone-f.png'}>{props.lang.clefs.baritone_f}</option>
            <option value="subbass" data-icon={process.env.PUBLIC_URL + '/clefs/subbass.png'}>{props.lang.clefs.subbass}</option>
            <option value="french" data-icon={process.env.PUBLIC_URL + '/clefs/french.png'}>{props.lang.clefs.french}</option>
        </select>
        <label>{props.lang.label}</label>
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
                    onChange={props.onChange} />
                    <label htmlFor="beatsNum">{props.lang.numLabel}</label>
            </div>
        </div>
        <div className="col s6">
            <div className="input-field" name="beatsType">
                <select id="beatsType" name="beatsType" value={props.beatsType} onChange={props.onChange}>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                </select>
                <label htmlFor="beatsType">{props.lang.typeLabel}</label>
            </div>
        </div>
    </div>
)

export const KeyOptions = (props) => (
    <div className="input-field" name="keySig">
        <select name="keySig" value={props.keySig} onChange={props.onChange}>
            <option value="Cb" data-icon={process.env.PUBLIC_URL + '/keys/Cb.png'}>{props.lang.keys.Cb}</option>
            <option value="Gb" data-icon={process.env.PUBLIC_URL + '/keys/Gb.png'}>{props.lang.keys.Gb}</option>
            <option value="Db" data-icon={process.env.PUBLIC_URL + '/keys/Db.png'}>{props.lang.keys.Db}</option>
            <option value="Ab" data-icon={process.env.PUBLIC_URL + '/keys/Ab.png'}>{props.lang.keys.Ab}</option>
            <option value="Eb" data-icon={process.env.PUBLIC_URL + '/keys/Eb.png'}>{props.lang.keys.Eb}</option>
            <option value="Bb" data-icon={process.env.PUBLIC_URL + '/keys/Bb.png'}>{props.lang.keys.Bb}</option>
            <option value="F" data-icon={process.env.PUBLIC_URL + '/keys/F.png'}>{props.lang.keys.F}</option>
            <option value="C" data-icon={process.env.PUBLIC_URL + '/keys/C.png'}>{props.lang.keys.C}</option>
            <option value="G" data-icon={process.env.PUBLIC_URL + '/keys/G.png'}>{props.lang.keys.G}</option>
            <option value="D" data-icon={process.env.PUBLIC_URL + '/keys/D.png'}>{props.lang.keys.D}</option>
            <option value="A" data-icon={process.env.PUBLIC_URL + '/keys/A.png'}>{props.lang.keys.A}</option>
            <option value="E" data-icon={process.env.PUBLIC_URL + '/keys/E.png'}>{props.lang.keys.E}</option>
            <option value="B" data-icon={process.env.PUBLIC_URL + '/keys/B.png'}>{props.lang.keys.B}</option>
            <option value="F#" data-icon={process.env.PUBLIC_URL + '/keys/Fsh.png'}>{props.lang.keys.Fsh}</option>
            <option value="C#" data-icon={process.env.PUBLIC_URL + '/keys/Csh.png'}>{props.lang.keys.Csh}</option>
        </select>
        <label>{props.lang.label}</label>
    </div>
);

export const NoteDuration = (props) => (
    <div className="row" id="note-duration">
        <div className="col s2 center-align">
            <div className="switch">
                <label>
                    {props.lang.options.addMode}
                    <input type="checkbox" name="editMode" onChange={props.onChange} checked={props.editMode} />
                    <span className="lever"></span>
                    {props.lang.options.editMode}
                </label>
            </div>
        </div>
        <div className="col s10 center-align">
            <label>
                <input type="radio" name="duration" value="w" id="w" onChange={props.onChange} checked={props.duration === "w"} />
                <span>{props.lang.noteNames.w}&nbsp;&nbsp;&nbsp;</span>
            </label>
            <label>
                <input type="radio" name="duration" value="h" id="h" onChange={props.onChange} checked={props.duration === "h"} />
                <span>{props.lang.noteNames.h}&nbsp;&nbsp;&nbsp;</span>
            </label>
            <label>
                <input type="radio" name="duration" value="q" id="q" onChange={props.onChange} checked={props.duration === "q"} />
                <span>{props.lang.noteNames.q}&nbsp;&nbsp;&nbsp;</span>
            </label>
            <label>
                <input type="radio" name="duration" value="8" id="8" onChange={props.onChange} checked={props.duration === "8"} />
                <span>{props.lang.noteNames['8']}&nbsp;&nbsp;&nbsp;</span>
            </label>
            <label>
                <input type="radio" name="duration" value="16" id="16" onChange={props.onChange} checked={props.duration === "16"} />
                <span>{props.lang.noteNames['16']}&nbsp;&nbsp;&nbsp;</span>
            </label>
            <label>
                <input type="radio" name="duration" value="32" id="32" onChange={props.onChange} checked={props.duration === "32"} />
                <span>{props.lang.noteNames['32']}&nbsp;&nbsp;&nbsp;</span>
            </label>
            <label>
                <input type="radio" name="duration" value="64" id="64" onChange={props.onChange} checked={props.duration === "64"} />
                <span>{props.lang.noteNames['64']}</span>
            </label>
            <br />
            <label>
                <input type="checkbox" name="dotted" id="dotted" onChange={props.onChange} checked={props.dotted} />
                <span>{props.lang.noteModifiers.dot}&nbsp;&nbsp;&nbsp;</span>
            </label>
            <label>
                <input type="checkbox" name="restMode" id="rest" onChange={props.onChange} checked={props.restMode} />
                <span>{props.lang.noteModifiers.rest}</span>
            </label>
        </div>
    </div>
);

export const AddRemoveMeasure = (props) => (
    <div className="row">
        <div className="col s9">
            <button name="addMeasure" className="btn top-margin fill" onClick={props.add}>
                {props.text}<i className="material-icons right">add</i>
            </button>
        </div>
        <div className="col s3">
            <button name="removeMeasure" className="btn top-margin fill" onClick={props.remove}>
                <i className="material-icons right">remove</i>
            </button>
        </div>
    </div>
);

export const AddRandomNote = (props) => (
    <button name="addRandomNote" className="waves-effect waves-light btn fill" onClick={props.onSubmit}>
        {props.text}<i className="material-icons right">cached</i>
    </button>
);

export const RemoveNote = (props) => (
    <button name="removeNote" className="waves-effect waves-light btn fill" onClick={props.onClick}>
        {props.text}<i className="material-icons right">remove</i>
    </button>
);

export class Voices extends React.Component {
    componentDidUpdate = (prevProps) => {
        if (prevProps.voices.length !== this.props.voices.length) {
            M.FormSelect.init(document.querySelector('#voices select'));
        }
    }

    render = () => (
        <div className="input-field" id="voices">
            <select name="currentVoice" value={this.props.currentVoice} onChange={this.props.onChange}>
            {this.props.voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                    {this.props.lang.mapping[voice.id]}
                </option>
            ))}
            </select>
            <label>{this.props.lang.label}</label>
        </div>
    )
};

export const AddRemoveVoice = (props) => (
    <div className="row top-margin">
        <div className="col s4">
            <button className="waves-effect waves-light btn fill" name="addVoice" onClick={props.addVoice}>
                {props.lang.add}<i className="material-icons right">add</i>
            </button>
        </div>
        <div className="col s4">
            <button className="waves-effect waves-light btn fill" name="removeVoice" onClick={props.removeVoice}>
                {props.lang.remove}<i className="material-icons right">remove</i>
            </button>
        </div>
        <div className="col s4">
            <button className="waves-effect waves-light btn fill" name="clearVoices" onClick={props.clearVoices}>
                {props.lang.clear}<i className="material-icons right">clear</i>
            </button>
        </div>
    </div>
);
