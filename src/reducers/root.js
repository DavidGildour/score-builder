const rootReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_FIELD': {
            const { field, value } = action.payload;
            return {
                ...state,
                [field]: value,
            };
        }
        default: return state;
    }
};

export default rootReducer;
