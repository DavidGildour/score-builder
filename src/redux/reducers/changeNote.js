/* eslint-disable object-shorthand */
import noteOrder from '../../components/mappings/noteOrderMapping';

export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_CLEF': {
            // console.log(action);
            const { clef } = action.payload;
            return {
                ...state,
                clef: clef,
            };
        }
        case 'CHANGE_PITCH': {
            // console.log(action);
            const { keys } = action.payload;
            return {
                ...state,
                keys: keys,
                modifiers: state.modifiers.map((e, i) => {
                    const newAcc = keys[i].match(/[#b]+/);
                    const oldAcc = e.match(/[#b]+/);
                    const newMods = oldAcc === null ? e + (newAcc || '') : e.replace(oldAcc[0], newAcc === null ? '' : newAcc[0])
                    return newMods === null ? '' : newMods;
                }),
            };
        }
        case 'CHANGE_DURATION': {
            const { duration } = action.payload;
            let newModifiers;
            if (duration.includes('d')) {
                newModifiers = state.modifiers.map(mod => mod.includes('.') ? mod : mod + '.');
            } else {
                newModifiers = state.modifiers.map(mod => mod.replace('.', ''));
            }
            return {
                ...state,
                duration: duration,
                modifiers: newModifiers,
                persistent: true,
            }
        }
        case 'ADD_TONE': {
            const { pitch } = action.payload;
            const newKeys = state.keys.concat([pitch])
                .sort((note1, note2) => {
                    const _pitch1 = note1.match(/(.*)\//)[1];
                    const _pitch2 = note2.match(/(.*)\//)[1];
                    return noteOrder[_pitch1] - noteOrder[_pitch2];
                })
                .sort((note1, note2) => {
                    const octave1 = note1.match(/\d/)[0];
                    const octave2 = note2.match(/\d/)[0];
                    return octave1 - octave2;
                });
            let mandatoryMods = '';
            if (state.modifiers[0].includes('.')) mandatoryMods += '.';
            const accidentals = pitch.match(/[#b]+/);
            const newModifiers = state.modifiers.concat(accidentals ? [mandatoryMods + accidentals[0]] : [mandatoryMods]);
            return {
                ...state,
                keys: newKeys,
                modifiers: newModifiers
            }
        }
        case 'MAKE_REST': {
            return {
                ...state,
                duration: state.duration + 'r',
                persistent: false,
            }
        }
        case 'MAKE_NOT_REST': {
            return {
                ...state,
                duration: state.duration.replace('r', ''),
                persistent: true,
            }
        }
        default: return state;
    }
};
