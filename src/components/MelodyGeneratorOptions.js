import React from 'react';


const NoteSelection = (props) => (
        <select name={props.name} value={props.value} onChange={props.handleChange}>
            <option value="wd">Dotted wholenote</option>
            <option value="w">Wholenote</option>
            <option value="hd">Dotted halfnote</option>
            <option value="h">Halfnote</option>
            <option value="qd">Dotted quarternote</option>
            <option value="q">Quarternote</option>
            <option value="8d">Dotted eightnote</option>
            <option value="8">Eightnote</option>
            <option value="16d">Dotted sixteenth</option>
            <option value="16">Sixteenth</option>
            <option value="32d">Dotted Thirtysecond</option>
            <option value="32">Thirtysecond</option>
            <option value="64">Sixtyfourth</option>
        </select>
)

const IntervalSelection = (props) => (
    <select  name="interval" value={props.value} onChange={props.handleChange}>
        <option value="1 2">Minor second</option>
        <option value="2 2">Major second</option>
        <option value="3 3">Minor third</option>
        <option value="4 3">Major third</option>
        <option value="5 4">Perfect fourth</option>
        <option value="6 5">Tritone</option>
        <option value="7 5">Perfect fifth</option>
        <option value="8 6">Minor sixth</option>
        <option value="9 6">Major sixth</option>
        <option value="10 7">Minor seventh</option>
        <option value="11 7">Major seventh</option>
        <option value="12 8">Perfect octave</option>
    </select>
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
            <input className="waves-effect waves-light btn" type="submit" value="Generate melody" /><br />
            <label>
                <input type="checkbox" name="allowRests" id="allowRests" onChange={this.handleChange} checked={this.state.allowRests} />
                <span>Allow rests&nbsp;&nbsp;&nbsp;</span>
            </label>
            <label>
                <input type="checkbox" name="diatonic" id="diatonic" onChange={this.handleChange} checked={this.state.diatonic} />
                <span>Diatonic</span>
            </label><br />
            <table>
                <tbody>
                    <tr>
                        <td>
                            Shortest note:
                        </td>
                        <td>
                            <NoteSelection name="shortNote" handleChange={this.handleChange} value={this.state.shortNote} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Longest note:
                        </td>
                        <td>
                            <NoteSelection name="longNote" handleChange={this.handleChange} value={this.state.longNote} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Biggest interval:
                        </td>
                        <td>
                            <IntervalSelection handleChange={this.handleChange} value={this.state.interval} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
};
