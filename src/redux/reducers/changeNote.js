/* eslint-disable object-shorthand */
export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_CLEF': {
            console.log(action);
            const { clef } = action.payload;
            return {
                ...state,
                clef: clef,
            };
        }
        case 'CHANGE_PITCH': {
            console.log(action);
            const { keys } = action.payload;
            return {
                ...state,
                keys: keys,
            };
        }
        default: return state;
    }
};
