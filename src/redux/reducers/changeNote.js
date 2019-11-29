/* eslint-disable object-shorthand */
import sortNotes from '../../utils/noteSorter';

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
                persistent: true,
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
            const newKeys = sortNotes(state.keys.concat([pitch]));
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
        case 'REMOVE_TONE': {
            const { noteHead } = action.payload;
            const newKeys = state.keys.filter((_, index) => index !== noteHead);
            const newModifiers = state.modifiers.filter((_, index) => index !== noteHead);
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
