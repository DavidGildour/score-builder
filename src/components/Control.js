import React from 'react';

import './Control.css';

class Control extends React.Component {
    state = {
        clef: 'treble',
        beatsNum: '4',
        beatsType: '4',
    };

    changeHandler = (event) => {
        const { name, value, type } = event.target;

        if (type === 'number' && (value === '' || value < 1 || value > 32)) {
            return;
        }

        this.setState({
            [name]: value,
        });

        this.props.update(name, value);
    }

    render() {
        return (
            <div>
                <h3>Options:</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Select clef type:
                            </td>
                            <td>
                                <select className="ctrl" name="clef" value={this.state.clef} onChange={this.changeHandler}>
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
                                    <option value="tab">Tab clef</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Select time signature:
                            </td>
                            <td>
                                <input
                                    className="ctrl timesig"
                                    name="beatsNum"
                                    type="number"
                                    value={this.state.beatsNum}
                                    placeholder="4"
                                    onChange={this.changeHandler} />
                                /
                                <select className="ctrl" name="beatsType" value={this.state.beatsType} onChange={this.changeHandler}>
                                    <option value="2">2</option>
                                    <option value="4">4</option>
                                    <option value="8">8</option>
                                    <option value="16">16</option>
                                    <option value="32">32</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Select key signature:
                            </td>
                            <td>
                                <select className="ctrl" name="keySig" value={this.state.keySig} onChange={this.changeHandler}>
                                    <option value="Cb">Cb major/Ab minor</option>
                                    <option value="Gb">Gb major/Eb minor</option>
                                    <option value="Db">Db major/Bb minor</option>
                                    <option value="Ab">Ab major/F minor</option>
                                    <option value="Eb">Eb major/C minor</option>
                                    <option value="Bb">Bb major/G minor</option>
                                    <option value="F">F major/D minor</option>
                                    <option value="C" defaultValue>C major/A minor</option>
                                    <option value="G">G major/E minor</option>
                                    <option value="D">D major/B minor</option>
                                    <option value="A">A major/F# minor</option>
                                    <option value="E">E major/C# minor</option>
                                    <option value="B">B major/G# minor</option>
                                    <option value="F#">F# major/D# minor</option>
                                    <option value="C#">C# major/A# minor</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Control;
