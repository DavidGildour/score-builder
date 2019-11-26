import React from 'react';
import { noteToDuration } from './mappings/durationMappings'


const NoteSelection = (props) => (
    <div className="input-field">
        <select name={props.name} value={props.value} onChange={props.handleChange}>
            {Object.entries(props.lang.noteNames)
                .sort((a, b) => noteToDuration[a[0]] < noteToDuration[b[0]])
                .map(([key, value], i) => <option key={i} value={key}>{value}</option>)}
        </select>
        <label>{props.lang.label}</label>
    </div>
)

const IntervalSelection = (props) => (
    <div className="input-field">
        <select  name="interval" value={props.value} onChange={props.handleChange}>
            <option value="1 2">{props.lang.intervals.m2}</option>
            <option value="2 2">{props.lang.intervals.M2}</option>
            <option value="3 3">{props.lang.intervals.m3}</option>
            <option value="4 3">{props.lang.intervals.M3}</option>
            <option value="5 4">{props.lang.intervals.P4}</option>
            <option value="6 5">{props.lang.intervals.A4}</option>
            <option value="7 5">{props.lang.intervals.P5}</option>
            <option value="8 6">{props.lang.intervals.m6}</option>
            <option value="9 6">{props.lang.intervals.M6}</option>
            <option value="10 7">{props.lang.intervals.m7}</option>
            <option value="11 7">{props.lang.intervals.M7}</option>
            <option value="12 8">{props.lang.intervals.P8}</option>
        </select>
        <label>{props.lang.intervalLabel}</label>
    </div>
)

export default class extends React.Component {
    state = {
        allowRests: false,
        diatonic: true,
        shortNote: '8',
        longNote: 'h',
        interval: '7 5',
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.generate(this.state);
    }

    handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            this.setState(state => ({
                [name]: !state[name],
            }))
        } else {
            this.setState({
                [name]: value,
            })
        }
    }

    render = () => (
        <form onSubmit={this.handleSubmit}>
            <div className="row">
                <div className="col s3 top-margin">
                    <label>
                        <input type="checkbox" name="allowRests" id="allowRests" onChange={this.handleChange} checked={this.state.allowRests} />
                        <span>{this.props.lang.rests}&nbsp;&nbsp;&nbsp;</span>
                    </label>
                    <label>
                        <input type="checkbox" name="diatonic" id="diatonic" onChange={this.handleChange} checked={this.state.diatonic} />
                        <span>{this.props.lang.diatonic}</span>
                    </label>
                </div>
                <div className="col s3">
                    <NoteSelection
                        lang={{ label: this.props.lang.shortLabel, noteNames: this.props.noteNames}}
                        name="shortNote"
                        handleChange={this.handleChange}
                        value={this.state.shortNote} />
                </div>
                <div className="col s3">
                    <NoteSelection
                        lang={{ label: this.props.lang.longLabel, noteNames: this.props.noteNames}}
                        name="longNote"
                        handleChange={this.handleChange}
                        value={this.state.longNote} />
                </div>
                <div className="col s3">
                    <IntervalSelection lang={this.props.lang} handleChange={this.handleChange} value={this.state.interval} />
                </div>
            </div>
            <div className="row">
                <button name="generate" className="waves-effect waves-light btn fill" type="submit">
                    {this.props.lang.generate}<i className="material-icons right">cached</i>
                </button>
            </div>
        </form>
    )
};
